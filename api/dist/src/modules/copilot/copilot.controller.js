"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopilotController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const copilot_service_1 = require("./copilot.service");
const copilot_dto_1 = require("./dto/copilot.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const roles_enum_1 = require("../../common/constants/roles.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let CopilotController = class CopilotController {
    constructor(copilotService) {
        this.copilotService = copilotService;
    }
    async createConversation(dto, user) {
        return this.copilotService.createConversation(dto.title, user.id);
    }
    async getConversation(id, user) {
        return this.copilotService.getConversation(id, user.id);
    }
    async deleteConversation(id, user) {
        return this.copilotService.deleteConversation(id, user.id);
    }
    async sendMessage(id, dto, user, res) {
        return this.copilotService.streamMessage(id, dto, user.id, res);
    }
    async confirmAction(id, dto, user) {
        return this.copilotService.confirmAction(id, dto, user.id);
    }
};
exports.CopilotController = CopilotController;
__decorate([
    (0, common_1.Post)('conversations'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.COPILOT_USE),
    (0, swagger_1.ApiOperation)({ summary: 'Create seven-day copilot conversation' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [copilot_dto_1.CreateConversationDto, Object]),
    __metadata("design:returntype", Promise)
], CopilotController.prototype, "createConversation", null);
__decorate([
    (0, common_1.Get)('conversations/:id'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.COPILOT_USE),
    (0, swagger_1.ApiOperation)({ summary: 'Read active conversation and proposals' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CopilotController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Delete)('conversations/:id'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.COPILOT_USE),
    (0, swagger_1.ApiOperation)({ summary: 'Delete conversation and transient context early' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CopilotController.prototype, "deleteConversation", null);
__decorate([
    (0, common_1.Post)('conversations/:id/messages'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.COPILOT_USE),
    (0, swagger_1.ApiOperation)({ summary: 'Submit task turn and stream model events (SSE)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, copilot_dto_1.SendMessageDto, Object, Object]),
    __metadata("design:returntype", Promise)
], CopilotController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)('actions/:id/confirm'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.COPILOT_CONFIRM),
    (0, swagger_1.ApiOperation)({ summary: 'Consume one-time confirmation token and execute mutating proposal' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, copilot_dto_1.ConfirmActionDto, Object]),
    __metadata("design:returntype", Promise)
], CopilotController.prototype, "confirmAction", null);
exports.CopilotController = CopilotController = __decorate([
    (0, swagger_1.ApiTags)('CMS Gemini Copilot Orchestration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('v1/cms/copilot'),
    __metadata("design:paramtypes", [copilot_service_1.CopilotService])
], CopilotController);
//# sourceMappingURL=copilot.controller.js.map