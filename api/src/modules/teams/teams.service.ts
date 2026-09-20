import { Injectable, NotFoundException } from '@nestjs/common';
import { ContentService } from '../content/content.service';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';

@Injectable()
export class TeamsService {
  constructor(private contentService: ContentService) {}

  async create(dto: CreateTeamDto, actorId: string) {
    return this.contentService.createDraft(
      {
        entityType: 'teams',
        title: dto.name,
        slug: dto.slug,
        data: dto,
      },
      actorId,
    );
  }

  async list() {
    return this.contentService.listDrafts('teams');
  }

  async get(id: string) {
    return this.contentService.getDraft(id);
  }

  async update(id: string, dto: UpdateTeamDto, actorId: string) {
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

  async listPublic() {
    return this.contentService.listPublicContent('teams');
  }

  async getPublic(slugOrId: string) {
    return this.contentService.getPublicContent('teams', slugOrId);
  }
}
