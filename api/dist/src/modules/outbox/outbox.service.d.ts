import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoreDatabaseService } from '../../database/core-database.service';
export interface OutboxEvent {
    id: string;
    eventType: string;
    payload: any;
    status: 'pending' | 'processing' | 'delivered' | 'failed';
    attempts: number;
    maxAttempts: number;
    nextAttemptAt: string;
    lastError?: string;
    deliveredAt?: string;
    createdAt: string;
}
export declare class OutboxService implements OnModuleInit, OnModuleDestroy {
    private coreDb;
    private configService;
    private readonly logger;
    private timer;
    private isProcessing;
    constructor(coreDb: CoreDatabaseService, configService: ConfigService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    createEvent(eventType: string, payload: any): Promise<string>;
    processOutbox(): Promise<void>;
    private handleEvent;
    private deliverCacheInvalidation;
}
