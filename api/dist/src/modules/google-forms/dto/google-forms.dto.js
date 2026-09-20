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
exports.SheetExportDto = exports.VerifyManualStepsDto = exports.UpdateGoogleFormDto = exports.CreateFormFromPlanDto = exports.GoogleFormLifecycleState = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var GoogleFormLifecycleState;
(function (GoogleFormLifecycleState) {
    GoogleFormLifecycleState["PROPOSED"] = "proposed";
    GoogleFormLifecycleState["UNPUBLISHED"] = "unpublished";
    GoogleFormLifecycleState["NEEDS_MANUAL_UPLOAD_SETUP"] = "needs_manual_upload_setup";
    GoogleFormLifecycleState["READY_FOR_REVIEW"] = "ready_for_review";
    GoogleFormLifecycleState["PUBLISHED"] = "published";
    GoogleFormLifecycleState["CLOSED"] = "closed";
    GoogleFormLifecycleState["FAILED"] = "failed";
    GoogleFormLifecycleState["EXTERNAL_MISSING"] = "external_missing";
})(GoogleFormLifecycleState || (exports.GoogleFormLifecycleState = GoogleFormLifecycleState = {}));
class CreateFormFromPlanDto {
}
exports.CreateFormFromPlanDto = CreateFormFromPlanDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of validated GoogleFormPlan' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFormFromPlanDto.prototype, "planId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'idemp_form_create_123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFormFromPlanDto.prototype, "idempotencyKey", void 0);
class UpdateGoogleFormDto {
}
exports.UpdateGoogleFormDto = UpdateGoogleFormDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current Google revision ID for concurrency check' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateGoogleFormDto.prototype, "currentRevisionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Updated Form Title', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateGoogleFormDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateGoogleFormDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'idemp_form_update_123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateGoogleFormDto.prototype, "idempotencyKey", void 0);
class VerifyManualStepsDto {
}
exports.VerifyManualStepsDto = VerifyManualStepsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Optional list of observed Google item IDs if known' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], VerifyManualStepsDto.prototype, "observedItemIds", void 0);
class SheetExportDto {
}
exports.SheetExportDto = SheetExportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SheetExportDto.prototype, "spreadsheetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SDP_2026_v1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SheetExportDto.prototype, "tabName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'idemp_export_123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SheetExportDto.prototype, "idempotencyKey", void 0);
//# sourceMappingURL=google-forms.dto.js.map