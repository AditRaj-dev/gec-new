export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RefreshDto {
    refreshToken?: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
