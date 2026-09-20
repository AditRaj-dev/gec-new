import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentService } from '../content/content.service';
import { CreateStakeholderDto, UpdateStakeholderDto, StakeholderType } from './dto/stakeholder.dto';

@Injectable()
export class StakeholdersService {
  constructor(private contentService: ContentService) {}

  async create(dto: CreateStakeholderDto, actorId: string) {
    return this.contentService.createDraft(
      {
        entityType: 'stakeholders',
        title: dto.name,
        slug: dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        data: dto,
      },
      actorId,
    );
  }

  async list(type?: StakeholderType) {
    const drafts = await this.contentService.listDrafts('stakeholders');
    if (!type) return drafts;
    return drafts.filter((d) => d.data?.type === type);
  }

  async get(id: string) {
    return this.contentService.getDraft(id);
  }

  async update(id: string, dto: UpdateStakeholderDto, actorId: string) {
    const existing = await this.get(id);
    const updatedData = { ...existing.data, ...dto };
    return this.contentService.updateDraft(
      id,
      {
        version: existing.version,
        title: dto.name || existing.title,
        data: updatedData,
      },
      existing.version,
      actorId,
    );
  }

  async publish(id: string, actorId: string) {
    return this.contentService.publish(id, undefined, actorId);
  }

  async listPublic(type?: StakeholderType) {
    const items = await this.contentService.listPublicContent('stakeholders');
    if (!type) return items;
    return items.filter((item) => item.data?.type === type);
  }

  async getPublic(slugOrId: string) {
    return this.contentService.getPublicContent('stakeholders', slugOrId);
  }
}
