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
exports.PublicSubmissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const submissions_service_1 = require("./submissions.service");
const submission_dto_1 = require("./dto/submission.dto");
let PublicSubmissionsController = class PublicSubmissionsController {
    constructor(submissionsService) {
        this.submissionsService = submissionsService;
    }
    async create(dto) {
        return this.submissionsService.createPublic(dto);
    }
};
exports.PublicSubmissionsController = PublicSubmissionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit initiative application, join team, pitch, or contact request' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Submission received' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [submission_dto_1.CreatePublicSubmissionDto]),
    __metadata("design:returntype", Promise)
], PublicSubmissionsController.prototype, "create", null);
exports.PublicSubmissionsController = PublicSubmissionsController = __decorate([
    (0, swagger_1.ApiTags)('Public Submissions'),
    (0, common_1.Controller)('v1/public/submissions'),
    __metadata("design:paramtypes", [submissions_service_1.SubmissionsService])
], PublicSubmissionsController);
//# sourceMappingURL=public-submissions.controller.js.map