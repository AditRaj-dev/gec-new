import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ContentService } from './content.service';
import { CoreDatabaseService } from '../../database/core-database.service';
import { MongoService } from '../../database/mongo.service';
import { OutboxService } from '../outbox/outbox.service';
import { AuditService } from '../audit/audit.service';

describe('ContentService (Publication & Concurrency)', () => {
  let service: ContentService;
  let mongoDbMock: any;
  let coreDbMock: any;
  let outboxServiceMock: any;
  let auditServiceMock: any;

  beforeEach(async () => {
    mongoDbMock = {
      insertOne: jest.fn().mockImplementation((col, doc) => Promise.resolve(doc)),
      findOne: jest.fn(),
      updateOne: jest.fn(),
      find: jest.fn().mockResolvedValue([]),
    };

    coreDbMock = {
      query: jest.fn().mockResolvedValue({ rows: [], rowCount: 1 }),
      getClient: jest.fn().mockResolvedValue({
        query: jest.fn().mockResolvedValue({ rows: [], rowCount: 1 }),
        release: jest.fn(),
      }),
    };

    outboxServiceMock = {
      createEvent: jest.fn().mockResolvedValue('outbox-event-123'),
    };

    auditServiceMock = {
      log: jest.fn().mockResolvedValue('audit-log-123'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        { provide: MongoService, useValue: mongoDbMock },
        { provide: CoreDatabaseService, useValue: coreDbMock },
        { provide: OutboxService, useValue: outboxServiceMock },
        { provide: AuditService, useValue: auditServiceMock },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create content draft with version 1', async () => {
    const draft = await service.createDraft(
      {
        entityType: 'initiatives',
        title: 'Test Initiative',
        slug: 'test-initiative',
        data: { description: 'Test' },
      },
      'actor-123',
    );

    expect(draft.version).toBe(1);
    expect(draft.title).toBe('Test Initiative');
    expect(mongoDbMock.insertOne).toHaveBeenCalled();
    expect(coreDbMock.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO content_workflows'),
      expect.anything(),
    );
  });

  it('should reject update on optimistic concurrency conflict (409)', async () => {
    mongoDbMock.findOne.mockResolvedValue({
      id: 'draft-123',
      version: 2, // Current version is 2
      title: 'Original Title',
      data: {},
    });

    // Provided version is 1 (stale edit)
    await expect(
      service.updateDraft(
        'draft-123',
        { version: 1, data: { updated: true } },
        1,
        'actor-123',
      ),
    ).rejects.toThrow(ConflictException);
  });

  it('should publish draft creating immutable snapshot, publication record, and outbox event', async () => {
    mongoDbMock.findOne.mockResolvedValue({
      id: 'draft-123',
      entityType: 'initiatives',
      title: 'Published Initiative',
      slug: 'published-initiative',
      version: 1,
      data: { details: 'Approved' },
    });

    const result = await service.publish('draft-123', 'idemp-pub-123', 'actor-123');

    expect(result.success).toBe(true);
    expect(result.publicationId).toBeDefined();
    expect(result.snapshotId).toBeDefined();

    // Verify immutable snapshot created in MongoDB
    expect(mongoDbMock.insertOne).toHaveBeenCalledWith(
      'cms_published_snapshots',
      expect.objectContaining({
        entityId: 'draft-123',
        entityType: 'initiatives',
        version: 1,
      }),
    );

    // Verify outbox event created for cache invalidation
    expect(outboxServiceMock.createEvent).toHaveBeenCalledWith(
      'cache_invalidation',
      expect.objectContaining({
        entityType: 'initiatives',
        entityId: 'draft-123',
      }),
    );
  });
});
