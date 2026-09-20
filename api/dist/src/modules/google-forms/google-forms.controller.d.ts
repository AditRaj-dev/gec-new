import { GoogleFormsService } from './google-forms.service';
import { CreateFormFromPlanDto, UpdateGoogleFormDto, SheetExportDto } from './dto/google-forms.dto';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
export declare class GoogleFormsController {
    private readonly formsService;
    constructor(formsService: GoogleFormsService);
    createPlan(plan: any, user: AuthenticatedUser): Promise<{
        planId: string;
        plan: any;
        status: string;
    }>;
    listForms(): Promise<any[]>;
    getForm(id: string): Promise<any>;
    createForm(dto: CreateFormFromPlanDto, user: AuthenticatedUser): Promise<{
        id: string;
        googleFormId: string;
        title: any;
        editUrl: string;
        responderUrl: string;
        lifecycleState: import("./dto/google-forms.dto").GoogleFormLifecycleState.NEEDS_MANUAL_UPLOAD_SETUP | import("./dto/google-forms.dto").GoogleFormLifecycleState.READY_FOR_REVIEW;
        revisionId: string;
        manualUploadRequired: boolean;
    }>;
    updateForm(id: string, dto: UpdateGoogleFormDto, user: AuthenticatedUser): Promise<{
        googleFormId: any;
        revisionId: string;
        planVersion: any;
        status: string;
    }>;
    verifyManualSteps(id: string, user: AuthenticatedUser): Promise<{
        googleFormId: any;
        lifecycleState: string;
        message: string;
    }>;
    publishForm(id: string, user: AuthenticatedUser): Promise<{
        googleFormId: any;
        lifecycleState: string;
        responderUrl: any;
    }>;
    closeForm(id: string, user: AuthenticatedUser): Promise<{
        googleFormId: any;
        lifecycleState: string;
    }>;
    syncResponses(id: string, user: AuthenticatedUser): Promise<{
        googleFormId: any;
        syncedCount: number;
        syncRunId: string;
        lastResponseSyncAt: string;
    }>;
    getResponses(id: string): Promise<any[]>;
    exportToSheet(id: string, dto: SheetExportDto, user: AuthenticatedUser): Promise<{
        googleFormId: any;
        spreadsheetId: string;
        tabName: string;
        exportedResponses: number;
        status: string;
    }>;
}
