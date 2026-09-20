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
exports.CmsHeroController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hero_service_1 = require("./hero.service");
const hero_spotlight_dto_1 = require("./dto/hero-spotlight.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const roles_enum_1 = require("../../common/constants/roles.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let CmsHeroController = class CmsHeroController {
    constructor(heroService) {
        this.heroService = heroService;
    }
    async create(dto, user) {
        return this.heroService.create(dto, user.id);
    }
    async list() {
        return this.heroService.list();
    }
    async get(id) {
        return this.heroService.get(id);
    }
    async update(id, dto, user) {
        return this.heroService.update(id, dto, user.id);
    }
    async publish(id, user) {
        return this.heroService.publish(id, user.id);
    }
};
exports.CmsHeroController = CmsHeroController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.HERO_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Create campaign for Hero Spotlight (P0-P2 priority)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [hero_spotlight_dto_1.CreateHeroSpotlightDto, Object]),
    __metadata("design:returntype", Promise)
], CmsHeroController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.HERO_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'List all hero spotlight campaigns' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CmsHeroController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.HERO_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Get hero campaign by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsHeroController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.HERO_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Update hero spotlight campaign' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, hero_spotlight_dto_1.UpdateHeroSpotlightDto, Object]),
    __metadata("design:returntype", Promise)
], CmsHeroController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.CONTENT_PUBLISH),
    (0, swagger_1.ApiOperation)({ summary: 'Publish hero spotlight snapshot to live website' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CmsHeroController.prototype, "publish", null);
exports.CmsHeroController = CmsHeroController = __decorate([
    (0, swagger_1.ApiTags)('CMS Hero Spotlight'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('v1/cms/hero'),
    __metadata("design:paramtypes", [hero_service_1.HeroService])
], CmsHeroController);
//# sourceMappingURL=cms-hero.controller.js.map