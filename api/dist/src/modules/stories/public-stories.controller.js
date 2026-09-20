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
exports.PublicStoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stories_service_1 = require("./stories.service");
const story_dto_1 = require("./dto/story.dto");
let PublicStoriesController = class PublicStoriesController {
    constructor(storiesService) {
        this.storiesService = storiesService;
    }
    async listPublic(category) {
        return this.storiesService.listPublic(category);
    }
    async getPublic(slugOrId) {
        return this.storiesService.getPublic(slugOrId);
    }
};
exports.PublicStoriesController = PublicStoriesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List published stories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Published stories list' }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicStoriesController.prototype, "listPublic", null);
__decorate([
    (0, common_1.Get)(':slugOrId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get published story details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Published story details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Story not found or not published' }),
    __param(0, (0, common_1.Param)('slugOrId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicStoriesController.prototype, "getPublic", null);
exports.PublicStoriesController = PublicStoriesController = __decorate([
    (0, swagger_1.ApiTags)('Public Stories'),
    (0, common_1.Controller)('v1/public/stories'),
    __metadata("design:paramtypes", [stories_service_1.StoriesService])
], PublicStoriesController);
//# sourceMappingURL=public-stories.controller.js.map