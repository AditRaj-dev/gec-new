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
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const media_service_1 = require("./media.service");
const media_dto_1 = require("./dto/media.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const roles_enum_1 = require("../../common/constants/roles.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let MediaController = class MediaController {
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    async presign(dto, user) {
        return this.mediaService.presignUpload(dto, user.id);
    }
    async complete(dto, user) {
        return this.mediaService.completeUpload(dto, user.id);
    }
    async getDownloadUrl(key, user) {
        return this.mediaService.getDownloadUrl(key, user.id);
    }
    async listMedia(bucketClass, purpose) {
        return this.mediaService.listMedia(bucketClass, purpose);
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Post)('v1/uploads/presign'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.MEDIA_UPLOAD),
    (0, swagger_1.ApiOperation)({ summary: 'Generate short-lived presigned PUT URL for Cloudflare R2 direct upload' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [media_dto_1.PresignUploadDto, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "presign", null);
__decorate([
    (0, common_1.Post)('v1/uploads/complete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.MEDIA_UPLOAD),
    (0, swagger_1.ApiOperation)({ summary: 'Verify R2 object and record asset metadata' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [media_dto_1.CompleteUploadDto, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "complete", null);
__decorate([
    (0, common_1.Get)('v1/uploads/download-url'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.MEDIA_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Generate signed download URL for private submission item' }),
    __param(0, (0, common_1.Query)('key')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getDownloadUrl", null);
__decorate([
    (0, common_1.Get)('v1/cms/media'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.MEDIA_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'List and filter media assets in library' }),
    __param(0, (0, common_1.Query)('bucketClass')),
    __param(1, (0, common_1.Query)('purpose')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "listMedia", null);
exports.MediaController = MediaController = __decorate([
    (0, swagger_1.ApiTags)('Media & Uploads'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=media.controller.js.map