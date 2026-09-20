import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export interface ApiErrorResponse {
    status: number;
    code: string;
    title: string;
    detail: string | string[];
    requestId: string;
    timestamp: string;
}
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
}
