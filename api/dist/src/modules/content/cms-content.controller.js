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
exports.CmsContentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const content_service_1 = require("./content.service");
const content_dto_1 = require("./dto/content.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const roles_enum_1 = require("../../common/constants/roles.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let CmsContentController = class CmsContentController {
    constructor(contentService) {
        this.contentService = contentService;
    }
    async createDraft(dto, user) {
        return this.contentService.createDraft(dto, user.id);
    }
    async listDrafts(entityType) {
        return this.contentService.listDrafts(entityType);
    }
    async getDraft(id) {
        return this.contentService.getDraft(id);
    }
    async updateDraft(id, dto, ifMatch, user) {
        const parsedIfMatch = ifMatch ? parseInt(ifMatch, 10) : undefined;
        return this.contentService.updateDraft(id, dto, parsedIfMatch, user?.id);
    }
    async transitionWorkflow(id, dto, user) {
        return this.contentService.transitionWorkflow(id, dto, user.id);
    }
    async publish(id, idempotencyKey, user) {
        return this.contentService.publish(id, idempotencyKey, user.id);
    }
};
exports.CmsContentController = CmsContentController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.CONTENT_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'Create new content draft document' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [content_dto_1.CreateContentDraftDto, Object]),
    __metadata("design:returntype", Promise)
], CmsContentController.prototype, "createDraft", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.CONTENT_READ),
    (0, swagger_1.ApiOperation)({ summary: 'List draft documents' }),
    __param(0, (0, common_1.Query)('entityType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsContentController.prototype, "listDrafts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.CONTENT_READ),
    (0, swagger_1.ApiOperation)({ summary: 'Get draft document by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsContentController.prototype, "getDraft", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.CONTENT_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'Update draft document with optimistic concurrency check' }),
    (0, swagger_1.ApiHeader)({ name: 'If-Match', required: false, description: 'Expected version number' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('if-match')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, content_dto_1.UpdateContentDraftDto, String, Object]),
    __metadata("design:returntype", Promise)
], CmsContentController.prototype, "updateDraft", null);
__decorate([
    (0, common_1.Post)(':id/workflow'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.CONTENT_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'Transition content workflow state' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, content_dto_1.TransitionWorkflowDto, Object]),
    __metadata("design:returntype", Promise)
], CmsContentController.prototype, "transitionWorkflow", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.CONTENT_PUBLISH),
    (0, swagger_1.ApiOperation)({ summary: 'Publish content snapshot idempotently' }),
    (0, swagger_1.ApiHeader)({ name: 'Idempotency-Key', required: false }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('idempotency-key')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CmsContentController.prototype, "publish", null);
exports.CmsContentController = CmsContentController = __decorate([
    (0, swagger_1.ApiTags)('CMS Content Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('v1/cms/content'),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], CmsContentController);
//# sourceMappingURL=cms-content.controller.js.map