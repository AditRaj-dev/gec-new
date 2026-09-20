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
exports.PublicHeroController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hero_service_1 = require("./hero.service");
let PublicHeroController = class PublicHeroController {
    constructor(heroService) {
        this.heroService = heroService;
    }
    async getActiveHero() {
        return this.heroService.getActiveHero();
    }
};
exports.PublicHeroController = PublicHeroController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current active hero spotlight (or evergreen fallback)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active hero billboard projection' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicHeroController.prototype, "getActiveHero", null);
exports.PublicHeroController = PublicHeroController = __decorate([
    (0, swagger_1.ApiTags)('Public Hero Spotlight'),
    (0, common_1.Controller)('v1/public/hero'),
    __metadata("design:paramtypes", [hero_service_1.HeroService])
], PublicHeroController);
//# sourceMappingURL=public-hero.controller.js.map