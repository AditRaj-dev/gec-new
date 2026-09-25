import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CoreDatabaseService } from '../../database/core-database.service';

export interface AuditRecordInput {
  actorId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  requestId?: string;
  ipAddress?: string;
  details?: Record<string, any>;
  contentHash?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private coreDb: CoreDatabaseService) {}

  async log(input: AuditRecordInput): Promise<string> {
    const id = uuidv4();
    try {
      await this.coreDb.query(
        `INSERT INTO audit_logs (id, actor_id, action, resource_type, resource_id, request_id, ip_address, details, content_hash, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
        [
          id,
          input.actorId || null,
          input.action,
          input.resourceType,
          input.resourceId || null,
          input.requestId || null,
          input.ipAddress || null,
          JSON.stringify(input.details || {}),
          input.contentHash || null,
        ],
      );
    } catch (err: any) {
      this.logger.error(`Failed to record audit log: ${err.message}`, err.stack);
    }
    return id;
  }

  async queryLogs(filter: { actorId?: string; resourceType?: string; limit?: number }) {
    const limit = filter.limit || 50;
    const res = await this.coreDb.query(
      `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1`,
      [limit],
    );
    return res.rows;
  }
}
