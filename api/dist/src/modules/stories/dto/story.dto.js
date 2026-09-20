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
exports.UpdateStoryDto = exports.CreateStoryDto = exports.StoryCategory = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var StoryCategory;
(function (StoryCategory) {
    StoryCategory["NEWS"] = "news";
    StoryCategory["FOUNDER_STORIES"] = "founder_stories";
    StoryCategory["STARTUP_STORIES"] = "startup_stories";
    StoryCategory["EVENT_STORIES"] = "event_stories";
    StoryCategory["FEATURED_STORIES"] = "featured_stories";
})(StoryCategory || (exports.StoryCategory = StoryCategory = {}));
class CreateStoryDto {
}
exports.CreateStoryDto = CreateStoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'how-student-startup-raised-pre-seed' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStoryDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'How a Student Team Raised Pre-Seed through GEC Incubator' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStoryDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: StoryCategory, example: StoryCategory.STARTUP_STORIES }),
    (0, class_validator_1.IsEnum)(StoryCategory),
    __metadata("design:type", String)
], CreateStoryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'An inspiring journey of campus entrepreneurs...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStoryDto.prototype, "excerpt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Full rich markdown or html story body...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStoryDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://media.gec.org/story-cover.jpg', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStoryDto.prototype, "coverImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Alex Smith', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStoryDto.prototype, "authorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateStoryDto.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['incubation', 'funding', 'students'], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateStoryDto.prototype, "tags", void 0);
class UpdateStoryDto {
}
exports.UpdateStoryDto = UpdateStoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStoryDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: StoryCategory, required: false }),
    (0, class_validator_1.IsEnum)(StoryCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStoryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStoryDto.prototype, "excerpt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStoryDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStoryDto.prototype, "coverImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateStoryDto.prototype, "authorName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateStoryDto.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateStoryDto.prototype, "tags", void 0);
//# sourceMappingURL=story.dto.js.map