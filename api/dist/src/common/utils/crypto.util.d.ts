export declare class CryptoUtil {
    static hashPassword(password: string): Promise<string>;
    static verifyPassword(hash: string, plain: string): Promise<boolean>;
    static sha256(data: string | Buffer): string;
    static hmacSha256(secret: string, data: string): string;
    static randomToken(bytes?: number): string;
    static safeEqual(a: string, b: string): boolean;
}
