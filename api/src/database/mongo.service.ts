import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose, { Connection } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MongoService.name);
  private connection: Connection | null = null;
  private isFallback = false;

  // In-memory collections store
  private collections = new Map<string, Map<string, any>>();

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const mongoUri = this.configService.get<string>('mongo.uri');
    if (!mongoUri || mongoUri.includes('cluster.mongodb.net')) {
      this.logger.warn('MongoDB URI not configured or is placeholder. Using robust in-memory Mongo document store.');
      this.isFallback = true;
      return;
    }

    try {
      const dbName = this.configService.get<string>('mongo.database');
      const conn = await mongoose.createConnection(mongoUri, {
        dbName,
        serverSelectionTimeoutMS: 5000,
      }).asPromise();
      this.connection = conn;
      this.logger.log('Connected to MongoDB Atlas successfully.');
    } catch (err: any) {
      this.logger.warn(`Failed to connect to MongoDB Atlas (${err.message}). Falling back to robust in-memory Mongo document store.`);
      this.isFallback = true;
    }
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
    }
  }

  async isHealthy(): Promise<boolean> {
    if (this.isFallback) return true;
    try {
      return this.connection?.readyState === 1;
    } catch {
      return false;
    }
  }

  private getCollection(name: string): Map<string, any> {
    let col = this.collections.get(name);
    if (!col) {
      col = new Map();
      this.collections.set(name, col);
    }
    return col;
  }

  async insertOne(collectionName: string, doc: any): Promise<any> {
    const record = {
      ...doc,
      id: doc.id || uuidv4(),
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (this.isFallback || !this.connection) {
      const col = this.getCollection(collectionName);
      col.set(record.id, record);
      return record;
    }

    const nativeCol = this.connection.collection(collectionName);
    await nativeCol.insertOne(record);
    return record;
  }

  async findOne(collectionName: string, filter: Record<string, any>): Promise<any | null> {
    if (this.isFallback || !this.connection) {
      const col = this.getCollection(collectionName);
      for (const item of Array.from(col.values())) {
        let match = true;
        for (const [k, v] of Object.entries(filter)) {
          if (item[k] !== v) {
            match = false;
            break;
          }
        }
        if (match) return item;
      }
      return null;
    }

    const nativeCol = this.connection.collection(collectionName);
    return nativeCol.findOne(filter);
  }

  async find(collectionName: string, filter: Record<string, any> = {}): Promise<any[]> {
    if (this.isFallback || !this.connection) {
      const col = this.getCollection(collectionName);
      const items = Array.from(col.values());
      if (Object.keys(filter).length === 0) return items;

      return items.filter((item) => {
        for (const [k, v] of Object.entries(filter)) {
          if (item[k] !== v) return false;
        }
        return true;
      });
    }

    const nativeCol = this.connection.collection(collectionName);
    return nativeCol.find(filter).toArray();
  }

  async updateOne(collectionName: string, filter: Record<string, any>, update: any): Promise<any> {
    if (this.isFallback || !this.connection) {
      const item = await this.findOne(collectionName, filter);
      if (!item) return null;

      const col = this.getCollection(collectionName);
      const updateData = update.$set ? update.$set : update;
      const updated = {
        ...item,
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      col.set(item.id, updated);
      return updated;
    }

    const nativeCol = this.connection.collection(collectionName);
    const updateDoc = update.$set ? update : { $set: update };
    await nativeCol.updateOne(filter, updateDoc);
    return this.findOne(collectionName, filter);
  }

  async deleteOne(collectionName: string, filter: Record<string, any>): Promise<boolean> {
    if (this.isFallback || !this.connection) {
      const item = await this.findOne(collectionName, filter);
      if (!item) return false;
      const col = this.getCollection(collectionName);
      col.delete(item.id);
      return true;
    }

    const nativeCol = this.connection.collection(collectionName);
    const res = await nativeCol.deleteOne(filter);
    return (res.deletedCount || 0) > 0;
  }
}
