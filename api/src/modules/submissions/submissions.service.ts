import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CoreDatabaseService } from '../../database/core-database.service';
import { AuditService } from '../audit/audit.service';
import {
  CreatePublicSubmissionDto,
  UpdateSubmissionStatusDto,
  SubmissionType,
  SubmissionStatus,
} from './dto/submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    private coreDb: CoreDatabaseService,
    private auditService: AuditService,
  ) {}

  async createPublic(dto: CreatePublicSubmissionDto) {
    const id = uuidv4();
    await this.coreDb.query(
      `INSERT INTO submissions (id, submission_type, target_entity_id, applicant_name, applicant_email, applicant_phone, status, payload, attachment_keys, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'submitted', $7, $8, NOW(), NOW())`,
      [
        id,
        dto.submissionType,
        dto.targetEntityId || null,
        dto.applicantName,
        dto.applicantEmail,
        dto.applicantPhone || null,
        JSON.stringify(dto.payload),
        JSON.stringify(dto.attachmentKeys || []),
      ],
    );

    return {
      success: true,
      submissionId: id,
      message: 'Submission received successfully. Our team will review your application.',
    };
  }

  async list(filter: { submissionType?: SubmissionType; status?: SubmissionStatus; limit?: number }) {
    const limit = filter.limit || 100;
    const res = await this.coreDb.query(
      `SELECT * FROM submissions ORDER BY created_at DESC LIMIT $1`,
      [limit],
    );

    let items = res.rows;
    if (filter.submissionType) {
      items = items.filter((s) => s.submission_type === filter.submissionType);
    }
    if (filter.status) {
      items = items.filter((s) => s.status === filter.status);
    }

    return items;
  }

  async get(id: string) {
    const res = await this.coreDb.query('SELECT * FROM submissions WHERE id = $1', [id]);
    const item = res.rows[0];
    if (!item) {
      throw new NotFoundException(`Submission '${id}' not found.`);
    }
    return item;
  }

  async updateStatus(id: string, dto: UpdateSubmissionStatusDto, actorId: string) {
    const existing = await this.get(id);

    await this.coreDb.query(
      `UPDATE submissions SET status = $1, updated_at = NOW() WHERE id = $2`,
      [dto.status, id],
    );

    await this.auditService.log({
      actorId,
      action: 'submission.update_status',
      resourceType: 'submission',
      resourceId: id,
      details: { previousStatus: existing.status, newStatus: dto.status, note: dto.note },
    });

    return { success: true, status: dto.status };
  }

  async exportCsv(submissionType?: SubmissionType): Promise<string> {
    const items = await this.list({ submissionType, limit: 1000 });
    const headers = ['ID', 'Type', 'Applicant Name', 'Applicant Email', 'Phone', 'Status', 'Submitted At'];

    const rows = items.map((s) => [
      s.id,
      s.submission_type,
      `"${(s.applicant_name || '').replace(/"/g, '""')}"`,
      `"${(s.applicant_email || '').replace(/"/g, '""')}"`,
      `"${(s.applicant_phone || '').replace(/"/g, '""')}"`,
      s.status,
      new Date(s.created_at).toISOString(),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}
