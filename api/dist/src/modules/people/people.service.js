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
exports.PeopleService = void 0;
const common_1 = require("@nestjs/common");
const mongo_service_1 = require("../../database/mongo.service");
const content_service_1 = require("../content/content.service");
const audit_service_1 = require("../audit/audit.service");
let PeopleService = class PeopleService {
    constructor(mongoDb, contentService, auditService) {
        this.mongoDb = mongoDb;
        this.contentService = contentService;
        this.auditService = auditService;
    }
    async create(dto, actorId) {
        const draft = await this.contentService.createDraft({
            entityType: 'people',
            title: dto.name,
            slug: dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            data: dto,
        }, actorId);
        return draft;
    }
    async list(category) {
        const drafts = await this.contentService.listDrafts('people');
        if (!category)
            return drafts;
        return drafts.filter((d) => d.data?.category === category);
    }
    async get(id) {
        return this.contentService.getDraft(id);
    }
    async update(id, dto, actorId) {
        const existing = await this.get(id);
        const updatedData = { ...existing.data, ...dto };
        return this.contentService.updateDraft(id, {
            version: existing.version,
            title: dto.name || existing.title,
            data: updatedData,
        }, existing.version, actorId);
    }
    async publish(id, actorId) {
        return this.contentService.publish(id, undefined, actorId);
    }
    async listPublic(category) {
        const items = await this.contentService.listPublicContent('people');
        if (!category)
            return items;
        return items.filter((item) => item.data?.category === category);
    }
    async getPublic(slugOrId) {
        return this.contentService.getPublicContent('people', slugOrId);
    }
};
exports.PeopleService = PeopleService;
exports.PeopleService = PeopleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mongo_service_1.MongoService,
        content_service_1.ContentService,
        audit_service_1.AuditService])
], PeopleService);
//# sourceMappingURL=people.service.js.map