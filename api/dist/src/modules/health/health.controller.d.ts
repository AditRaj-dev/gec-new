import { Response } from 'express';
import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    getLive(): {
        status: string;
        serviceVersion: string;
        uptimeSeconds: number;
        timestamp: string;
    };
    getReady(res: Response): Promise<{
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
