import { ConfigService } from '@nestjs/config';
import { CoreDatabaseService } from '../../database/core-database.service';
import { FormsDatabaseService } from '../../database/forms-database.service';
import { MongoService } from '../../database/mongo.service';
export declare class HealthService {
    private configService;
    private coreDb;
    private formsDb;
    private mongoDb;
    private readonly startTime;
    constructor(configService: ConfigService, coreDb: CoreDatabaseService, formsDb: FormsDatabaseService, mongoDb: MongoService);
    getLiveness(): {
        status: string;
        serviceVersion: string;
        uptimeSeconds: number;
        timestamp: string;
    };
    getReadiness(): Promise<{
        status: string;
        serviceVersion: string;
        uptimeSeconds: number;
        checks: {
            coreDatabase: string;
            formsDatabase: string;
            mongoDatabase: string;
        };
        fallbackModes: {
            coreDatabase: boolean;
        };
        timestamp: string;
    }>;
}
