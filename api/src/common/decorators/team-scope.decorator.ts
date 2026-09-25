import { SetMetadata } from '@nestjs/common';

export const TEAM_SCOPE_KEY = 'team_scope_check';
export const CheckTeamScope = (paramName = 'teamId') => SetMetadata(TEAM_SCOPE_KEY, paramName);
