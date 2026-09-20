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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsTeamsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const teams_service_1 = require("./teams.service");
const team_dto_1 = require("./dto/team.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const team_scope_guard_1 = require("../../common/guards/team-scope.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const team_scope_decorator_1 = require("../../common/decorators/team-scope.decorator");
const roles_enum_1 = require("../../common/constants/roles.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let CmsTeamsController = class CmsTeamsController {
    constructor(teamsService) {
        this.teamsService = teamsService;
    }
    async create(dto, user) {
        return this.teamsService.create(dto, user.id);
    }
    async list() {
        return this.teamsService.list();
    }
    async get(id) {
        return this.teamsService.get(id);
    }
    async update(id, dto, user) {
        return this.teamsService.update(id, dto, user.id);
    }
    async publish(id, user) {
        return this.teamsService.publish(id, user.id);
    }
};
exports.CmsTeamsController = CmsTeamsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.TEAMS_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'Create team definition' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [team_dto_1.CreateTeamDto, Object]),
    __metadata("design:returntype", Promise)
], CmsTeamsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.TEAMS_READ),
    (0, swagger_1.ApiOperation)({ summary: 'List all teams in CMS' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CmsTeamsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.TEAMS_READ),
    (0, team_scope_decorator_1.CheckTeamScope)('id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get team details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsTeamsController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.TEAMS_EDIT),
    (0, team_scope_decorator_1.CheckTeamScope)('id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update team details and members' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, team_dto_1.UpdateTeamDto, Object]),
    __metadata("design:returntype", Promise)
], CmsTeamsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.CONTENT_PUBLISH),
    (0, swagger_1.ApiOperation)({ summary: 'Publish team profile' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CmsTeamsController.prototype, "publish", null);
exports.CmsTeamsController = CmsTeamsController = __decorate([
    (0, swagger_1.ApiTags)('CMS Teams Management (01-07)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard, team_scope_guard_1.TeamScopeGuard),
    (0, common_1.Controller)('v1/cms/teams'),
    __metadata("design:paramtypes", [teams_service_1.TeamsService])
], CmsTeamsController);
//# sourceMappingURL=cms-teams.controller.js.map