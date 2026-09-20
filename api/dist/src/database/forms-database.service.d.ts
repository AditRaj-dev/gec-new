import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export interface QueryResult<T = any> {
    rows: T[];
    rowCount: number;
}
export declare class FormsDatabaseService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private readonly logger;
    private pool;
    private isFallback;
    private inMemoryTables;
    constructor(configService: ConfigService);
    private initFallbackTables;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    isHealthy(): Promise<boolean>;
    query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>>;
    private executeInMemoryQuery;
}
