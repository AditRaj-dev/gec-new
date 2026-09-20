import { CoreDatabaseService } from '../../database/core-database.service';
import { FormsDatabaseService } from '../../database/forms-database.service';
import { MongoService } from '../../database/mongo.service';
export declare class CopilotToolsService {
    private coreDb;
    private formsDb;
    private mongoDb;
    private readonly logger;
    constructor(coreDb: CoreDatabaseService, formsDb: FormsDatabaseService, mongoDb: MongoService);
    searchCmsContent(query: string, entityType?: string): Promise<{
        id: any;
        entityType: any;
        title: any;
        slug: any;
        version: any;
        updatedAt: any;
    }[]>;
    getCmsDraft(id: string): Promise<{
        id: any;
        entityType: any;
        title: any;
        slug: any;
        version: any;
        workflowState: any;
        data: any;
        updatedAt: any;
    }>;
    proposeCmsDraftUpdate(conversationId: string, actorId: string, targetId: string, expectedVersion: number, fieldDiff: Record<string, any>): Promise<{
        proposalId: string;
        confirmationToken: string;
        expiresAt: string;
        actionType: string;
        preview: {
            targetId: string;
            currentVersion: any;
            expectedVersion: number;
            changedFields: string[];
            diff: Record<string, any>;
        };
    }>;
    createGoogleFormPlan(conversationId: string, actorId: string, planBody: any): Promise<{
        proposalId: string;
        confirmationToken: string;
        expiresAt: string;
        actionType: string;
        plan: {
            title: any;
            documentTitle: any;
            description: any;
            settings: any;
            items: any;
            branching: any;
            requiredManualSteps: any[];
        };
    }>;
    proposeGoogleFormUpdate(conversationId: string, actorId: string, formId: string, currentRevisionId: string, changes: any): Promise<{
        proposalId: string;
        confirmationToken: string;
        expiresAt: string;
        actionType: string;
        preview: {
            formId: any;
            title: any;
            currentRevisionId: string;
            changes: any;
        };
    }>;
    buildSubmissionFilter(formId: string, formRevisionId: string, predicates: Array<{
        fieldId: string;
        operator: string;
        value?: any;
    }>, sort: Array<{
        fieldId: string;
        direction: 'asc' | 'desc';
    }>, limit?: number): Promise<{
        formId: string;
        formRevisionId: string;
        predicates: {
            fieldId: string;
            operator: string;
            value?: any;
        }[];
        sort: {
            fieldId: string;
            direction: "asc" | "desc";
        }[];
        limit: number;
    }>;
    proposePublishGoogleForm(conversationId: string, actorId: string, formId: string): Promise<{
        proposalId: string;
        confirmationToken: string;
        expiresAt: string;
        actionType: string;
        preview: {
            formId: any;
            title: any;
            currentState: any;
            nextState: string;
        };
    }>;
}
