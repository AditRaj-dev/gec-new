"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const core_database_service_1 = require("../../database/core-database.service");
const crypto_util_1 = require("../../common/utils/crypto.util");
const roles_enum_1 = require("../../common/constants/roles.enum");
let AuthService = AuthService_1 = class AuthService {
    constructor(coreDb, jwtService, configService) {
        this.coreDb = coreDb;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async login(loginDto, ip, userAgent) {
        const { email, password } = loginDto;
        const res = await this.coreDb.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
        const user = res.rows[0];
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        if (!user.is_active) {
            throw new common_1.UnauthorizedException('Account is inactive. Contact platform administrator.');
        }
        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            throw new common_1.UnauthorizedException('Account is temporarily locked due to repeated failed logins. Try again later.');
        }
        const isValid = await crypto_util_1.CryptoUtil.verifyPassword(user.password_hash, password);
        if (!isValid) {
            const attempts = (user.failed_login_attempts || 0) + 1;
            let lockedUntil = null;
            if (attempts >= 5) {
                lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            }
            await this.coreDb.query('UPDATE users SET failed_login_attempts = $1, locked_until = $2, updated_at = NOW() WHERE id = $3', [attempts, lockedUntil, user.id]);
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        await this.coreDb.query('UPDATE users SET failed_login_attempts = 0, locked_until = NULL, updated_at = NOW() WHERE id = $1', [user.id]);
        const role = user.role;
        const permissions = roles_enum_1.ROLE_PERMISSIONS[role] || [];
        const accessToken = this.generateAccessToken(user.id, user.email, role);
        const rawRefreshToken = crypto_util_1.CryptoUtil.randomToken(32);
        const tokenHash = crypto_util_1.CryptoUtil.sha256(rawRefreshToken);
        const familyId = (0, uuid_1.v4)();
        const refreshTtl = this.configService.get('jwt.refreshTokenTtlSeconds') || 604800;
        const expiresAt = new Date(Date.now() + refreshTtl * 1000);
        await this.coreDb.query(`INSERT INTO refresh_sessions (id, user_id, token_hash, family_id, is_revoked, expires_at, created_at, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, false, $5, NOW(), $6, $7)`, [(0, uuid_1.v4)(), user.id, tokenHash, familyId, expiresAt, ip || null, userAgent || null]);
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
    async refresh(refreshToken, ip, userAgent) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token is required.');
        }
        const tokenHash = crypto_util_1.CryptoUtil.sha256(refreshToken);
        const res = await this.coreDb.query('SELECT * FROM refresh_sessions WHERE token_hash = $1', [tokenHash]);
        const session = res.rows[0];
        if (!session) {
            throw new common_1.UnauthorizedException('Invalid refresh session.');
        }
        if (session.is_revoked) {
            this.logger.warn(`Potential token reuse detected for family ${session.family_id}. Revoking family.`);
            await this.coreDb.query('UPDATE refresh_sessions SET is_revoked = true WHERE family_id = $1', [session.family_id]);
            throw new common_1.UnauthorizedException('Reused or revoked refresh token. Token family revoked. Please log in again.');
        }
        if (new Date(session.expires_at) < new Date()) {
            throw new common_1.UnauthorizedException('Refresh token has expired. Please log in again.');
        }
        await this.coreDb.query('UPDATE refresh_sessions SET is_revoked = true WHERE id = $1', [session.id]);
        const userRes = await this.coreDb.query('SELECT * FROM users WHERE id = $1', [session.user_id]);
        const user = userRes.rows[0];
        if (!user || !user.is_active) {
            throw new common_1.UnauthorizedException('User account is inactive or not found.');
        }
        const newAccessToken = this.generateAccessToken(user.id, user.email, user.role);
        const newRawRefreshToken = crypto_util_1.CryptoUtil.randomToken(32);
        const newTokenHash = crypto_util_1.CryptoUtil.sha256(newRawRefreshToken);
        const refreshTtl = this.configService.get('jwt.refreshTokenTtlSeconds') || 604800;
        const expiresAt = new Date(Date.now() + refreshTtl * 1000);
        await this.coreDb.query(`INSERT INTO refresh_sessions (id, user_id, token_hash, family_id, is_revoked, expires_at, created_at, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, false, $5, NOW(), $6, $7)`, [(0, uuid_1.v4)(), user.id, newTokenHash, session.family_id, expiresAt, ip || null, userAgent || null]);
        return {
            accessToken: newAccessToken,
            refreshToken: newRawRefreshToken,
        };
    }
    async logout(refreshToken) {
        if (refreshToken) {
            const tokenHash = crypto_util_1.CryptoUtil.sha256(refreshToken);
            await this.coreDb.query('UPDATE refresh_sessions SET is_revoked = true WHERE token_hash = $1', [tokenHash]);
        }
        return { success: true, message: 'Logged out successfully.' };
    }
    async forgotPassword(email) {
        const res = await this.coreDb.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
        const user = res.rows[0];
        if (!user) {
            return {
                success: true,
                message: 'If the account exists, a password reset link has been dispatched.',
            };
        }
        const resetToken = crypto_util_1.CryptoUtil.randomToken(32);
        const tokenHash = crypto_util_1.CryptoUtil.sha256(resetToken);
        const resetTtl = this.configService.get('jwt.passwordResetTtlSeconds') || 3600;
        const expiresAt = new Date(Date.now() + resetTtl * 1000);
        await this.coreDb.query(`INSERT INTO password_resets (id, user_id, token_hash, is_used, expires_at, created_at)
       VALUES ($1, $2, $3, false, $4, NOW())`, [(0, uuid_1.v4)(), user.id, tokenHash, expiresAt]);
        const isDev = this.configService.get('app.nodeEnv') === 'development';
        return {
            success: true,
            message: 'If the account exists, a password reset link has been dispatched.',
            ...(isDev ? { devToken: resetToken } : {}),
        };
    }
    async resetPassword(resetDto) {
        const { token, newPassword } = resetDto;
        const tokenHash = crypto_util_1.CryptoUtil.sha256(token);
        const res = await this.coreDb.query('SELECT * FROM password_resets WHERE token_hash = $1', [tokenHash]);
        const resetRecord = res.rows[0];
        if (!resetRecord || resetRecord.is_used || new Date(resetRecord.expires_at) < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired password reset token.');
        }
        const newHash = await crypto_util_1.CryptoUtil.hashPassword(newPassword);
        await this.coreDb.query('UPDATE users SET password_hash = $1, failed_login_attempts = 0, locked_until = NULL, updated_at = NOW() WHERE id = $2', [newHash, resetRecord.user_id]);
        await this.coreDb.query('UPDATE password_resets SET is_used = true WHERE id = $1', [resetRecord.id]);
        await this.coreDb.query('UPDATE refresh_sessions SET is_revoked = true WHERE user_id = $1', [resetRecord.user_id]);
        return { success: true, message: 'Password has been reset successfully.' };
    }
    generateAccessToken(userId, email, role) {
        const accessTtl = this.configService.get('jwt.accessTtlSeconds') || 900;
        return this.jwtService.sign({ sub: userId, email, role }, {
            secret: this.configService.get('jwt.accessSecret'),
            expiresIn: `${accessTtl}s`,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_database_service_1.CoreDatabaseService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map