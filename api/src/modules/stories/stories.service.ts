import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentService } from '../content/content.service';
import { CreateStoryDto, UpdateStoryDto, StoryCategory } from './dto/story.dto';

@Injectable()
export class StoriesService {
  constructor(private contentService: ContentService) {}

  async create(dto: CreateStoryDto, actorId: string) {
    return this.contentService.createDraft(
      {
        entityType: 'stories',
        title: dto.title,
        slug: dto.slug,
        data: dto,
      },
      actorId,
    );
  }

  async list(category?: StoryCategory) {
    const drafts = await this.contentService.listDrafts('stories');
    if (!category) return drafts;
    return drafts.filter((d) => d.data?.category === category);
  }

  async get(id: string) {
    return this.contentService.getDraft(id);
  }

  async update(id: string, dto: UpdateStoryDto, actorId: string) {
    const existing = await this.get(id);
    const updatedData = { ...existing.data, ...dto };
    return this.contentService.updateDraft(
      id,
      {
        version: existing.version,
        title: dto.title || existing.title,
        data: updatedData,
      },
      existing.version,
      actorId,
    );
  }

  async publish(id: string, actorId: string) {
    return this.contentService.publish(id, undefined, actorId);
  }

  async listPublic(category?: StoryCategory) {
    const items = await this.contentService.listPublicContent('stories');
    if (!category) return items;
    return items.filter((item) => item.data?.category === category);
  }

  async getPublic(slugOrId: string) {
    return this.contentService.getPublicContent('stories', slugOrId);
  }
}
