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
exports.HeroService = void 0;
const common_1 = require("@nestjs/common");
const content_service_1 = require("../content/content.service");
const hero_spotlight_dto_1 = require("./dto/hero-spotlight.dto");
let HeroService = class HeroService {
    constructor(contentService) {
        this.contentService = contentService;
    }
    async create(dto, actorId) {
        this.validatePriorityGating(dto.priority);
        return this.contentService.createDraft({
            entityType: 'hero',
            title: dto.title,
            slug: 'active-hero-spotlight',
            data: dto,
        }, actorId);
    }
    async list() {
        return this.contentService.listDrafts('hero');
    }
    async get(id) {
        return this.contentService.getDraft(id);
    }
    async update(id, dto, actorId) {
        this.validatePriorityGating(dto.priority);
        const existing = await this.get(id);
        return this.contentService.updateDraft(id, {
            version: existing.version,
            title: dto.title,
            data: dto,
        }, existing.version, actorId);
    }
    async publish(id, actorId) {
        return this.contentService.publish(id, undefined, actorId);
    }
    async getActiveHero() {
        const publishedHeros = await this.contentService.listPublicContent('hero');
        const now = new Date();
        for (const item of publishedHeros) {
            const data = item.data;
            if (data && data.isActive !== false) {
                const startsAt = data.startsAt ? new Date(data.startsAt) : null;
                const expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
                if (startsAt && startsAt > now)
                    continue;
                if (expiresAt && expiresAt < now)
                    continue;
                return {
                    isEvergreen: false,
                    id: item.id,
                    title: item.title,
                    priority: data.priority,
                    lifecycleState: data.lifecycleState,
                    headline: data.headline,
                    shortContext: data.shortContext,
                    statusTag: data.statusTag,
                    visualAssets: data.visualAssets,
                    primaryCta: data.primaryCta,
                    secondaryCta: data.secondaryCta,
                    publishedAt: item.publishedAt,
                };
            }
        }
        return {
            isEvergreen: true,
            priority: 'Evergreen',
            lifecycleState: hero_spotlight_dto_1.HeroLifecycleState.ANNOUNCEMENT,
            headline: 'GALGOTIAS ENTREPRENEURSHIP CELL',
            shortContext: 'Fostering the next generation of visionary founders, innovators, and leaders at Galgotias University.',
            statusTag: 'EMPOWERING CAMPUS FOUNDERS',
            primaryCta: { label: 'Explore Initiatives', url: '/initiatives' },
            secondaryCta: { label: 'Join Community', url: '/join' },
            visualAssets: {
                staticDesktopUrl: 'https://media.gec.org/brand/hero-evergreen-desktop.jpg',
                staticMobileUrl: 'https://media.gec.org/brand/hero-evergreen-mobile.jpg',
            },
        };
    }
    validatePriorityGating(priority) {
        const allowed = [hero_spotlight_dto_1.HeroPriority.P0, hero_spotlight_dto_1.HeroPriority.P1, hero_spotlight_dto_1.HeroPriority.P2];
        if (!allowed.includes(priority)) {
            throw new common_1.BadRequestException(`Priority gating violation: Only P0, P1, and P2 priority campaigns may occupy the primary Hero Spotlight. Got '${priority}'.`);
        }
    }
};
exports.HeroService = HeroService;
exports.HeroService = HeroService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], HeroService);
//# sourceMappingURL=hero.service.js.map