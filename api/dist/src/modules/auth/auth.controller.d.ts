import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, req: Request, res: Response): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
            teamScope: any;
            permissions: import("../../common/constants/roles.enum").Permission[];
        };
    }>;
    refresh(refreshDto: RefreshDto, req: Request, res: Response): Promise<{
        accessToken: string;
    }>;
    logout(req: Request, res: Response): Promise<{
        success: boolean;
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        devToken?: string;
        success: boolean;
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getMe(user: AuthenticatedUser): Promise<AuthenticatedUser>;
}
