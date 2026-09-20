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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const core_database_service_1 = require("../../../database/core-database.service");
const roles_enum_1 = require("../../../common/constants/roles.enum");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, coreDb) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwt.accessSecret') || 'dev_access_secret_min_32_characters_long_12345678',
        });
        this.coreDb = coreDb;
    }
    async validate(payload) {
        const { sub: userId } = payload;
        const res = await this.coreDb.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = res.rows[0];
        if (!user || !user.is_active) {
            throw new common_1.UnauthorizedException('User account is inactive or not found.');
        }
        const role = user.role;
        const permissions = roles_enum_1.ROLE_PERMISSIONS[role] || [];
        return {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            role: user.role,
            teamScope: user.team_scope,
            permissions,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        core_database_service_1.CoreDatabaseService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map