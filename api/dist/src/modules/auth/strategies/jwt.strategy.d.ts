import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { CoreDatabaseService } from '../../../database/core-database.service';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private coreDb;
    constructor(configService: ConfigService, coreDb: CoreDatabaseService);
    validate(payload: any): Promise<AuthenticatedUser>;
}
export {};
