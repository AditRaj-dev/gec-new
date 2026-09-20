import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CoreDatabaseService } from '../../database/core-database.service';
import { LoginDto, ResetPasswordDto } from './dto/auth.dto';
export declare class AuthService {
    private coreDb;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(coreDb: CoreDatabaseService, jwtService: JwtService, configService: ConfigService);
    login(loginDto: LoginDto, ip?: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
            teamScope: any;
            permissions: import("../../common/constants/roles.enum").Permission[];
        };
    }>;
    refresh(refreshToken: string, ip?: string, userAgent?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        devToken?: string;
        success: boolean;
        message: string;
    }>;
    resetPassword(resetDto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    private generateAccessToken;
}
