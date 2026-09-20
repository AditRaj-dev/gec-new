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
exports.PublicPeopleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const people_service_1 = require("./people.service");
const person_dto_1 = require("./dto/person.dto");
let PublicPeopleController = class PublicPeopleController {
    constructor(peopleService) {
        this.peopleService = peopleService;
    }
    async listPublic(category) {
        return this.peopleService.listPublic(category);
    }
    async getPublic(slugOrId) {
        return this.peopleService.getPublic(slugOrId);
    }
};
exports.PublicPeopleController = PublicPeopleController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List published people (leadership, mentors, etc.)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Published people list' }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicPeopleController.prototype, "listPublic", null);
__decorate([
    (0, common_1.Get)(':slugOrId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get published person profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Published person projection' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Person not found or not published' }),
    __param(0, (0, common_1.Param)('slugOrId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicPeopleController.prototype, "getPublic", null);
exports.PublicPeopleController = PublicPeopleController = __decorate([
    (0, swagger_1.ApiTags)('Public People Directory'),
    (0, common_1.Controller)('v1/public/people'),
    __metadata("design:paramtypes", [people_service_1.PeopleService])
], PublicPeopleController);
//# sourceMappingURL=public-people.controller.js.map