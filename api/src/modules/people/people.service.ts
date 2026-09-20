import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MongoService } from '../../database/mongo.service';
import { ContentService } from '../content/content.service';
import { AuditService } from '../audit/audit.service';
import { CreatePersonDto, UpdatePersonDto, PersonCategory } from './dto/person.dto';

@Injectable()
export class PeopleService {
  constructor(
    private mongoDb: MongoService,
    private contentService: ContentService,
    private auditService: AuditService,
  ) {}

  async create(dto: CreatePersonDto, actorId: string) {
    // Also create matching draft via ContentService for unified publishing
    const draft = await this.contentService.createDraft(
      {
        entityType: 'people',
        title: dto.name,
        slug: dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        data: dto,
      },
      actorId,
    );

    return draft;
  }

  async list(category?: PersonCategory) {
    const drafts = await this.contentService.listDrafts('people');
    if (!category) return drafts;
    return drafts.filter((d) => d.data?.category === category);
  }

  async get(id: string) {
    return this.contentService.getDraft(id);
  }

  async update(id: string, dto: UpdatePersonDto, actorId: string) {
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

  async listPublic(category?: PersonCategory) {
    const items = await this.contentService.listPublicContent('people');
    if (!category) return items;
    return items.filter((item) => item.data?.category === category);
  }

  async getPublic(slugOrId: string) {
    return this.contentService.getPublicContent('people', slugOrId);
  }
}
