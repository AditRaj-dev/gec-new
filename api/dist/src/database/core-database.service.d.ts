import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PoolClient } from 'pg';
export interface QueryResult<T = any> {
    rows: T[];
    rowCount: number;
}
export declare class CoreDatabaseService implements OnModuleInit, OnModuleDestroy {
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
    isUsingFallback(): boolean;
    private seedDefaultAdmin;
    query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>>;
    getClient(): Promise<PoolClient | any>;
    private executeInMemoryQuery;
    private handleInMemoryInsert;
    private handleInMemorySelect;
    private handleInMemoryUpdate;
    private handleInMemoryDelete;
}
