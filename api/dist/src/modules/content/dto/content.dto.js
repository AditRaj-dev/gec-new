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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitionWorkflowDto = exports.UpdateContentDraftDto = exports.CreateContentDraftDto = exports.WorkflowState = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var WorkflowState;
(function (WorkflowState) {
    WorkflowState["DRAFT"] = "draft";
    WorkflowState["IN_REVIEW"] = "in_review";
    WorkflowState["PUBLISHED"] = "published";
    WorkflowState["SCHEDULED"] = "scheduled";
    WorkflowState["ARCHIVED"] = "archived";
})(WorkflowState || (exports.WorkflowState = WorkflowState = {}));
class CreateContentDraftDto {
}
exports.CreateContentDraftDto = CreateContentDraftDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'initiatives' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContentDraftDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'startup-development-program-2026' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContentDraftDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Startup Development Program 2026' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContentDraftDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { summary: 'Flagship pre-incubation program' } }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateContentDraftDto.prototype, "data", void 0);
class UpdateContentDraftDto {
}
exports.UpdateContentDraftDto = UpdateContentDraftDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Expected version for optimistic concurrency control' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], UpdateContentDraftDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Updated Title' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContentDraftDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'updated-slug' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateContentDraftDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], UpdateContentDraftDto.prototype, "data", void 0);
class TransitionWorkflowDto {
}
exports.TransitionWorkflowDto = TransitionWorkflowDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: WorkflowState, example: WorkflowState.IN_REVIEW }),
    (0, class_validator_1.IsEnum)(WorkflowState),
    __metadata("design:type", String)
], TransitionWorkflowDto.prototype, "workflowState", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TransitionWorkflowDto.prototype, "scheduledPublishAt", void 0);
//# sourceMappingURL=content.dto.js.map