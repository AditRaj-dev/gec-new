"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoUtil = void 0;
const crypto = require("crypto");
const argon2 = require("argon2");
class CryptoUtil {
    static async hashPassword(password) {
        return argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 1,
        });
    }
    static async verifyPassword(hash, plain) {
        try {
            return await argon2.verify(hash, plain);
        }
        catch {
            return false;
        }
    }
    static sha256(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }
    static hmacSha256(secret, data) {
        return crypto.createHmac('sha256', secret).update(data).digest('hex');
    }
    static randomToken(bytes = 32) {
        return crypto.randomBytes(bytes).toString('hex');
    }
    static safeEqual(a, b) {
        if (a.length !== b.length)
            return false;
        return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
    }
}
exports.CryptoUtil = CryptoUtil;
//# sourceMappingURL=crypto.util.js.map