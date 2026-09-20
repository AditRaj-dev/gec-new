export declare enum Role {
    SUPER_ADMIN = "Super Admin",
    CORE_TEAM_ADMIN = "Core Team Admin",
    TEAM_HEAD = "Team Head",
    CONTENT_EDITOR = "Content Editor",
    VIEWER = "Viewer"
}
export declare enum Permission {
    CONTENT_READ = "content.read",
    CONTENT_EDIT = "content.edit",
    CONTENT_PUBLISH = "content.publish",
    PEOPLE_READ = "people.read",
    PEOPLE_EDIT = "people.edit",
    TEAMS_READ = "teams.read",
    TEAMS_EDIT = "teams.edit",
    INITIATIVES_READ = "initiatives.read",
    INITIATIVES_EDIT = "initiatives.edit",
    STORIES_READ = "stories.read",
    STORIES_EDIT = "stories.edit",
    STAKEHOLDERS_READ = "stakeholders.read",
    STAKEHOLDERS_EDIT = "stakeholders.edit",
    HERO_MANAGE = "hero.manage",
    MEDIA_UPLOAD = "media.upload",
    MEDIA_MANAGE = "media.manage",
    SUBMISSIONS_READ = "submissions.read",
    SUBMISSIONS_MANAGE = "submissions.manage",
    SUBMISSIONS_EXPORT = "submissions.export",
    FORMS_READ = "forms.read",
    FORMS_CREATE = "forms.create",
    FORMS_EDIT = "forms.edit",
    FORMS_PUBLISH = "forms.publish",
    FORMS_RESPONSES_READ = "forms.responses.read",
    FORMS_RESPONSES_EXPORT = "forms.responses.export",
    COPILOT_USE = "copilot.use",
    COPILOT_CONFIRM = "copilot.confirm",
    USERS_MANAGE = "users.manage",
    AUDIT_READ = "audit.read"
}
export declare const ROLE_PERMISSIONS: Record<Role, Permission[]>;
