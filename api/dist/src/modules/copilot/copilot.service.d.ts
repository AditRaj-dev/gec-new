import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CoreDatabaseService } from '../../database/core-database.service';
import { FormsDatabaseService } from '../../database/forms-database.service';
import { MongoService } from '../../database/mongo.service';
import { AuditService } from '../audit/audit.service';
import { ContentService } from '../content/content.service';
import { CopilotToolsService } from './copilot-tools.service';
import { SendMessageDto, ConfirmActionDto } from './dto/copilot.dto';
export declare class CopilotService {
    private coreDb;
    private formsDb;
    private mongoDb;
    private configService;
    private auditService;
    private contentService;
    private toolsService;
    private readonly logger;
    private genAI;
    constructor(coreDb: CoreDatabaseService, formsDb: FormsDatabaseService, mongoDb: MongoService, configService: ConfigService, auditService: AuditService, contentService: ContentService, toolsService: CopilotToolsService);
    private initGemini;
    createConversation(title?: string, actorId?: string): Promise<{
        id: string;
        title: string;
        expiresAt: string;
    }>;
    getConversation(id: string, actorId: string): Promise<{
        id: any;
        title: any;
        expiresAt: any;
        messages: any[];
        proposals: any[];
    }>;
    deleteConversation(id: string, actorId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    streamMessage(conversationId: string, dto: SendMessageDto, actorId: string, res: Response): Promise<void>;
    confirmAction(actionId: string, confirmDto: ConfirmActionDto, actorId: string): Promise<{
        success: boolean;
        status: string;
        actionType: any;
        message: string;
        actionId?: undefined;
        result?: undefined;
    } | {
        success: boolean;
        actionId: string;
        actionType: any;
        status: string;
        result: any;
        message?: undefined;
    }>;
}
