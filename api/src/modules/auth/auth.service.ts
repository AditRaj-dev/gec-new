import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { CoreDatabaseService } from '../../database/core-database.service';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { ROLE_PERMISSIONS, Role } from '../../common/constants/roles.enum';
import { LoginDto, ResetPasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private coreDb: CoreDatabaseService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto, ip?: string, userAgent?: string) {
    const { email, password } = loginDto;
    const res = await this.coreDb.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    const user = res.rows[0];

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Account is inactive. Contact platform administrator.');
    }

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      throw new UnauthorizedException('Account is temporarily locked due to repeated failed logins. Try again later.');
    }

    const isValid = await CryptoUtil.verifyPassword(user.password_hash, password);
    if (!isValid) {
      const attempts = (user.failed_login_attempts || 0) + 1;
      let lockedUntil: Date | null = null;
      if (attempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
      }
      await this.coreDb.query(
        'UPDATE users SET failed_login_attempts = $1, locked_until = $2, updated_at = NOW() WHERE id = $3',
        [attempts, lockedUntil, user.id],
      );
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Reset failed attempts
    await this.coreDb.query(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, updated_at = NOW() WHERE id = $1',
      [user.id],
    );

    const role = user.role as Role;
    const permissions = ROLE_PERMISSIONS[role] || [];

    const accessToken = this.generateAccessToken(user.id, user.email, role);

    // Create rotating refresh session
    const rawRefreshToken = CryptoUtil.randomToken(32);
    const tokenHash = CryptoUtil.sha256(rawRefreshToken);
    const familyId = uuidv4();
    const refreshTtl = this.configService.get<number>('jwt.refreshTokenTtlSeconds') || 604800;
    const expiresAt = new Date(Date.now() + refreshTtl * 1000);

    await this.coreDb.query(
      `INSERT INTO refresh_sessions (id, user_id, token_hash, family_id, is_revoked, expires_at, created_at, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, false, $5, NOW(), $6, $7)`,
      [uuidv4(), user.id, tokenHash, familyId, expiresAt, ip || null, userAgent || null],
    );

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        teamScope: user.team_scope,
        permissions,
      },
    };
  }

  async refresh(refreshToken: string, ip?: string, userAgent?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required.');
    }

    const tokenHash = CryptoUtil.sha256(refreshToken);
    const res = await this.coreDb.query(
      'SELECT * FROM refresh_sessions WHERE token_hash = $1',
      [tokenHash],
    );
    const session = res.rows[0];

    if (!session) {
      throw new UnauthorizedException('Invalid refresh session.');
    }

    // Reuse detection: if token is already revoked, revoke the whole family!
    if (session.is_revoked) {
      this.logger.warn(`Potential token reuse detected for family ${session.family_id}. Revoking family.`);
      await this.coreDb.query(
        'UPDATE refresh_sessions SET is_revoked = true WHERE family_id = $1',
        [session.family_id],
      );
      throw new UnauthorizedException('Reused or revoked refresh token. Token family revoked. Please log in again.');
    }

    if (new Date(session.expires_at) < new Date()) {
      throw new UnauthorizedException('Refresh token has expired. Please log in again.');
    }

    // Invalidate the old token
    await this.coreDb.query(
      'UPDATE refresh_sessions SET is_revoked = true WHERE id = $1',
      [session.id],
    );

    // Get user
    const userRes = await this.coreDb.query('SELECT * FROM users WHERE id = $1', [session.user_id]);
    const user = userRes.rows[0];
    if (!user || !user.is_active) {
      throw new UnauthorizedException('User account is inactive or not found.');
    }

    // Issue new access token and rotated refresh token in the same family
    const newAccessToken = this.generateAccessToken(user.id, user.email, user.role);
    const newRawRefreshToken = CryptoUtil.randomToken(32);
    const newTokenHash = CryptoUtil.sha256(newRawRefreshToken);
    const refreshTtl = this.configService.get<number>('jwt.refreshTokenTtlSeconds') || 604800;
    const expiresAt = new Date(Date.now() + refreshTtl * 1000);

    await this.coreDb.query(
      `INSERT INTO refresh_sessions (id, user_id, token_hash, family_id, is_revoked, expires_at, created_at, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, false, $5, NOW(), $6, $7)`,
      [uuidv4(), user.id, newTokenHash, session.family_id, expiresAt, ip || null, userAgent || null],
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRawRefreshToken,
    };
  }

  async logout(refreshToken?: string) {
    if (refreshToken) {
      const tokenHash = CryptoUtil.sha256(refreshToken);
      await this.coreDb.query(
        'UPDATE refresh_sessions SET is_revoked = true WHERE token_hash = $1',
        [tokenHash],
      );
    }
    return { success: true, message: 'Logged out successfully.' };
  }

  async forgotPassword(email: string) {
    const res = await this.coreDb.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    const user = res.rows[0];

    // Generic response regardless of whether user exists to prevent email enumeration
    if (!user) {
      return {
        success: true,
        message: 'If the account exists, a password reset link has been dispatched.',
      };
    }

    const resetToken = CryptoUtil.randomToken(32);
    const tokenHash = CryptoUtil.sha256(resetToken);
    const resetTtl = this.configService.get<number>('jwt.passwordResetTtlSeconds') || 3600;
    const expiresAt = new Date(Date.now() + resetTtl * 1000);

    await this.coreDb.query(
      `INSERT INTO password_resets (id, user_id, token_hash, is_used, expires_at, created_at)
       VALUES ($1, $2, $3, false, $4, NOW())`,
      [uuidv4(), user.id, tokenHash, expiresAt],
    );

    const isDev = this.configService.get<string>('app.nodeEnv') === 'development';

    return {
      success: true,
      message: 'If the account exists, a password reset link has been dispatched.',
      ...(isDev ? { devToken: resetToken } : {}),
    };
  }

  async resetPassword(resetDto: ResetPasswordDto) {
    const { token, newPassword } = resetDto;
    const tokenHash = CryptoUtil.sha256(token);

    const res = await this.coreDb.query(
      'SELECT * FROM password_resets WHERE token_hash = $1',
      [tokenHash],
    );
    const resetRecord = res.rows[0];

    if (!resetRecord || resetRecord.is_used || new Date(resetRecord.expires_at) < new Date()) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    const newHash = await CryptoUtil.hashPassword(newPassword);

    await this.coreDb.query(
      'UPDATE users SET password_hash = $1, failed_login_attempts = 0, locked_until = NULL, updated_at = NOW() WHERE id = $2',
      [newHash, resetRecord.user_id],
    );

    // Mark reset record as used
    await this.coreDb.query(
      'UPDATE password_resets SET is_used = true WHERE id = $1',
      [resetRecord.id],
    );

    // Revoke all existing sessions for security
    await this.coreDb.query(
      'UPDATE refresh_sessions SET is_revoked = true WHERE user_id = $1',
      [resetRecord.user_id],
    );

    return { success: true, message: 'Password has been reset successfully.' };
  }

  private generateAccessToken(userId: string, email: string, role: string): string {
    const accessTtl = this.configService.get<number>('jwt.accessTtlSeconds') || 900;
    return this.jwtService.sign(
      { sub: userId, email, role },
      {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: `${accessTtl}s`,
      },
    );
  }
}
