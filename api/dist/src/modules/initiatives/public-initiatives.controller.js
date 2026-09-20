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
exports.PublicInitiativesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const initiatives_service_1 = require("./initiatives.service");
let PublicInitiativesController = class PublicInitiativesController {
    constructor(initiativesService) {
        this.initiativesService = initiativesService;
    }
    async listPublic() {
        return this.initiativesService.listPublic();
    }
    async getPublic(slugOrId) {
        return this.initiativesService.getPublic(slugOrId);
    }
};
exports.PublicInitiativesController = PublicInitiativesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List published initiatives' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Published initiatives list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicInitiativesController.prototype, "listPublic", null);
__decorate([
    (0, common_1.Get)(':slugOrId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get published initiative details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Published initiative details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Initiative not found or not published' }),
    __param(0, (0, common_1.Param)('slugOrId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicInitiativesController.prototype, "getPublic", null);
exports.PublicInitiativesController = PublicInitiativesController = __decorate([
    (0, swagger_1.ApiTags)('Public Initiatives'),
    (0, common_1.Controller)('v1/public/initiatives'),
    __metadata("design:paramtypes", [initiatives_service_1.InitiativesService])
], PublicInitiativesController);
//# sourceMappingURL=public-initiatives.controller.js.map