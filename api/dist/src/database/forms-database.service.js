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
var FormsDatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormsDatabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pg_1 = require("pg");
const uuid_1 = require("uuid");
let FormsDatabaseService = FormsDatabaseService_1 = class FormsDatabaseService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(FormsDatabaseService_1.name);
        this.pool = null;
        this.isFallback = false;
        this.inMemoryTables = new Map();
        this.initFallbackTables();
    }
    initFallbackTables() {
        const tableNames = [
            'google_forms',
            'google_form_revisions',
            'google_form_plans',
            'manual_requirements',
            'response_sync_runs',
            'response_cache',
            'sheet_mappings',
            'sheet_exports',
            'google_action_log',
        ];
        tableNames.forEach((t) => this.inMemoryTables.set(t, new Map()));
    }
    async onModuleInit() {
        const formsDbUrl = this.configService.get('formsDatabase.url');
        if (!formsDbUrl || formsDbUrl.includes('forms-pooler')) {
            this.logger.warn('Forms database URL not configured or is placeholder. Using in-memory Forms adapter.');
            this.isFallback = true;
            return;
        }
        try {
            this.pool = new pg_1.Pool({
                connectionString: formsDbUrl,
                ssl: formsDbUrl.includes('localhost') ? false : { rejectUnauthorized: false },
                max: 5,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 5000,
            });
            const client = await this.pool.connect();
            client.release();
            this.logger.log('Connected to Forms Neon PostgreSQL successfully.');
        }
        catch (err) {
            this.logger.warn(`Failed to connect to Forms Neon (${err.message}). Falling back to in-memory Forms adapter.`);
            this.isFallback = true;
        }
    }
    async onModuleDestroy() {
        if (this.pool) {
            await this.pool.end();
        }
    }
    async isHealthy() {
        if (this.isFallback)
            return true;
        try {
            if (!this.pool)
                return false;
            const res = await this.pool.query('SELECT 1');
            return !!res;
        }
        catch {
            return false;
        }
    }
    async query(sql, params = []) {
        if (!this.isFallback && this.pool) {
            try {
                const res = await this.pool.query(sql, params);
                return { rows: res.rows, rowCount: res.rowCount ?? 0 };
            }
            catch (err) {
                this.logger.error(`Forms PostgreSQL query error: ${err.message}`, err.stack);
                throw err;
            }
        }
        return this.executeInMemoryQuery(sql, params);
    }
    executeInMemoryQuery(sql, params) {
        const normalized = sql.trim().replace(/\s+/g, ' ');
        const lower = normalized.toLowerCase();
        if (lower === 'select 1' || lower === 'select 1 as health') {
            return { rows: [{ health: 1 }], rowCount: 1 };
        }
        const tableMatch = normalized.match(/(?:from|into|update|join)\s+([a-zA-Z0-9_]+)/i);
        const tableName = tableMatch ? tableMatch[1].toLowerCase() : '';
        let table = this.inMemoryTables.get(tableName);
        if (!table) {
            table = new Map();
            this.inMemoryTables.set(tableName, table);
        }
        if (lower.startsWith('insert into')) {
            const colMatch = sql.match(/insert into [a-zA-Z0-9_]+\s*\(([^)]+)\)/i);
            const columns = colMatch
                ? colMatch[1].split(',').map((c) => c.trim().toLowerCase())
                : [];
            const record = {
                id: (0, uuid_1.v4)(),
                created_at: new Date(),
                updated_at: new Date(),
            };
            columns.forEach((col, idx) => {
                record[col] = params[idx];
            });
            const key = record.id || record.google_form_id || (0, uuid_1.v4)();
            table.set(key, record);
            return { rows: [record], rowCount: 1 };
        }
        if (lower.startsWith('select')) {
            let records = Array.from(table.values());
            if (params.length > 0) {
                if (sql.includes('id = $1')) {
                    records = records.filter((r) => r.id === params[0]);
                }
                if (sql.includes('google_form_id = $1')) {
                    records = records.filter((r) => r.google_form_id === params[0]);
                }
                if (sql.includes('lifecycle_state = $1')) {
                    records = records.filter((r) => r.lifecycle_state === params[0]);
                }
            }
            if (sql.toLowerCase().includes('order by created_at desc')) {
                records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            }
            return { rows: records, rowCount: records.length };
        }
        if (lower.startsWith('update')) {
            const updatedRows = [];
            for (const [id, record] of Array.from(table.entries())) {
                if (params.includes(id) || params.includes(record.id) || params.includes(record.google_form_id)) {
                    record.updated_at = new Date();
                    table.set(id, record);
                    updatedRows.push(record);
                }
            }
            return { rows: updatedRows, rowCount: updatedRows.length };
        }
        if (lower.startsWith('delete')) {
            let count = 0;
            for (const [id, record] of Array.from(table.entries())) {
                if (params.includes(id) || params.includes(record.id)) {
                    table.delete(id);
                    count++;
                }
            }
            return { rows: [], rowCount: count };
        }
        return { rows: [], rowCount: 0 };
    }
};
exports.FormsDatabaseService = FormsDatabaseService;
exports.FormsDatabaseService = FormsDatabaseService = FormsDatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FormsDatabaseService);
//# sourceMappingURL=forms-database.service.js.map