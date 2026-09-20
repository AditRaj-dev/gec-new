"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const uuid_1 = require("uuid");
let LoggingInterceptor = class LoggingInterceptor {
    constructor() {
        this.logger = new common_1.Logger('HTTP');
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const requestId = request.headers['x-request-id'] || (0, uuid_1.v4)();
        request.requestId = requestId;
        response.setHeader('X-Request-Id', requestId);
        const startTime = Date.now();
        const { method, originalUrl, ip } = request;
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                const duration = Date.now() - startTime;
                const statusCode = response.statusCode;
                this.logger.log(JSON.stringify({
                    timestamp: new Date().toISOString(),
                    level: 'info',
                    requestId,
                    method,
                    route: originalUrl,
                    status: statusCode,
                    latencyMs: duration,
                    ip,
                }));
            },
            error: (err) => {
                const duration = Date.now() - startTime;
                const statusCode = err.status || 500;
                this.logger.error(JSON.stringify({
                    timestamp: new Date().toISOString(),
                    level: 'error',
                    requestId,
                    method,
                    route: originalUrl,
                    status: statusCode,
                    latencyMs: duration,
                    ip,
                    error: err.message,
                }));
            },
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map