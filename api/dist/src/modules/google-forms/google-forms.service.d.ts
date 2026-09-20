import { ConfigService } from '@nestjs/config';
import { FormsDatabaseService } from '../../database/forms-database.service';
import { AuditService } from '../audit/audit.service';
import { GoogleFormLifecycleState, CreateFormFromPlanDto, UpdateGoogleFormDto, SheetExportDto } from './dto/google-forms.dto';
export declare class GoogleFormsService {
    private formsDb;
    private configService;
    private auditService;
    private readonly logger;
    private formsApi;
    private sheetsApi;
    constructor(formsDb: FormsDatabaseService, configService: ConfigService, auditService: AuditService);
    private initGoogleClient;
    createPlan(plan: any, actorId: string): Promise<{
        planId: string;
        plan: any;
        status: string;
    }>;
    listForms(): Promise<any[]>;
    getForm(id: string): Promise<any>;
    createFormFromPlan(dto: CreateFormFromPlanDto, actorId: string): Promise<{
        id: string;
        googleFormId: string;
        title: any;
        editUrl: string;
        responderUrl: string;
        lifecycleState: GoogleFormLifecycleState.NEEDS_MANUAL_UPLOAD_SETUP | GoogleFormLifecycleState.READY_FOR_REVIEW;
        revisionId: string;
        manualUploadRequired: boolean;
    }>;
    updateForm(id: string, dto: UpdateGoogleFormDto, actorId: string): Promise<{
        googleFormId: any;
        revisionId: string;
        planVersion: any;
        status: string;
    }>;
    verifyManualSteps(id: string, actorId: string): Promise<{
        googleFormId: any;
        lifecycleState: string;
        message: string;
    }>;
    publishForm(id: string, actorId: string): Promise<{
        googleFormId: any;
        lifecycleState: string;
        responderUrl: any;
    }>;
    closeForm(id: string, actorId: string): Promise<{
        googleFormId: any;
        lifecycleState: string;
    }>;
    syncResponses(id: string, actorId: string): Promise<{
        googleFormId: any;
        syncedCount: number;
        syncRunId: string;
        lastResponseSyncAt: string;
    }>;
    getCachedResponses(id: string): Promise<any[]>;
    exportToSheet(id: string, dto: SheetExportDto, actorId: string): Promise<{
        googleFormId: any;
        spreadsheetId: string;
        tabName: string;
        exportedResponses: number;
        status: string;
    }>;
}
