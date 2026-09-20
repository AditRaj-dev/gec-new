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
exports.CmsPeopleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const people_service_1 = require("./people.service");
const person_dto_1 = require("./dto/person.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const roles_enum_1 = require("../../common/constants/roles.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let CmsPeopleController = class CmsPeopleController {
    constructor(peopleService) {
        this.peopleService = peopleService;
    }
    async create(dto, user) {
        return this.peopleService.create(dto, user.id);
    }
    async list(category) {
        return this.peopleService.list(category);
    }
    async get(id) {
        return this.peopleService.get(id);
    }
    async update(id, dto, user) {
        return this.peopleService.update(id, dto, user.id);
    }
    async publish(id, user) {
        return this.peopleService.publish(id, user.id);
    }
};
exports.CmsPeopleController = CmsPeopleController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.PEOPLE_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'Create person profile (leadership, mentor, member, etc.)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [person_dto_1.CreatePersonDto, Object]),
    __metadata("design:returntype", Promise)
], CmsPeopleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.PEOPLE_READ),
    (0, swagger_1.ApiOperation)({ summary: 'List people profiles in CMS' }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsPeopleController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.PEOPLE_READ),
    (0, swagger_1.ApiOperation)({ summary: 'Get person profile by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsPeopleController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.PEOPLE_EDIT),
    (0, swagger_1.ApiOperation)({ summary: 'Update person profile' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, person_dto_1.UpdatePersonDto, Object]),
    __metadata("design:returntype", Promise)
], CmsPeopleController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, permissions_decorator_1.RequirePermissions)(roles_enum_1.Permission.CONTENT_PUBLISH),
    (0, swagger_1.ApiOperation)({ summary: 'Publish person profile snapshot' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CmsPeopleController.prototype, "publish", null);
exports.CmsPeopleController = CmsPeopleController = __decorate([
    (0, swagger_1.ApiTags)('CMS People & Leadership'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, common_1.Controller)('v1/cms/people'),
    __metadata("design:paramtypes", [people_service_1.PeopleService])
], CmsPeopleController);
//# sourceMappingURL=cms-people.controller.js.map