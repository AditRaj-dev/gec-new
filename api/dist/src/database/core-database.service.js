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
var CoreDatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreDatabaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const pg_1 = require("pg");
const uuid_1 = require("uuid");
const crypto_util_1 = require("../common/utils/crypto.util");
const roles_enum_1 = require("../common/constants/roles.enum");
let CoreDatabaseService = CoreDatabaseService_1 = class CoreDatabaseService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(CoreDatabaseService_1.name);
        this.pool = null;
        this.isFallback = false;
        this.inMemoryTables = new Map();
        this.initFallbackTables();
    }
    initFallbackTables() {
        const tableNames = [
            'users',
            'refresh_sessions',
            'password_resets',
            'publications',
            'content_workflows',
            'submissions',
            'audit_logs',
            'outbox_events',
            'copilot_conversations',
            'copilot_messages',
            'copilot_proposals',
            'media_assets',
        ];
        tableNames.forEach((t) => this.inMemoryTables.set(t, new Map()));
    }
    async onModuleInit() {
        const dbUrl = this.configService.get('database.url');
        if (!dbUrl || dbUrl.includes('sample-pooler')) {
            this.logger.warn('Core database URL not configured or is placeholder. Using robust in-memory Core adapter.');
            this.isFallback = true;
            await this.seedDefaultAdmin();
            return;
        }
        try {
            this.pool = new pg_1.Pool({
                connectionString: dbUrl,
                ssl: dbUrl.includes('localhost') ? false : { rejectUnauthorized: false },
                max: 10,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 5000,
            });
            const client = await this.pool.connect();
            client.release();
            this.logger.log('Connected to Core Neon PostgreSQL successfully.');
        }
        catch (err) {
            this.logger.warn(`Failed to connect to Neon PostgreSQL (${err.message}). Falling back to robust in-memory Core adapter.`);
            this.isFallback = true;
            await this.seedDefaultAdmin();
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
    isUsingFallback() {
        return this.isFallback;
    }
    async seedDefaultAdmin() {
        const usersTable = this.inMemoryTables.get('users');
        if (usersTable.size === 0) {
            const passwordHash = await crypto_util_1.CryptoUtil.hashPassword('Admin@123456');
            const adminId = 'a0000000-0000-0000-0000-000000000001';
            usersTable.set(adminId, {
                id: adminId,
                email: 'admin@gec.org',
                password_hash: passwordHash,
                full_name: 'GEC System Admin',
                role: roles_enum_1.Role.SUPER_ADMIN,
                team_scope: null,
                is_active: true,
                failed_login_attempts: 0,
                locked_until: null,
                created_at: new Date(),
                updated_at: new Date(),
            });
            this.logger.log('Seeded default Super Admin: admin@gec.org / Admin@123456');
        }
    }
    async query(sql, params = []) {
        if (!this.isFallback && this.pool) {
            try {
                const res = await this.pool.query(sql, params);
                return { rows: res.rows, rowCount: res.rowCount ?? 0 };
            }
            catch (err) {
                this.logger.error(`PostgreSQL query error: ${err.message}`, err.stack);
                throw err;
            }
        }
        return this.executeInMemoryQuery(sql, params);
    }
    async getClient() {
        if (!this.isFallback && this.pool) {
            return this.pool.connect();
        }
        return {
            query: (sql, params) => this.query(sql, params),
            release: () => { },
        };
    }
    executeInMemoryQuery(sql, params) {
        const normalized = sql.trim().replace(/\s+/g, ' ');
        const lower = normalized.toLowerCase();
        if (lower === 'select 1' || lower === 'select 1 as health') {
            return { rows: [{ health: 1 }], rowCount: 1 };
        }
        const tableMatch = normalized.match(/(?:from|into|update|join)\s+([a-zA-Z0-9_]+)/i);
        const tableName = tableMatch ? tableMatch[1].toLowerCase() : '';
        const table = this.inMemoryTables.get(tableName);
        if (lower.startsWith('insert into')) {
            return this.handleInMemoryInsert(tableName, normalized, params);
        }
        if (lower.startsWith('select')) {
            return this.handleInMemorySelect(tableName, normalized, params);
        }
        if (lower.startsWith('update')) {
            return this.handleInMemoryUpdate(tableName, normalized, params);
        }
        if (lower.startsWith('delete')) {
            return this.handleInMemoryDelete(tableName, normalized, params);
        }
        return { rows: [], rowCount: 0 };
    }
    handleInMemoryInsert(tableName, sql, params) {
        let table = this.inMemoryTables.get(tableName);
        if (!table) {
            table = new Map();
            this.inMemoryTables.set(tableName, table);
        }
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
            let val = params[idx];
            record[col] = val;
        });
        if (record.id) {
            table.set(record.id, record);
        }
        else {
            const generatedId = (0, uuid_1.v4)();
            record.id = generatedId;
            table.set(generatedId, record);
        }
        return { rows: [record], rowCount: 1 };
    }
    handleInMemorySelect(tableName, sql, params) {
        const table = this.inMemoryTables.get(tableName);
        if (!table) {
            return { rows: [], rowCount: 0 };
        }
        let records = Array.from(table.values());
        if (params.length > 0) {
            if (sql.includes('email = $1')) {
                records = records.filter((r) => r.email === params[0]);
            }
            if (sql.includes('id = $1')) {
                records = records.filter((r) => r.id === params[0]);
            }
            if (sql.includes('token_hash = $1')) {
                records = records.filter((r) => r.token_hash === params[0]);
            }
            if (sql.includes('entity_type = $1') && sql.includes('entity_id = $2')) {
                records = records.filter((r) => r.entity_type === params[0] && r.entity_id === params[1]);
            }
            if (sql.includes('status = $1')) {
                records = records.filter((r) => r.status === params[0]);
            }
            if (sql.includes('actor_id = $1')) {
                records = records.filter((r) => r.actor_id === params[0]);
            }
            if (sql.includes('conversation_id = $1')) {
                records = records.filter((r) => r.conversation_id === params[0]);
            }
            if (sql.includes('family_id = $1')) {
                records = records.filter((r) => r.family_id === params[0]);
            }
            if (sql.includes('idempotency_key = $1')) {
                records = records.filter((r) => r.idempotency_key === params[0]);
            }
        }
        if (sql.toLowerCase().includes('order by created_at desc')) {
            records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        return { rows: records, rowCount: records.length };
    }
    handleInMemoryUpdate(tableName, sql, params) {
        const table = this.inMemoryTables.get(tableName);
        if (!table) {
            return { rows: [], rowCount: 0 };
        }
        const updatedRows = [];
        const entries = Array.from(table.entries());
        for (const [id, record] of entries) {
            let matches = false;
            if (params.includes(id) || params.includes(record.id)) {
                matches = true;
            }
            else if (sql.includes('token_hash') && params.includes(record.token_hash)) {
                matches = true;
            }
            else if (sql.includes('family_id') && params.includes(record.family_id)) {
                matches = true;
            }
            else if (sql.includes('entity_id') && params.includes(record.entity_id)) {
                matches = true;
            }
            if (matches) {
                record.updated_at = new Date();
                table.set(id, record);
                updatedRows.push(record);
            }
        }
        return { rows: updatedRows, rowCount: updatedRows.length };
    }
    handleInMemoryDelete(tableName, sql, params) {
        const table = this.inMemoryTables.get(tableName);
        if (!table) {
            return { rows: [], rowCount: 0 };
        }
        let deletedCount = 0;
        for (const [id, record] of Array.from(table.entries())) {
            if (params.includes(id) || params.includes(record.id) || params.includes(record.conversation_id)) {
                table.delete(id);
                deletedCount++;
            }
        }
        return { rows: [], rowCount: deletedCount };
    }
};
exports.CoreDatabaseService = CoreDatabaseService;
exports.CoreDatabaseService = CoreDatabaseService = CoreDatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CoreDatabaseService);
//# sourceMappingURL=core-database.service.js.map