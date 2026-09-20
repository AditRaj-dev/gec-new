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
exports.PublicTeamsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const teams_service_1 = require("./teams.service");
let PublicTeamsController = class PublicTeamsController {
    constructor(teamsService) {
        this.teamsService = teamsService;
    }
    async listPublic() {
        return this.teamsService.listPublic();
    }
    async getPublic(slugOrId) {
        return this.teamsService.getPublic(slugOrId);
    }
};
exports.PublicTeamsController = PublicTeamsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List published teams (01-07)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Published teams list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicTeamsController.prototype, "listPublic", null);
__decorate([
    (0, common_1.Get)(':slugOrId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get published team details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Published team projection' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Team not found or not published' }),
    __param(0, (0, common_1.Param)('slugOrId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicTeamsController.prototype, "getPublic", null);
exports.PublicTeamsController = PublicTeamsController = __decorate([
    (0, swagger_1.ApiTags)('Public Teams Directory'),
    (0, common_1.Controller)('v1/public/teams'),
    __metadata("design:paramtypes", [teams_service_1.TeamsService])
], PublicTeamsController);
//# sourceMappingURL=public-teams.controller.js.map