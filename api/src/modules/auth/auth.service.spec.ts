import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { CoreDatabaseService } from '../../database/core-database.service';
import { CryptoUtil } from '../../common/utils/crypto.util';
import { Role } from '../../common/constants/roles.enum';

describe('AuthService (Login, Argon2id, Refresh Rotation & Reuse Detection)', () => {
  let service: AuthService;
  let coreDbMock: any;
  let jwtServiceMock: any;

  beforeEach(async () => {
    coreDbMock = {
      query: jest.fn(),
    };

    jwtServiceMock = {
      sign: jest.fn().mockReturnValue('mock_jwt_access_token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: CoreDatabaseService, useValue: coreDbMock },
        { provide: JwtService, useValue: jwtServiceMock },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'jwt.accessSecret') return 'test_jwt_secret_min_32_characters';
              if (key === 'jwt.refreshTokenTtlSeconds') return 604800;
              if (key === 'jwt.accessTtlSeconds') return 900;
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully log in with valid credentials and return access + refresh tokens', async () => {
    const password = 'Password@123';
    const passwordHash = await CryptoUtil.hashPassword(password);

    coreDbMock.query
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'user-123',
            email: 'admin@gec.org',
            password_hash: passwordHash,
            full_name: 'Admin User',
            role: Role.SUPER_ADMIN,
            is_active: true,
          },
        ],
        rowCount: 1,
      }) // SELECT users
      .mockResolvedValueOnce({ rows: [], rowCount: 1 }) // UPDATE users (reset attempts)
      .mockResolvedValueOnce({ rows: [], rowCount: 1 }); // INSERT refresh_sessions

    const result = await service.login({ email: 'admin@gec.org', password });

    expect(result.accessToken).toBe('mock_jwt_access_token');
    expect(result.refreshToken).toBeDefined();
    expect(result.user.email).toBe('admin@gec.org');
    expect(result.user.role).toBe(Role.SUPER_ADMIN);
  });

  it('should reject login on invalid password', async () => {
    const passwordHash = await CryptoUtil.hashPassword('CorrectPassword123');

    coreDbMock.query
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'user-123',
            email: 'admin@gec.org',
            password_hash: passwordHash,
            is_active: true,
            failed_login_attempts: 0,
          },
        ],
        rowCount: 1,
      })
      .mockResolvedValueOnce({ rows: [], rowCount: 1 }); // UPDATE attempts

    await expect(
      service.login({ email: 'admin@gec.org', password: 'WrongPassword123' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should revoke entire token family upon reuse of an already revoked refresh token', async () => {
    const rawToken = 'revoked_refresh_token_123';
    const tokenHash = CryptoUtil.sha256(rawToken);

    coreDbMock.query
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'session-123',
            user_id: 'user-123',
            token_hash: tokenHash,
            family_id: 'family-xyz',
            is_revoked: true, // ALREADY REVOKED! (Reuse attempt)
            expires_at: new Date(Date.now() + 100000),
          },
        ],
        rowCount: 1,
      })
      .mockResolvedValueOnce({ rows: [], rowCount: 1 }); // UPDATE family revoked

    await expect(service.refresh(rawToken)).rejects.toThrow(
      'Reused or revoked refresh token. Token family revoked. Please log in again.',
    );

    // Verify all sessions in this family are revoked
    expect(coreDbMock.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE refresh_sessions SET is_revoked = true WHERE family_id = $1'),
      ['family-xyz'],
    );
  });
});
