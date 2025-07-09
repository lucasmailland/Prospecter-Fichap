export declare class TwoFactorService {
    generateSecret(email: string): {
        secret: string;
        otpauth_url: string;
    };
    generateQRCode(otpauth_url: string): Promise<string>;
    verifyToken(token: string, secret: string): boolean;
}
