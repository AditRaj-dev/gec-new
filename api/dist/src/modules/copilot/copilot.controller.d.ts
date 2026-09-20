import { Response } from 'express';
import { CopilotService } from './copilot.service';
import { CreateConversationDto, SendMessageDto, ConfirmActionDto } from './dto/copilot.dto';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
export declare class CopilotController {
    private readonly copilotService;
    constructor(copilotService: CopilotService);
    createConversation(dto: CreateConversationDto, user: AuthenticatedUser): Promise<{
        id: string;
        title: string;
        expiresAt: string;
    }>;
    getConversation(id: string, user: AuthenticatedUser): Promise<{
        id: any;
        title: any;
        expiresAt: any;
        messages: any[];
        proposals: any[];
    }>;
    deleteConversation(id: string, user: AuthenticatedUser): Promise<{
        success: boolean;
        message: string;
    }>;
    sendMessage(id: string, dto: SendMessageDto, user: AuthenticatedUser, res: Response): Promise<void>;
    confirmAction(id: string, dto: ConfirmActionDto, user: AuthenticatedUser): Promise<{
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
