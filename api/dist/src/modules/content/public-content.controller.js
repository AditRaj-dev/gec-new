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
exports.PublicContentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const content_service_1 = require("./content.service");
let PublicContentController = class PublicContentController {
    constructor(contentService) {
        this.contentService = contentService;
    }
    async listPublicContent(entityType) {
        return this.contentService.listPublicContent(entityType);
    }
    async getPublicContent(entityType, slugOrId) {
        return this.contentService.getPublicContent(entityType, slugOrId);
    }
};
exports.PublicContentController = PublicContentController;
__decorate([
    (0, common_1.Get)(':entityType'),
    (0, swagger_1.ApiOperation)({ summary: 'List published active entities' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Published entities list' }),
    __param(0, (0, common_1.Param)('entityType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicContentController.prototype, "listPublicContent", null);
__decorate([
    (0, common_1.Get)(':entityType/:slugOrId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get published snapshot projection by slug or ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Published content snapshot' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Content not found or not published' }),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('slugOrId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PublicContentController.prototype, "getPublicContent", null);
exports.PublicContentController = PublicContentController = __decorate([
    (0, swagger_1.ApiTags)('Public Published Content'),
    (0, common_1.Controller)('v1/public/content'),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], PublicContentController);
//# sourceMappingURL=public-content.controller.js.map