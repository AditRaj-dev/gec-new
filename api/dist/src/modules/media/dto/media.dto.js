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
exports.CompleteUploadDto = exports.PresignUploadDto = exports.BucketClass = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var BucketClass;
(function (BucketClass) {
    BucketClass["PUBLIC"] = "public";
    BucketClass["PRIVATE"] = "private";
})(BucketClass || (exports.BucketClass = BucketClass = {}));
class PresignUploadDto {
}
exports.PresignUploadDto = PresignUploadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'hero-banner.jpg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PresignUploadDto.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image/jpeg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PresignUploadDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2097152, description: 'File size in bytes (max 100MB)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Max)(104857600),
    __metadata("design:type", Number)
], PresignUploadDto.prototype, "byteSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: BucketClass, example: BucketClass.PUBLIC }),
    (0, class_validator_1.IsEnum)(BucketClass),
    __metadata("design:type", String)
], PresignUploadDto.prototype, "bucketClass", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'hero_spotlight', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PresignUploadDto.prototype, "purpose", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'hero', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PresignUploadDto.prototype, "entityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'e3b0c442-98fc-1c14-9afb-4c7fa3701234', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PresignUploadDto.prototype, "entityId", void 0);
class CompleteUploadDto {
}
exports.CompleteUploadDto = CompleteUploadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'public/hero/e3b0c442/asset-123/v1-hero-banner.jpg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CompleteUploadDto.prototype, "r2Key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: BucketClass, example: BucketClass.PUBLIC }),
    (0, class_validator_1.IsEnum)(BucketClass),
    __metadata("design:type", String)
], CompleteUploadDto.prototype, "bucketClass", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'hero-banner.jpg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CompleteUploadDto.prototype, "originalFilename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image/jpeg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CompleteUploadDto.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2097152 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CompleteUploadDto.prototype, "byteSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'hero_spotlight', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CompleteUploadDto.prototype, "purpose", void 0);
//# sourceMappingURL=media.dto.js.map