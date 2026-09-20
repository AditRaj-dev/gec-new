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
exports.UpdateHeroSpotlightDto = exports.CreateHeroSpotlightDto = exports.HeroVisualAssetsDto = exports.HeroLifecycleState = exports.HeroPriority = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var HeroPriority;
(function (HeroPriority) {
    HeroPriority["P0"] = "P0";
    HeroPriority["P1"] = "P1";
    HeroPriority["P2"] = "P2";
    HeroPriority["P3"] = "P3";
    HeroPriority["P4"] = "P4";
    HeroPriority["P5"] = "P5";
})(HeroPriority || (exports.HeroPriority = HeroPriority = {}));
var HeroLifecycleState;
(function (HeroLifecycleState) {
    HeroLifecycleState["ANNOUNCEMENT"] = "Announcement";
    HeroLifecycleState["APPLICATIONS_OPEN"] = "Applications Open";
    HeroLifecycleState["URGENCY"] = "Urgency";
    HeroLifecycleState["LIVE"] = "Live";
    HeroLifecycleState["COMPLETED"] = "Completed";
    HeroLifecycleState["STORIES"] = "Stories";
})(HeroLifecycleState || (exports.HeroLifecycleState = HeroLifecycleState = {}));
class HeroVisualAssetsDto {
}
exports.HeroVisualAssetsDto = HeroVisualAssetsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://media.gec.org/posters/campaign-16-9.mp4', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HeroVisualAssetsDto.prototype, "videoDesktopUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://media.gec.org/posters/campaign-9-16.mp4', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HeroVisualAssetsDto.prototype, "videoMobileUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://media.gec.org/posters/campaign-desktop.jpg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HeroVisualAssetsDto.prototype, "staticDesktopUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://media.gec.org/posters/campaign-mobile.jpg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], HeroVisualAssetsDto.prototype, "staticMobileUrl", void 0);
class CreateHeroSpotlightDto {
}
exports.CreateHeroSpotlightDto = CreateHeroSpotlightDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SDP 2026 Launch Campaign' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHeroSpotlightDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: HeroPriority, example: HeroPriority.P1 }),
    (0, class_validator_1.IsEnum)(HeroPriority),
    __metadata("design:type", String)
], CreateHeroSpotlightDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: HeroLifecycleState, example: HeroLifecycleState.APPLICATIONS_OPEN }),
    (0, class_validator_1.IsEnum)(HeroLifecycleState),
    __metadata("design:type", String)
], CreateHeroSpotlightDto.prototype, "lifecycleState", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'STARTUP DEVELOPMENT PROGRAM 2026' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHeroSpotlightDto.prototype, "headline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Have an idea? Let us see how far you can take it.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHeroSpotlightDto.prototype, "shortContext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Applications close 28 September.', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHeroSpotlightDto.prototype, "statusTag", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: HeroVisualAssetsDto }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", HeroVisualAssetsDto)
], CreateHeroSpotlightDto.prototype, "visualAssets", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { label: 'Apply Now', url: '/initiatives/sdp-2026/apply' } }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateHeroSpotlightDto.prototype, "primaryCta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { label: 'Explore Program', url: '/initiatives/sdp-2026' }, required: false }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateHeroSpotlightDto.prototype, "secondaryCta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-09-01T00:00:00Z', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHeroSpotlightDto.prototype, "startsAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-09-28T23:59:59Z', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHeroSpotlightDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateHeroSpotlightDto.prototype, "isActive", void 0);
class UpdateHeroSpotlightDto extends CreateHeroSpotlightDto {
}
exports.UpdateHeroSpotlightDto = UpdateHeroSpotlightDto;
//# sourceMappingURL=hero-spotlight.dto.js.map