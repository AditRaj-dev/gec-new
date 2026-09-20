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
exports.PublicStakeholdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stakeholders_service_1 = require("./stakeholders.service");
const stakeholder_dto_1 = require("./dto/stakeholder.dto");
let PublicStakeholdersController = class PublicStakeholdersController {
    constructor(stakeholdersService) {
        this.stakeholdersService = stakeholdersService;
    }
    async listPublic(type) {
        return this.stakeholdersService.listPublic(type);
    }
    async getPublic(slugOrId) {
        return this.stakeholdersService.getPublic(slugOrId);
    }
};
exports.PublicStakeholdersController = PublicStakeholdersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List published stakeholders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Published stakeholders list' }),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicStakeholdersController.prototype, "listPublic", null);
__decorate([
    (0, common_1.Get)(':slugOrId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get published stakeholder profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Published stakeholder profile' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Stakeholder not found or not published' }),
    __param(0, (0, common_1.Param)('slugOrId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicStakeholdersController.prototype, "getPublic", null);
exports.PublicStakeholdersController = PublicStakeholdersController = __decorate([
    (0, swagger_1.ApiTags)('Public Stakeholders'),
    (0, common_1.Controller)('v1/public/stakeholders'),
    __metadata("design:paramtypes", [stakeholders_service_1.StakeholdersService])
], PublicStakeholdersController);
//# sourceMappingURL=public-stakeholders.controller.js.map