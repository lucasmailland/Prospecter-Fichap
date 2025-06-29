"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompressionInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const compression = require("compression");
let CompressionInterceptor = class CompressionInterceptor {
    compression = compression({
        filter: (req, res) => {
            if (req.headers['x-no-compression']) {
                return false;
            }
            return compression.filter(req, res);
        },
        level: 6,
        threshold: 1024,
    });
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return new rxjs_1.Observable(observer => {
            this.compression(request, response, () => {
                next.handle().subscribe({
                    next: (data) => {
                        observer.next(data);
                        observer.complete();
                    },
                    error: (error) => {
                        observer.error(error);
                    },
                });
            });
        });
    }
};
exports.CompressionInterceptor = CompressionInterceptor;
exports.CompressionInterceptor = CompressionInterceptor = __decorate([
    (0, common_1.Injectable)()
], CompressionInterceptor);
//# sourceMappingURL=compression.interceptor.js.map