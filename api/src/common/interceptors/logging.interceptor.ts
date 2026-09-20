import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const requestId =
      (request.headers['x-request-id'] as string) || uuidv4();
    (request as any).requestId = requestId;
    response.setHeader('X-Request-Id', requestId);

    const startTime = Date.now();
    const { method, originalUrl, ip } = request;

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;
          this.logger.log(
            JSON.stringify({
              timestamp: new Date().toISOString(),
              level: 'info',
              requestId,
              method,
              route: originalUrl,
              status: statusCode,
              latencyMs: duration,
              ip,
            }),
          );
        },
        error: (err) => {
          const duration = Date.now() - startTime;
          const statusCode = err.status || 500;
          this.logger.error(
            JSON.stringify({
              timestamp: new Date().toISOString(),
              level: 'error',
              requestId,
              method,
              route: originalUrl,
              status: statusCode,
              latencyMs: duration,
              ip,
              error: err.message,
            }),
          );
        },
      }),
    );
  }
}
