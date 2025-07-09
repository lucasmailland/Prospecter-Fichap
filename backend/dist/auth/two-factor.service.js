"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorService = void 0;
const common_1 = require("@nestjs/common");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
let TwoFactorService = class TwoFactorService {
    generateSecret(email) {
        const secret = speakeasy.generateSecret({
            name: `Prospecter-Fichap (${email})`,
            issuer: 'Prospecter-Fichap',
        });
        return {
            secret: secret.base32,
            otpauth_url: secret.otpauth_url,
        };
    }
    async generateQRCode(otpauth_url) {
        return QRCode.toDataURL(otpauth_url);
    }
    verifyToken(token, secret) {
        return speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 2,
        });
    }
};
exports.TwoFactorService = TwoFactorService;
exports.TwoFactorService = TwoFactorService = __decorate([
    (0, common_1.Injectable)()
], TwoFactorService);
//# sourceMappingURL=two-factor.service.js.map