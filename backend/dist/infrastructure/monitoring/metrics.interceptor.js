"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const metrics_service_1 = require("./metrics.service");
let MetricsInterceptor = class MetricsInterceptor {
    metricsService;
    constructor(metricsService) {
        this.metricsService = metricsService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const startTime = Date.now();
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = (Date.now() - startTime) / 1000;
            const method = request.method;
            const path = request.route?.path || request.path;
            const statusCode = response.statusCode;
            this.metricsService.recordHttpRequest(method, path, statusCode, duration);
            this.updateSystemMetrics();
        }));
    }
    updateSystemMetrics() {
        const memoryUsage = process.memoryUsage();
        this.metricsService.setMemoryUsage(memoryUsage.heapUsed);
        const cpuUsage = process.cpuUsage();
        const totalCpuTime = cpuUsage.user + cpuUsage.system;
        const cpuPercent = (totalCpuTime / 1000000) * 100;
        this.metricsService.setCpuUsage(cpuPercent);
    }
};
exports.MetricsInterceptor = MetricsInterceptor;
exports.MetricsInterceptor = MetricsInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [metrics_service_1.MetricsService])
], MetricsInterceptor);
//# sourceMappingURL=metrics.interceptor.js.map