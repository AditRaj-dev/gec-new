import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Permission, Role } from '../constants/roles.enum';
import { AuthenticatedUser } from '../decorators/current-user.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user) {
      throw new ForbiddenException('User is not authenticated.');
    }

    // Super Admin has all permissions
    if (user.role === Role.SUPER_ADMIN) {
      return true;
    }

    const userPermissions = new Set(user.permissions || []);
    const hasAll = requiredPermissions.every((perm) => userPermissions.has(perm));

    if (!hasAll) {
      throw new ForbiddenException(
        `User lacks required permissions: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
