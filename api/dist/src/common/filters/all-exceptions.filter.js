"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    constructor() {
        this.logger = new common_1.Logger(AllExceptionsFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const requestId = request.headers['x-request-id'] ||
            request.requestId ||
            (0, uuid_1.v4)();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let code = 'INTERNAL_SERVER_ERROR';
        let title = 'Internal Server Error';
        let detail = 'An unexpected error occurred.';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            code = exception.name.toUpperCase().replace(/\s+/g, '_');
            title = exception.message;
            if (typeof res === 'object' && res !== null) {
                const resObj = res;
                if (resObj.message) {
                    detail = resObj.message;
                }
                if (resObj.error) {
                    title = resObj.error;
                }
                if (resObj.code) {
                    code = resObj.code;
                }
            }
            else if (typeof res === 'string') {
                detail = res;
            }
        }
        else if (exception instanceof Error) {
            this.logger.error(`[${requestId}] Unhandled exception: ${exception.message}`, exception.stack);
            detail = exception.message;
        }
        const errorPayload = {
            status,
            code,
            title,
            detail,
            requestId,
            timestamp: new Date().toISOString(),
        };
        response.status(status).json(errorPayload);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map