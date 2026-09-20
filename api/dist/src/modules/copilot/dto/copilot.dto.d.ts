export declare class CreateConversationDto {
    title?: string;
}
export declare class SendMessageDto {
    message: string;
    currentScreen?: string;
    model?: string;
}
export declare class ConfirmActionDto {
    confirmationToken: string;
    idempotencyKey: string;
}
