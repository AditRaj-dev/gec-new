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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamScopeGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const team_scope_decorator_1 = require("../decorators/team-scope.decorator");
const roles_enum_1 = require("../constants/roles.enum");
let TeamScopeGuard = class TeamScopeGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const paramName = this.reflector.getAllAndOverride(team_scope_decorator_1.TEAM_SCOPE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!paramName) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('User is not authenticated.');
        }
        if (user.role === roles_enum_1.Role.SUPER_ADMIN || user.role === roles_enum_1.Role.CORE_TEAM_ADMIN) {
            return true;
        }
        if (user.role === roles_enum_1.Role.TEAM_HEAD) {
            const targetTeam = request.params?.[paramName] ||
                request.body?.[paramName] ||
                request.query?.[paramName];
            if (!targetTeam || targetTeam !== user.teamScope) {
                throw new common_1.ForbiddenException(`Team Head with scope '${user.teamScope}' cannot manage team '${targetTeam}'.`);
            }
            return true;
        }
        return true;
    }
};
exports.TeamScopeGuard = TeamScopeGuard;
exports.TeamScopeGuard = TeamScopeGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], TeamScopeGuard);
//# sourceMappingURL=team-scope.guard.js.map