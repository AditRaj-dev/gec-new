"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const configuration_1 = require("./config/configuration");
const core_database_module_1 = require("./database/core-database.module");
const forms_database_module_1 = require("./database/forms-database.module");
const mongo_module_1 = require("./database/mongo.module");
const audit_module_1 = require("./modules/audit/audit.module");
const outbox_module_1 = require("./modules/outbox/outbox.module");
const health_module_1 = require("./modules/health/health.module");
const auth_module_1 = require("./modules/auth/auth.module");
const content_module_1 = require("./modules/content/content.module");
const people_module_1 = require("./modules/people/people.module");
const teams_module_1 = require("./modules/teams/teams.module");
const initiatives_module_1 = require("./modules/initiatives/initiatives.module");
const stories_module_1 = require("./modules/stories/stories.module");
const hero_module_1 = require("./modules/hero/hero.module");
const stakeholders_module_1 = require("./modules/stakeholders/stakeholders.module");
const media_module_1 = require("./modules/media/media.module");
const submissions_module_1 = require("./modules/submissions/submissions.module");
const copilot_module_1 = require("./modules/copilot/copilot.module");
const google_forms_module_1 = require("./modules/google-forms/google-forms.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            schedule_1.ScheduleModule.forRoot(),
            core_database_module_1.CoreDatabaseModule,
            forms_database_module_1.FormsDatabaseModule,
            mongo_module_1.MongoModule,
            audit_module_1.AuditModule,
            outbox_module_1.OutboxModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            content_module_1.ContentModule,
            people_module_1.PeopleModule,
            teams_module_1.TeamsModule,
            initiatives_module_1.InitiativesModule,
            stories_module_1.StoriesModule,
            hero_module_1.HeroModule,
            stakeholders_module_1.StakeholdersModule,
            media_module_1.MediaModule,
            submissions_module_1.SubmissionsModule,
            copilot_module_1.CopilotModule,
            google_forms_module_1.GoogleFormsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map