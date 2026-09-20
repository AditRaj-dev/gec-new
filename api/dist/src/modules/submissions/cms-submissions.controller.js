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
exports.CmsSubmissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const submissions_service_1 = require("./submissions.service");
const submission_dto_1 = require("./dto/submission.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const roles_enum_1 = require("../../common/constants/roles.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let CmsSubmissionsController = class CmsSubmissionsController {
    constructor(submissionsService) {
        this.submissionsService = submissionsService;
    }
    async list(type, status, limit) {
        return this.submissionsService.list({ submissionType: type, status, limit });
    }
    async exportCsv(type, res) {
        const csv = await this.submissionsService.exportCsv(type);
        return res.send(csv);
    }
    async get(id) {
        return this.submissionsService.get(id);
    }
    async updateStatus(id, dto, user) {
        return this.submissionsService.updateStatus(id, dto, user.id);
    }
};
exports.CmsSubmissionsController = CmsSubmissionsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.SUBMISSIONS_READ),
    (0, swagger_1.ApiOperation)({ summary: 'List and filter submissions' }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], CmsSubmissionsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.SUBMISSIONS_EXPORT),
    (0, swagger_1.ApiOperation)({ summary: 'Export submissions to CSV' }),
    (0, swagger_1.ApiProduces)('text/csv'),
    (0, common_1.Header)('Content-Type', 'text/csv'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="gec_submissions.csv"'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CmsSubmissionsController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.SUBMISSIONS_READ),
    (0, swagger_1.ApiOperation)({ summary: 'Get submission details by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsSubmissionsController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.SUBMISSIONS_MANAGE),
    (0, swagger_1.ApiOperation)({ summary: 'Update submission workflow status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submission_dto_1.UpdateSubmissionStatusDto, Object]),
    __metadata("design:returntype", Promise)
], CmsSubmissionsController.prototype, "updateStatus", null);
exports.CmsSubmissionsController = CmsSubmissionsController = __decorate([
    (0, swagger_1.ApiTags)('CMS Submissions & Applications'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('v1/cms/submissions'),
    __metadata("design:paramtypes", [submissions_service_1.SubmissionsService])
], CmsSubmissionsController);
//# sourceMappingURL=cms-submissions.controller.js.map