export interface AuthenticatedUser {
    id: string;
    email: string;
    fullName: string;
    role: string;
    teamScope?: string;
    permissions: string[];
}
export declare const CurrentUser: (...dataOrPipes: (keyof AuthenticatedUser | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
