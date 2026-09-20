import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HealthService } from './health.service';
import { CoreDatabaseService } from '../../database/core-database.service';
import { FormsDatabaseService } from '../../database/forms-database.service';
import { MongoService } from '../../database/mongo.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'app.serviceVersion') return '1.0.0-test';
              return null;
            }),
          },
        },
        {
          provide: CoreDatabaseService,
          useValue: {
            isHealthy: jest.fn().mockResolvedValue(true),
            isUsingFallback: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: FormsDatabaseService,
          useValue: {
            isHealthy: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: MongoService,
          useValue: {
            isHealthy: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return liveness with service version and uptime', () => {
    const live = service.getLiveness();
    expect(live.status).toBe('ok');
    expect(live.serviceVersion).toBe('1.0.0-test');
    expect(typeof live.uptimeSeconds).toBe('number');
  });

  it('should return readiness confirming dependency states', async () => {
    const ready = await service.getReadiness();
    expect(ready.status).toBe('ok');
    expect(ready.checks.coreDatabase).toBe('up');
    expect(ready.checks.formsDatabase).toBe('up');
    expect(ready.checks.mongoDatabase).toBe('up');
  });
});
