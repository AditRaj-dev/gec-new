import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { CoreDatabaseService } from '../../../database/core-database.service';
import { ROLE_PERMISSIONS, Role } from '../../../common/constants/roles.enum';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private coreDb: CoreDatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret') || 'dev_access_secret_min_32_characters_long_12345678',
    });
  }

  async validate(payload: any): Promise<AuthenticatedUser> {
    const { sub: userId } = payload;
    const res = await this.coreDb.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = res.rows[0];

    if (!user || !user.is_active) {
      throw new UnauthorizedException('User account is inactive or not found.');
    }

    const role = user.role as Role;
    const permissions = ROLE_PERMISSIONS[role] || [];

    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      teamScope: user.team_scope,
      permissions,
    };
  }
}
