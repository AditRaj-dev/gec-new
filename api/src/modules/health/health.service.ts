import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoreDatabaseService } from '../../database/core-database.service';
import { FormsDatabaseService } from '../../database/forms-database.service';
import { MongoService } from '../../database/mongo.service';

@Injectable()
export class HealthService {
  private readonly startTime = Date.now();

  constructor(
    private configService: ConfigService,
    private coreDb: CoreDatabaseService,
    private formsDb: FormsDatabaseService,
    private mongoDb: MongoService,
  ) {}

  getLiveness() {
    return {
      status: 'ok',
      serviceVersion: this.configService.get<string>('app.serviceVersion'),
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness() {
    const coreHealthy = await this.coreDb.isHealthy();
    const formsHealthy = await this.formsDb.isHealthy();
    const mongoHealthy = await this.mongoDb.isHealthy();

    const isReady = coreHealthy && formsHealthy && mongoHealthy;

    return {
      status: isReady ? 'ok' : 'degraded',
      serviceVersion: this.configService.get<string>('app.serviceVersion'),
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      checks: {
        coreDatabase: coreHealthy ? 'up' : 'down',
        formsDatabase: formsHealthy ? 'up' : 'down',
        mongoDatabase: mongoHealthy ? 'up' : 'down',
      },
      fallbackModes: {
        coreDatabase: this.coreDb.isUsingFallback(),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
