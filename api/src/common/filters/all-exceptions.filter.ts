import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface ApiErrorResponse {
  status: number;
  code: string;
  title: string;
  detail: string | string[];
  requestId: string;
  timestamp: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId =
      (request.headers['x-request-id'] as string) ||
      (request as any).requestId ||
      uuidv4();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let title = 'Internal Server Error';
    let detail: string | string[] = 'An unexpected error occurred.';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      code = exception.name.toUpperCase().replace(/\s+/g, '_');
      title = exception.message;

      if (typeof res === 'object' && res !== null) {
        const resObj = res as any;
        if (resObj.message) {
          detail = resObj.message;
        }
        if (resObj.error) {
          title = resObj.error;
        }
        if (resObj.code) {
          code = resObj.code;
        }
      } else if (typeof res === 'string') {
        detail = res;
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `[${requestId}] Unhandled exception: ${exception.message}`,
        exception.stack,
      );
      detail = exception.message;
    }

    const errorPayload: ApiErrorResponse = {
      status,
      code,
      title,
      detail,
      requestId,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorPayload);
  }
}
