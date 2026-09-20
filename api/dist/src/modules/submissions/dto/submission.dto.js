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
exports.UpdateSubmissionStatusDto = exports.CreatePublicSubmissionDto = exports.SubmissionStatus = exports.SubmissionType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var SubmissionType;
(function (SubmissionType) {
    SubmissionType["INITIATIVE_APPLICATION"] = "initiative_application";
    SubmissionType["RECRUITMENT"] = "recruitment";
    SubmissionType["PITCH"] = "pitch";
    SubmissionType["CONTACT"] = "contact";
})(SubmissionType || (exports.SubmissionType = SubmissionType = {}));
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["SUBMITTED"] = "submitted";
    SubmissionStatus["IN_REVIEW"] = "in_review";
    SubmissionStatus["SHORTLISTED"] = "shortlisted";
    SubmissionStatus["REJECTED"] = "rejected";
    SubmissionStatus["ACCEPTED"] = "accepted";
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
class CreatePublicSubmissionDto {
}
exports.CreatePublicSubmissionDto = CreatePublicSubmissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: SubmissionType, example: SubmissionType.INITIATIVE_APPLICATION }),
    (0, class_validator_1.IsEnum)(SubmissionType),
    __metadata("design:type", String)
], CreatePublicSubmissionDto.prototype, "submissionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'e3b0c442-98fc-1c14-9afb-4c7fa3701234', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePublicSubmissionDto.prototype, "targetEntityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rohan Sharma' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePublicSubmissionDto.prototype, "applicantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'rohan.sharma@galgotiasuniversity.edu.in' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePublicSubmissionDto.prototype, "applicantEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+91 9876543210', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePublicSubmissionDto.prototype, "applicantPhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { startupName: 'EdVenture', description: 'AI tutor for STEM' } }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreatePublicSubmissionDto.prototype, "payload", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['private/submissions/pitch-deck.pdf'], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreatePublicSubmissionDto.prototype, "attachmentKeys", void 0);
class UpdateSubmissionStatusDto {
}
exports.UpdateSubmissionStatusDto = UpdateSubmissionStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: SubmissionStatus, example: SubmissionStatus.SHORTLISTED }),
    (0, class_validator_1.IsEnum)(SubmissionStatus),
    __metadata("design:type", String)
], UpdateSubmissionStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Passed preliminary evaluation round', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSubmissionStatusDto.prototype, "note", void 0);
//# sourceMappingURL=submission.dto.js.map