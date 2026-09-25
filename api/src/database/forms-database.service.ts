import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

@Injectable()
export class FormsDatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(FormsDatabaseService.name);
  private pool: Pool | null = null;
  private isFallback = false;

  private inMemoryTables = new Map<string, Map<string, any>>();

  constructor(private configService: ConfigService) {
    this.initFallbackTables();
  }

  private initFallbackTables() {
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
    const formsDbUrl = this.configService.get<string>('formsDatabase.url');
    if (!formsDbUrl || formsDbUrl.includes('forms-pooler')) {
      this.logger.warn('Forms database URL not configured or is placeholder. Using in-memory Forms adapter.');
      this.isFallback = true;
      return;
    }

    try {
      this.pool = new Pool({
        connectionString: formsDbUrl,
        ssl: formsDbUrl.includes('localhost') ? false : { rejectUnauthorized: false },
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      const client = await this.pool.connect();
      client.release();
      this.logger.log('Connected to Forms Neon PostgreSQL successfully.');
    } catch (err: any) {
      this.logger.warn(`Failed to connect to Forms Neon (${err.message}). Falling back to in-memory Forms adapter.`);
      this.isFallback = true;
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

  async query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    if (!this.isFallback && this.pool) {
      try {
        const res = await this.pool.query(sql, params);
        return { rows: res.rows, rowCount: res.rowCount ?? 0 };
      } catch (err: any) {
        this.logger.error(`Forms PostgreSQL query error: ${err.message}`, err.stack);
        throw err;
      }
    }

    return this.executeInMemoryQuery<T>(sql, params);
  }

  private executeInMemoryQuery<T>(sql: string, params: any[]): QueryResult<T> {
    const normalized = sql.trim().replace(/\s+/g, ' ');
    const lower = normalized.toLowerCase();

    if (lower === 'select 1' || lower === 'select 1 as health') {
      return { rows: [{ health: 1 }] as any, rowCount: 1 };
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

      const record: any = {
        id: uuidv4(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      columns.forEach((col, idx) => {
        record[col] = params[idx];
      });

      const key = record.id || record.google_form_id || uuidv4();
      table.set(key, record);
      return { rows: [record] as any, rowCount: 1 };
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

      return { rows: records as any, rowCount: records.length };
    }

    if (lower.startsWith('update')) {
      const updatedRows: any[] = [];
      for (const [id, record] of Array.from(table.entries())) {
        if (params.includes(id) || params.includes(record.id) || params.includes(record.google_form_id)) {
          record.updated_at = new Date();
          table.set(id, record);
          updatedRows.push(record);
        }
      }
      return { rows: updatedRows as any, rowCount: updatedRows.length };
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
}
