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
exports.UpdatePersonDto = exports.CreatePersonDto = exports.PersonCategory = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var PersonCategory;
(function (PersonCategory) {
    PersonCategory["LEADERSHIP"] = "leadership";
    PersonCategory["MENTORS"] = "mentors";
    PersonCategory["TEAM_HEADS"] = "team_heads";
    PersonCategory["COORDINATORS"] = "coordinators";
    PersonCategory["MEMBERS"] = "members";
    PersonCategory["ALUMNI"] = "alumni";
})(PersonCategory || (exports.PersonCategory = PersonCategory = {}));
class CreatePersonDto {
}
exports.CreatePersonDto = CreatePersonDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dr. Jane Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PersonCategory, example: PersonCategory.LEADERSHIP }),
    (0, class_validator_1.IsEnum)(PersonCategory),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Faculty Mentor & Strategic Advisor' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "roleTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'team_01', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "teamScope", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://media.gec.org/avatar.jpg', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Executive bio and achievements', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePersonDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { linkedin: 'https://linkedin.com/in/janedoe' }, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePersonDto.prototype, "socialLinks", void 0);
class UpdatePersonDto {
}
exports.UpdatePersonDto = UpdatePersonDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePersonDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PersonCategory, required: false }),
    (0, class_validator_1.IsEnum)(PersonCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePersonDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePersonDto.prototype, "roleTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePersonDto.prototype, "teamScope", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePersonDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePersonDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdatePersonDto.prototype, "socialLinks", void 0);
//# sourceMappingURL=person.dto.js.map