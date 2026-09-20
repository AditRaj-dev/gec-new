import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentService } from '../content/content.service';
import { CreateInitiativeDto, UpdateInitiativeDto } from './dto/initiative.dto';

@Injectable()
export class InitiativesService {
  constructor(private contentService: ContentService) {}

  async create(dto: CreateInitiativeDto, actorId: string) {
    return this.contentService.createDraft(
      {
        entityType: 'initiatives',
        title: dto.title,
        slug: dto.slug,
        data: dto,
      },
      actorId,
    );
  }

  async list() {
    return this.contentService.listDrafts('initiatives');
  }

  async get(id: string) {
    return this.contentService.getDraft(id);
  }

  async update(id: string, dto: UpdateInitiativeDto, actorId: string) {
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

  async listPublic() {
    return this.contentService.listPublicContent('initiatives');
  }

  async getPublic(slugOrId: string) {
    return this.contentService.getPublicContent('initiatives', slugOrId);
  }
}
