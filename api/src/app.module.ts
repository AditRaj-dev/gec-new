import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from './config/configuration';

// Global Database & Infrastructure Modules
import { CoreDatabaseModule } from './database/core-database.module';
import { FormsDatabaseModule } from './database/forms-database.module';
import { MongoModule } from './database/mongo.module';
import { AuditModule } from './modules/audit/audit.module';
import { OutboxModule } from './modules/outbox/outbox.module';

// Feature Modules
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContentModule } from './modules/content/content.module';
import { PeopleModule } from './modules/people/people.module';
import { TeamsModule } from './modules/teams/teams.module';
import { InitiativesModule } from './modules/initiatives/initiatives.module';
import { StoriesModule } from './modules/stories/stories.module';
import { HeroModule } from './modules/hero/hero.module';
import { StakeholdersModule } from './modules/stakeholders/stakeholders.module';
import { MediaModule } from './modules/media/media.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { CopilotModule } from './modules/copilot/copilot.module';
import { GoogleFormsModule } from './modules/google-forms/google-forms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),

    // Core Data & Infra
    CoreDatabaseModule,
    FormsDatabaseModule,
    MongoModule,
    AuditModule,
    OutboxModule,

    // Domains
    HealthModule,
    AuthModule,
    ContentModule,
    PeopleModule,
    TeamsModule,
    InitiativesModule,
    StoriesModule,
    HeroModule,
    StakeholdersModule,
    MediaModule,
    SubmissionsModule,
    CopilotModule,
    GoogleFormsModule,
  ],
})
export class AppModule {}
