"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MongoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
let MongoService = MongoService_1 = class MongoService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MongoService_1.name);
        this.connection = null;
        this.isFallback = false;
        this.collections = new Map();
    }
    async onModuleInit() {
        const mongoUri = this.configService.get('mongo.uri');
        if (!mongoUri || mongoUri.includes('cluster.mongodb.net')) {
            this.logger.warn('MongoDB URI not configured or is placeholder. Using robust in-memory Mongo document store.');
            this.isFallback = true;
            return;
        }
        try {
            const dbName = this.configService.get('mongo.database');
            const conn = await mongoose_1.default.createConnection(mongoUri, {
                dbName,
                serverSelectionTimeoutMS: 5000,
            }).asPromise();
            this.connection = conn;
            this.logger.log('Connected to MongoDB Atlas successfully.');
        }
        catch (err) {
            this.logger.warn(`Failed to connect to MongoDB Atlas (${err.message}). Falling back to robust in-memory Mongo document store.`);
            this.isFallback = true;
        }
    }
    async onModuleDestroy() {
        if (this.connection) {
            await this.connection.close();
        }
    }
    async isHealthy() {
        if (this.isFallback)
            return true;
        try {
            return this.connection?.readyState === 1;
        }
        catch {
            return false;
        }
    }
    getCollection(name) {
        let col = this.collections.get(name);
        if (!col) {
            col = new Map();
            this.collections.set(name, col);
        }
        return col;
    }
    async insertOne(collectionName, doc) {
        const record = {
            ...doc,
            id: doc.id || (0, uuid_1.v4)(),
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
    async findOne(collectionName, filter) {
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
                if (match)
                    return item;
            }
            return null;
        }
        const nativeCol = this.connection.collection(collectionName);
        return nativeCol.findOne(filter);
    }
    async find(collectionName, filter = {}) {
        if (this.isFallback || !this.connection) {
            const col = this.getCollection(collectionName);
            const items = Array.from(col.values());
            if (Object.keys(filter).length === 0)
                return items;
            return items.filter((item) => {
                for (const [k, v] of Object.entries(filter)) {
                    if (item[k] !== v)
                        return false;
                }
                return true;
            });
        }
        const nativeCol = this.connection.collection(collectionName);
        return nativeCol.find(filter).toArray();
    }
    async updateOne(collectionName, filter, update) {
        if (this.isFallback || !this.connection) {
            const item = await this.findOne(collectionName, filter);
            if (!item)
                return null;
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
    async deleteOne(collectionName, filter) {
        if (this.isFallback || !this.connection) {
            const item = await this.findOne(collectionName, filter);
            if (!item)
                return false;
            const col = this.getCollection(collectionName);
            col.delete(item.id);
            return true;
        }
        const nativeCol = this.connection.collection(collectionName);
        const res = await nativeCol.deleteOne(filter);
        return (res.deletedCount || 0) > 0;
    }
};
exports.MongoService = MongoService;
exports.MongoService = MongoService = MongoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MongoService);
//# sourceMappingURL=mongo.service.js.map