import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TEAM_SCOPE_KEY } from '../decorators/team-scope.decorator';
import { Role } from '../constants/roles.enum';
import { AuthenticatedUser } from '../decorators/current-user.decorator';

@Injectable()
export class TeamScopeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const paramName = this.reflector.getAllAndOverride<string>(TEAM_SCOPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!paramName) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user) {
      throw new ForbiddenException('User is not authenticated.');
    }

    // Super Admin and Core Team Admin can manage all teams
    if (user.role === Role.SUPER_ADMIN || user.role === Role.CORE_TEAM_ADMIN) {
      return true;
    }

    // If Team Head, check if target team matches user's teamScope
    if (user.role === Role.TEAM_HEAD) {
      const targetTeam =
        request.params?.[paramName] ||
        request.body?.[paramName] ||
        request.query?.[paramName];

      if (!targetTeam || targetTeam !== user.teamScope) {
        throw new ForbiddenException(
          `Team Head with scope '${user.teamScope}' cannot manage team '${targetTeam}'.`,
        );
      }
      return true;
    }

    return true;
  }
}
