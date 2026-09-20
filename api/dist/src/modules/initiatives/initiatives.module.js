"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitiativesModule = void 0;
const common_1 = require("@nestjs/common");
const initiatives_service_1 = require("./initiatives.service");
const cms_initiatives_controller_1 = require("./cms-initiatives.controller");
const public_initiatives_controller_1 = require("./public-initiatives.controller");
const content_module_1 = require("../content/content.module");
let InitiativesModule = class InitiativesModule {
};
exports.InitiativesModule = InitiativesModule;
exports.InitiativesModule = InitiativesModule = __decorate([
    (0, common_1.Module)({
        imports: [content_module_1.ContentModule],
        controllers: [cms_initiatives_controller_1.CmsInitiativesController, public_initiatives_controller_1.PublicInitiativesController],
        providers: [initiatives_service_1.InitiativesService],
        exports: [initiatives_service_1.InitiativesService],
    })
], InitiativesModule);
//# sourceMappingURL=initiatives.module.js.map