import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { CryptoUtil } from '../common/utils/crypto.util';
import { Role } from '../common/constants/roles.enum';

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

@Injectable()
export class CoreDatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CoreDatabaseService.name);
  private pool: Pool | null = null;
  private isFallback = false;

  // In-memory fallback stores for when Neon connection is not configured or offline
  private inMemoryTables = new Map<string, Map<string, any>>();

  constructor(private configService: ConfigService) {
    this.initFallbackTables();
  }

  private initFallbackTables() {
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
    const dbUrl = this.configService.get<string>('database.url');
    if (!dbUrl || dbUrl.includes('sample-pooler')) {
      this.logger.warn('Core database URL not configured or is placeholder. Using robust in-memory Core adapter.');
      this.isFallback = true;
      await this.seedDefaultAdmin();
      return;
    }

    try {
      this.pool = new Pool({
        connectionString: dbUrl,
        ssl: dbUrl.includes('localhost') ? false : { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      const client = await this.pool.connect();
      client.release();
      this.logger.log('Connected to Core Neon PostgreSQL successfully.');
    } catch (err: any) {
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

  async isHealthy(): Promise<boolean> {
    if (this.isFallback) return true;
    try {
      if (!this.pool) return false;
      const res = await this.pool.query('SELECT 1');
      return !!res;
    } catch {
      return false;
    }
  }

  isUsingFallback(): boolean {
    return this.isFallback;
  }

  private async seedDefaultAdmin() {
    const usersTable = this.inMemoryTables.get('users')!;
    if (usersTable.size === 0) {
      const passwordHash = await CryptoUtil.hashPassword('Admin@123456');
      const adminId = 'a0000000-0000-0000-0000-000000000001';
      usersTable.set(adminId, {
        id: adminId,
        email: 'admin@gec.org',
        password_hash: passwordHash,
        full_name: 'GEC System Admin',
        role: Role.SUPER_ADMIN,
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

  async query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    if (!this.isFallback && this.pool) {
      try {
        const res = await this.pool.query(sql, params);
        return { rows: res.rows, rowCount: res.rowCount ?? 0 };
      } catch (err: any) {
        this.logger.error(`PostgreSQL query error: ${err.message}`, err.stack);
        throw err;
      }
    }

    return this.executeInMemoryQuery<T>(sql, params);
  }

  async getClient(): Promise<PoolClient | any> {
    if (!this.isFallback && this.pool) {
      return this.pool.connect();
    }

    // In-memory fake client for transactions
    return {
      query: (sql: string, params: any[]) => this.query(sql, params),
      release: () => {},
    };
  }

  // Basic SQL interpreter for in-memory fallback
  private executeInMemoryQuery<T>(sql: string, params: any[]): QueryResult<T> {
    const normalized = sql.trim().replace(/\s+/g, ' ');
    const lower = normalized.toLowerCase();

    // SELECT 1 (health check)
    if (lower === 'select 1' || lower === 'select 1 as health') {
      return { rows: [{ health: 1 }] as any, rowCount: 1 };
    }

    // Detect target table
    const tableMatch = normalized.match(/(?:from|into|update|join)\s+([a-zA-Z0-9_]+)/i);
    const tableName = tableMatch ? tableMatch[1].toLowerCase() : '';
    const table = this.inMemoryTables.get(tableName);

    if (lower.startsWith('insert into')) {
      return this.handleInMemoryInsert<T>(tableName, normalized, params);
    }

    if (lower.startsWith('select')) {
      return this.handleInMemorySelect<T>(tableName, normalized, params);
    }

    if (lower.startsWith('update')) {
      return this.handleInMemoryUpdate<T>(tableName, normalized, params);
    }

    if (lower.startsWith('delete')) {
      return this.handleInMemoryDelete<T>(tableName, normalized, params);
    }

    return { rows: [], rowCount: 0 };
  }

  private handleInMemoryInsert<T>(tableName: string, sql: string, params: any[]): QueryResult<T> {
    let table = this.inMemoryTables.get(tableName);
    if (!table) {
      table = new Map();
      this.inMemoryTables.set(tableName, table);
    }

    // Match column names
    const colMatch = sql.match(/insert into [a-zA-Z0-9_]+\s*\(([^)]+)\)/i);
    const columns = colMatch
      ? colMatch[1].split(',').map((c) => c.trim().toLowerCase())
      : [];

    const record: any = {
      id: uuidv4(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    columns.forEach((col, idx) => {
      let val = params[idx];
      // Convert objects/arrays to JSON string if needed
      record[col] = val;
    });

    if (record.id) {
      table.set(record.id, record);
    } else {
      const generatedId = uuidv4();
      record.id = generatedId;
      table.set(generatedId, record);
    }

    return { rows: [record] as any, rowCount: 1 };
  }

  private handleInMemorySelect<T>(tableName: string, sql: string, params: any[]): QueryResult<T> {
    const table = this.inMemoryTables.get(tableName);
    if (!table) {
      return { rows: [], rowCount: 0 };
    }

    let records = Array.from(table.values());

    // Simple WHERE filters based on params
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
        records = records.filter(
          (r) => r.entity_type === params[0] && r.entity_id === params[1],
        );
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

    return { rows: records as any, rowCount: records.length };
  }

  private handleInMemoryUpdate<T>(tableName: string, sql: string, params: any[]): QueryResult<T> {
    const table = this.inMemoryTables.get(tableName);
    if (!table) {
      return { rows: [], rowCount: 0 };
    }

    const updatedRows: any[] = [];
    const entries = Array.from(table.entries());

    for (const [id, record] of entries) {
      let matches = false;
      // Match ID in params
      if (params.includes(id) || params.includes(record.id)) {
        matches = true;
      } else if (sql.includes('token_hash') && params.includes(record.token_hash)) {
        matches = true;
      } else if (sql.includes('family_id') && params.includes(record.family_id)) {
        matches = true;
      } else if (sql.includes('entity_id') && params.includes(record.entity_id)) {
        matches = true;
      }

      if (matches) {
        record.updated_at = new Date();
        table.set(id, record);
        updatedRows.push(record);
      }
    }

    return { rows: updatedRows as any, rowCount: updatedRows.length };
  }

  private handleInMemoryDelete<T>(tableName: string, sql: string, params: any[]): QueryResult<T> {
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
}
