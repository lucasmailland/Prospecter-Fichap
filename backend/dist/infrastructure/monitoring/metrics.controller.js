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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const metrics_service_1 = require("./metrics.service");
let MetricsController = class MetricsController {
    metricsService;
    constructor(metricsService) {
        this.metricsService = metricsService;
    }
    async getMetrics(res) {
        const metrics = await this.metricsService.getMetrics();
        res.set('Content-Type', 'text/plain');
        res.send(metrics);
    }
    async getBusinessMetrics() {
        return await this.metricsService.getBusinessMetrics();
    }
    async checkAlerts() {
        const alerts = await this.metricsService.checkAlertThresholds();
        return {
            timestamp: new Date().toISOString(),
            alerts,
            summary: {
                total: alerts.length,
                warnings: alerts.filter(a => a.level === 'warning').length,
                critical: alerts.filter(a => a.level === 'critical').length,
            },
        };
    }
    async getHealthMetrics() {
        const businessMetrics = await this.metricsService.getBusinessMetrics();
        const alerts = await this.metricsService.checkAlertThresholds();
        return {
            timestamp: new Date().toISOString(),
            status: alerts.length === 0 ? 'healthy' : 'degraded',
            business: businessMetrics,
            alerts: {
                count: alerts.length,
                items: alerts,
            },
            system: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                cpu: process.cpuUsage(),
            },
        };
    }
};
exports.MetricsController = MetricsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get Prometheus metrics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Prometheus metrics retrieved successfully',
    }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MetricsController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('business'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get business metrics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Business metrics retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetricsController.prototype, "getBusinessMetrics", null);
__decorate([
    (0, common_1.Get)('alerts'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Check alert thresholds' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Alert status retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetricsController.prototype, "checkAlerts", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed health metrics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Health metrics retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetricsController.prototype, "getHealthMetrics", null);
exports.MetricsController = MetricsController = __decorate([
    (0, swagger_1.ApiTags)('Metrics'),
    (0, common_1.Controller)('metrics'),
    __metadata("design:paramtypes", [metrics_service_1.MetricsService])
], MetricsController);
//# sourceMappingURL=metrics.controller.js.map