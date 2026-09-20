"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = exports.Permission = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "Super Admin";
    Role["CORE_TEAM_ADMIN"] = "Core Team Admin";
    Role["TEAM_HEAD"] = "Team Head";
    Role["CONTENT_EDITOR"] = "Content Editor";
    Role["VIEWER"] = "Viewer";
})(Role || (exports.Role = Role = {}));
var Permission;
(function (Permission) {
    Permission["CONTENT_READ"] = "content.read";
    Permission["CONTENT_EDIT"] = "content.edit";
    Permission["CONTENT_PUBLISH"] = "content.publish";
    Permission["PEOPLE_READ"] = "people.read";
    Permission["PEOPLE_EDIT"] = "people.edit";
    Permission["TEAMS_READ"] = "teams.read";
    Permission["TEAMS_EDIT"] = "teams.edit";
    Permission["INITIATIVES_READ"] = "initiatives.read";
    Permission["INITIATIVES_EDIT"] = "initiatives.edit";
    Permission["STORIES_READ"] = "stories.read";
    Permission["STORIES_EDIT"] = "stories.edit";
    Permission["STAKEHOLDERS_READ"] = "stakeholders.read";
    Permission["STAKEHOLDERS_EDIT"] = "stakeholders.edit";
    Permission["HERO_MANAGE"] = "hero.manage";
    Permission["MEDIA_UPLOAD"] = "media.upload";
    Permission["MEDIA_MANAGE"] = "media.manage";
    Permission["SUBMISSIONS_READ"] = "submissions.read";
    Permission["SUBMISSIONS_MANAGE"] = "submissions.manage";
    Permission["SUBMISSIONS_EXPORT"] = "submissions.export";
    Permission["FORMS_READ"] = "forms.read";
    Permission["FORMS_CREATE"] = "forms.create";
    Permission["FORMS_EDIT"] = "forms.edit";
    Permission["FORMS_PUBLISH"] = "forms.publish";
    Permission["FORMS_RESPONSES_READ"] = "forms.responses.read";
    Permission["FORMS_RESPONSES_EXPORT"] = "forms.responses.export";
    Permission["COPILOT_USE"] = "copilot.use";
    Permission["COPILOT_CONFIRM"] = "copilot.confirm";
    Permission["USERS_MANAGE"] = "users.manage";
    Permission["AUDIT_READ"] = "audit.read";
})(Permission || (exports.Permission = Permission = {}));
exports.ROLE_PERMISSIONS = {
    [Role.SUPER_ADMIN]: Object.values(Permission),
    [Role.CORE_TEAM_ADMIN]: [
        Permission.CONTENT_READ,
        Permission.CONTENT_EDIT,
        Permission.CONTENT_PUBLISH,
        Permission.PEOPLE_READ,
        Permission.PEOPLE_EDIT,
        Permission.TEAMS_READ,
        Permission.TEAMS_EDIT,
        Permission.INITIATIVES_READ,
        Permission.INITIATIVES_EDIT,
        Permission.STORIES_READ,
        Permission.STORIES_EDIT,
        Permission.STAKEHOLDERS_READ,
        Permission.STAKEHOLDERS_EDIT,
        Permission.HERO_MANAGE,
        Permission.MEDIA_UPLOAD,
        Permission.MEDIA_MANAGE,
        Permission.SUBMISSIONS_READ,
        Permission.SUBMISSIONS_MANAGE,
        Permission.SUBMISSIONS_EXPORT,
        Permission.FORMS_READ,
        Permission.FORMS_CREATE,
        Permission.FORMS_EDIT,
        Permission.FORMS_PUBLISH,
        Permission.FORMS_RESPONSES_READ,
        Permission.FORMS_RESPONSES_EXPORT,
        Permission.COPILOT_USE,
        Permission.COPILOT_CONFIRM,
        Permission.USERS_MANAGE,
        Permission.AUDIT_READ,
    ],
    [Role.TEAM_HEAD]: [
        Permission.CONTENT_READ,
        Permission.TEAMS_READ,
        Permission.TEAMS_EDIT,
        Permission.PEOPLE_READ,
        Permission.INITIATIVES_READ,
        Permission.STORIES_READ,
        Permission.MEDIA_UPLOAD,
        Permission.SUBMISSIONS_READ,
        Permission.SUBMISSIONS_MANAGE,
        Permission.FORMS_READ,
        Permission.FORMS_CREATE,
        Permission.FORMS_EDIT,
        Permission.FORMS_RESPONSES_READ,
        Permission.COPILOT_USE,
    ],
    [Role.CONTENT_EDITOR]: [
        Permission.CONTENT_READ,
        Permission.CONTENT_EDIT,
        Permission.PEOPLE_READ,
        Permission.PEOPLE_EDIT,
        Permission.TEAMS_READ,
        Permission.INITIATIVES_READ,
        Permission.INITIATIVES_EDIT,
        Permission.STORIES_READ,
        Permission.STORIES_EDIT,
        Permission.STAKEHOLDERS_READ,
        Permission.STAKEHOLDERS_EDIT,
        Permission.MEDIA_UPLOAD,
        Permission.MEDIA_MANAGE,
        Permission.FORMS_READ,
        Permission.FORMS_CREATE,
        Permission.FORMS_EDIT,
        Permission.COPILOT_USE,
    ],
    [Role.VIEWER]: [
        Permission.CONTENT_READ,
        Permission.PEOPLE_READ,
        Permission.TEAMS_READ,
        Permission.INITIATIVES_READ,
        Permission.STORIES_READ,
        Permission.STAKEHOLDERS_READ,
        Permission.FORMS_READ,
        Permission.AUDIT_READ,
    ],
};
//# sourceMappingURL=roles.enum.js.map