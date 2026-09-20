"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckTeamScope = exports.TEAM_SCOPE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.TEAM_SCOPE_KEY = 'team_scope_check';
const CheckTeamScope = (paramName = 'teamId') => (0, common_1.SetMetadata)(exports.TEAM_SCOPE_KEY, paramName);
exports.CheckTeamScope = CheckTeamScope;
//# sourceMappingURL=team-scope.decorator.js.map