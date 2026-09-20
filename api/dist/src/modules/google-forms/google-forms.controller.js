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
exports.GoogleFormsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const google_forms_service_1 = require("./google-forms.service");
const google_forms_dto_1 = require("./dto/google-forms.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const roles_enum_1 = require("../../common/constants/roles.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let GoogleFormsController = class GoogleFormsController {
    constructor(formsService) {
        this.formsService = formsService;
    }
    async createPlan(plan, user) {
        return this.formsService.createPlan(plan, user.id);
    }
    async listForms() {
        return this.formsService.listForms();
    }
    async getForm(id) {
        return this.formsService.getForm(id);
    }
    async createForm(dto, user) {
        return this.formsService.createFormFromPlan(dto, user.id);
    }
    async updateForm(id, dto, user) {
        return this.formsService.updateForm(id, dto, user.id);
    }
    async verifyManualSteps(id, user) {
        return this.formsService.verifyManualSteps(id, user.id);
    }
    async publishForm(id, user) {
        return this.formsService.publishForm(id, user.id);
    }
    async closeForm(id, user) {
        return this.formsService.closeForm(id, user.id);
    }
    async syncResponses(id, user) {
        return this.formsService.syncResponses(id, user.id);
    }
    async getResponses(id) {
        return this.formsService.getCachedResponses(id);
    }
    async exportToSheet(id, dto, user) {
        return this.formsService.exportToSheet(id, dto, user.id);
    }
};
exports.GoogleFormsController = GoogleFormsController;
__decorate([
    (0, common_1.Post)('plans'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.FORMS_CREATE),
    (0, swagger_1.ApiOperation)({ summary: 'Submit and validate structured GoogleFormPlan' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GoogleFormsController.prototype, "createPlan", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.FORMS_READ),
    (0, swagger_1.ApiOperation)({ summary: 'List managed Google Forms' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GoogleFormsController.prototype, "listForms", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.FORMS_READ),
    (0, swagger_1.ApiOperation)({ summary: 'Get Google Form registry, latest revision, and manual requirements' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GoogleFormsController.prototype, "getForm", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.FORMS_CREATE),
    (0, swagger_1.ApiOperation)({ summary: 'Create unpublished Google Form from validated plan' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [google_forms_dto_1.CreateFormFromPlanDto, Object]),
    __metadata("design:returntype", Promise)
], GoogleFormsController.prototype, "createForm", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.FORMS_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'Apply reviewed update with Google revision conflict check' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, google_forms_dto_1.UpdateGoogleFormDto, Object]),
    __metadata("design:returntype", Promise)
], GoogleFormsController.prototype, "updateForm", null);
__decorate([
    (0, common_1.Post)(':id/verify-manual-steps'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.FORMS_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'Verify manual file-upload questions configured in Google editor' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GoogleFormsController.prototype, "verifyManualSteps", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.FORMS_PUBLISH),
    (0, swagger_1.ApiOperation)({ summary: 'Separately confirm publication of verified Google Form' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GoogleFormsController.prototype, "publishForm", null);
__decorate([
    (0, common_1.Post)(':id/close'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.FORMS_PUBLISH),
    (0, swagger_1.ApiOperation)({ summary: 'Close Google Form to stop accepting responses' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GoogleFormsController.prototype, "closeForm", null);
__decorate([
    (0, common_1.Post)(':id/responses/sync'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.FORMS_RESPONSES_READ),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger on-demand response cache synchronization' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GoogleFormsController.prototype, "syncResponses", null);
__decorate([
    (0, common_1.Get)(':id/responses'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.FORMS_RESPONSES_READ),
    (0, swagger_1.ApiOperation)({ summary: 'Filter and inspect cached responses' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GoogleFormsController.prototype, "getResponses", null);
__decorate([
    (0, common_1.Post)(':id/sheet-export'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.FORMS_RESPONSES_EXPORT),
    (0, swagger_1.ApiOperation)({ summary: 'Manually export unexported responses to configured Google Sheet tab' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, google_forms_dto_1.SheetExportDto, Object]),
    __metadata("design:returntype", Promise)
], GoogleFormsController.prototype, "exportToSheet", null);
exports.GoogleFormsController = GoogleFormsController = __decorate([
    (0, swagger_1.ApiTags)('CMS Google Forms Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('v1/cms/google-forms'),
    __metadata("design:paramtypes", [google_forms_service_1.GoogleFormsService])
], GoogleFormsController);
//# sourceMappingURL=google-forms.controller.js.map