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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_database_service_1 = require("../../database/core-database.service");
const forms_database_service_1 = require("../../database/forms-database.service");
const mongo_service_1 = require("../../database/mongo.service");
let HealthService = class HealthService {
    constructor(configService, coreDb, formsDb, mongoDb) {
        this.configService = configService;
        this.coreDb = coreDb;
        this.formsDb = formsDb;
        this.mongoDb = mongoDb;
        this.startTime = Date.now();
    }
    getLiveness() {
        return {
            status: 'ok',
            serviceVersion: this.configService.get('app.serviceVersion'),
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
            serviceVersion: this.configService.get('app.serviceVersion'),
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
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        core_database_service_1.CoreDatabaseService,
        forms_database_service_1.FormsDatabaseService,
        mongo_service_1.MongoService])
], HealthService);
//# sourceMappingURL=health.service.js.map