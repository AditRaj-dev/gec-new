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
exports.UpdateStakeholderDto = exports.CreateStakeholderDto = exports.StakeholderType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var StakeholderType;
(function (StakeholderType) {
    StakeholderType["PARTNER"] = "partner";
    StakeholderType["SPEAKER"] = "speaker";
    StakeholderType["STARTUP"] = "startup";
    StakeholderType["ALUMNI"] = "alumni";
})(StakeholderType || (exports.StakeholderType = StakeholderType = {}));
class CreateStakeholderDto {
}
exports.CreateStakeholderDto = CreateStakeholderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'AWS for Startups' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStakeholderDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: StakeholderType, example: StakeholderType.PARTNER }),
    (0, class_validator_1.IsEnum)(StakeholderType),
    __metadata("design:type", String)
], CreateStakeholderDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cloud Infrastructure Partner', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStakeholderDto.prototype, "designation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://media.gec.org/partners/aws.png', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStakeholderDto.prototype, "logoOrAvatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://aws.amazon.com', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStakeholderDto.prototype, "websiteUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Providing $5,000 AWS cloud credits to incubation cohorts', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStakeholderDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateStakeholderDto.prototype, "metadata", void 0);
class UpdateStakeholderDto {
}
exports.UpdateStakeholderDto = UpdateStakeholderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStakeholderDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: StakeholderType, required: false }),
    (0, class_validator_1.IsEnum)(StakeholderType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStakeholderDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStakeholderDto.prototype, "designation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStakeholderDto.prototype, "logoOrAvatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStakeholderDto.prototype, "websiteUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStakeholderDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateStakeholderDto.prototype, "metadata", void 0);
//# sourceMappingURL=stakeholder.dto.js.map