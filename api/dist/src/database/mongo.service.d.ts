import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class MongoService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private readonly logger;
    private connection;
    private isFallback;
    private collections;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    isHealthy(): Promise<boolean>;
    private getCollection;
    insertOne(collectionName: string, doc: any): Promise<any>;
    findOne(collectionName: string, filter: Record<string, any>): Promise<any | null>;
    find(collectionName: string, filter?: Record<string, any>): Promise<any[]>;
    updateOne(collectionName: string, filter: Record<string, any>, update: any): Promise<any>;
    deleteOne(collectionName: string, filter: Record<string, any>): Promise<boolean>;
}
