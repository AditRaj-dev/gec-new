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
exports.InitiativesService = void 0;
const common_1 = require("@nestjs/common");
const content_service_1 = require("../content/content.service");
let InitiativesService = class InitiativesService {
    constructor(contentService) {
        this.contentService = contentService;
    }
    async create(dto, actorId) {
        return this.contentService.createDraft({
            entityType: 'initiatives',
            title: dto.title,
            slug: dto.slug,
            data: dto,
        }, actorId);
    }
    async list() {
        return this.contentService.listDrafts('initiatives');
    }
    async get(id) {
        return this.contentService.getDraft(id);
    }
    async update(id, dto, actorId) {
        const existing = await this.get(id);
        const updatedData = { ...existing.data, ...dto };
        return this.contentService.updateDraft(id, {
            version: existing.version,
            title: dto.title || existing.title,
            data: updatedData,
        }, existing.version, actorId);
    }
    async publish(id, actorId) {
        return this.contentService.publish(id, undefined, actorId);
    }
    async listPublic() {
        return this.contentService.listPublicContent('initiatives');
    }
    async getPublic(slugOrId) {
        return this.contentService.getPublicContent('initiatives', slugOrId);
    }
};
exports.InitiativesService = InitiativesService;
exports.InitiativesService = InitiativesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], InitiativesService);
//# sourceMappingURL=initiatives.service.js.map