import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ContentService } from '../content/content.service';
import {
  CreateHeroSpotlightDto,
  UpdateHeroSpotlightDto,
  HeroPriority,
  HeroLifecycleState,
} from './dto/hero-spotlight.dto';

@Injectable()
export class HeroService {
  constructor(private contentService: ContentService) {}

  async create(dto: CreateHeroSpotlightDto, actorId: string) {
    this.validatePriorityGating(dto.priority);

    return this.contentService.createDraft(
      {
        entityType: 'hero',
        title: dto.title,
        slug: 'active-hero-spotlight',
        data: dto,
      },
      actorId,
    );
  }

  async list() {
    return this.contentService.listDrafts('hero');
  }

  async get(id: string) {
    return this.contentService.getDraft(id);
  }

  async update(id: string, dto: UpdateHeroSpotlightDto, actorId: string) {
    this.validatePriorityGating(dto.priority);
    const existing = await this.get(id);

    return this.contentService.updateDraft(
      id,
      {
        version: existing.version,
        title: dto.title,
        data: dto,
      },
      existing.version,
      actorId,
    );
  }

  async publish(id: string, actorId: string) {
    return this.contentService.publish(id, undefined, actorId);
  }

  async getActiveHero() {
    const publishedHeros = await this.contentService.listPublicContent('hero');
    const now = new Date();

    // Find first active published hero within schedule window
    for (const item of publishedHeros) {
      const data = item.data;
      if (data && data.isActive !== false) {
        const startsAt = data.startsAt ? new Date(data.startsAt) : null;
        const expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;

        if (startsAt && startsAt > now) continue;
        if (expiresAt && expiresAt < now) continue;

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

    // Evergreen fallback
    return {
      isEvergreen: true,
      priority: 'Evergreen',
      lifecycleState: HeroLifecycleState.ANNOUNCEMENT,
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

  private validatePriorityGating(priority: HeroPriority) {
    const allowed = [HeroPriority.P0, HeroPriority.P1, HeroPriority.P2];
    if (!allowed.includes(priority)) {
      throw new BadRequestException(
        `Priority gating violation: Only P0, P1, and P2 priority campaigns may occupy the primary Hero Spotlight. Got '${priority}'.`,
      );
    }
  }
}
