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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProspectsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prospect_dto_1 = require("../../application/dto/prospect.dto");
const create_prospect_handler_1 = require("../../application/handlers/create-prospect.handler");
const get_prospects_handler_1 = require("../../application/handlers/get-prospects.handler");
const common_2 = require("@nestjs/common");
const logger_service_1 = require("../../infrastructure/performance/logger.service");
const nestjs_otel_1 = require("nestjs-otel");
const metrics_service_1 = require("../../infrastructure/monitoring/metrics.service");
const metrics_interceptor_1 = require("../../infrastructure/monitoring/metrics.interceptor");
let ProspectsController = class ProspectsController {
    createProspectHandler;
    getProspectsHandler;
    prospectRepository;
    logger;
    traceService;
    metricsService;
    constructor(createProspectHandler, getProspectsHandler, prospectRepository, logger, traceService, metricsService) {
        this.createProspectHandler = createProspectHandler;
        this.getProspectsHandler = getProspectsHandler;
        this.prospectRepository = prospectRepository;
        this.logger = logger;
        this.traceService = traceService;
        this.metricsService = metricsService;
    }
    async create(createProspectDto) {
        this.logger.log('Creando nuevo prospecto', { email: createProspectDto.email });
        const span = this.traceService.getSpan();
        if (span) {
            span.setAttribute('prospect.email', createProspectDto.email || '');
        }
        try {
            const result = await this.createProspectHandler.execute(createProspectDto);
            this.metricsService.recordProspectCreated('success');
            return result;
        }
        catch (error) {
            this.metricsService.recordProspectCreated('error');
            throw error;
        }
    }
    async findAll(page = 1, limit = 10) {
        this.logger.debug('Listando prospectos', { page, limit });
        const span = this.traceService.getSpan();
        if (span) {
            span.setAttribute('pagination.page', page);
            span.setAttribute('pagination.limit', limit);
        }
        return await this.getProspectsHandler.execute(page, limit);
    }
    async getStats() {
        const stats = await this.prospectRepository.getStats();
        if (stats.total) {
            this.metricsService.setActiveProspectsCount(stats.total);
        }
        return stats;
    }
    async findOne(id) {
        const prospect = await this.prospectRepository.findById(id);
        if (!prospect) {
            throw new Error(`Prospect with id ${id} not found`);
        }
        return prospect;
    }
    async update(id, updateProspectDto) {
        try {
            const prospect = await this.prospectRepository.update(id, updateProspectDto);
            if (!prospect) {
                throw new Error(`Prospect with id ${id} not found`);
            }
            this.metricsService.recordProspectUpdated('success');
            return prospect;
        }
        catch (error) {
            this.metricsService.recordProspectUpdated('error');
            throw error;
        }
    }
    async remove(id) {
        try {
            const deleted = await this.prospectRepository.delete(id);
            if (!deleted) {
                throw new Error(`Prospect with id ${id} not found`);
            }
            this.metricsService.recordProspectDeleted('success');
        }
        catch (error) {
            this.metricsService.recordProspectDeleted('error');
            throw error;
        }
    }
};
exports.ProspectsController = ProspectsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new prospect' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Prospect created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid data',
    }),
    (0, nestjs_otel_1.Span)('create_prospect'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [prospect_dto_1.CreateProspectDto]),
    __metadata("design:returntype", Promise)
], ProspectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all prospects with pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Prospects retrieved successfully',
    }),
    (0, nestjs_otel_1.Span)('list_prospects'),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProspectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get prospects statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Statistics retrieved successfully',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProspectsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a prospect by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Prospect retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Prospect not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProspectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a prospect' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Prospect updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Prospect not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ProspectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a prospect' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Prospect deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Prospect not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProspectsController.prototype, "remove", null);
exports.ProspectsController = ProspectsController = __decorate([
    (0, swagger_1.ApiTags)('Prospects'),
    (0, common_1.Controller)('prospects'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, common_1.UseInterceptors)(metrics_interceptor_1.MetricsInterceptor),
    __param(2, (0, common_2.Inject)('PROSPECT_REPOSITORY')),
    __metadata("design:paramtypes", [create_prospect_handler_1.CreateProspectHandler,
        get_prospects_handler_1.GetProspectsHandler, Object, logger_service_1.AppLogger, typeof (_a = typeof nestjs_otel_1.TraceService !== "undefined" && nestjs_otel_1.TraceService) === "function" ? _a : Object, metrics_service_1.MetricsService])
], ProspectsController);
//# sourceMappingURL=prospects.controller.js.map