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
exports.ProspectRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const prospect_entity_1 = require("../../../domain/entities/prospect.entity");
const cache_service_1 = require("../../cache/cache.service");
const logger_service_1 = require("../../performance/logger.service");
const tracing_service_1 = require("../../tracing/tracing.service");
let ProspectRepository = class ProspectRepository {
    prospectRepository;
    cacheService;
    logger;
    tracingService;
    constructor(prospectRepository, cacheService, logger, tracingService) {
        this.prospectRepository = prospectRepository;
        this.cacheService = cacheService;
        this.logger = logger;
        this.tracingService = tracingService;
    }
    async create(prospect) {
        return await this.tracingService.executeInSpan('prospect_repository.create', async () => {
            const span = this.tracingService.createProspectSpan('create');
            try {
                const newProspect = this.prospectRepository.create({
                    ...prospect,
                    status: prospect_entity_1.ProspectStatus.NEW,
                });
                const savedProspect = await this.prospectRepository.save(newProspect);
                await this.cacheService.del('prospects:all');
                await this.cacheService.del('prospects:stats');
                this.logger.log(`Prospect successfully created: ${savedProspect.id}`);
                span.setAttribute('prospect.id', savedProspect.id);
                this.tracingService.markSuccess();
                return savedProspect;
            }
            catch (error) {
                this.tracingService.markError(error);
                this.logger.error(`Error al crear prospecto: ${error.message}`);
                throw error;
            }
            finally {
                span.end();
            }
        }, { 'db.operation': 'create', 'db.table': 'prospects' });
    }
    async findById(id) {
        return await this.tracingService.executeInSpan('prospect_repository.find_by_id', async () => {
            const span = this.tracingService.createProspectSpan('find_by_id', id);
            try {
                const cacheKey = `prospect:${id}`;
                const cached = await this.cacheService.get(cacheKey);
                if (cached && typeof cached === 'string') {
                    this.logger.debug(`Prospect retrieved from cache: ${id}`);
                    span.setAttribute('cache.hit', true);
                    this.tracingService.markSuccess();
                    return JSON.parse(cached);
                }
                const prospect = await this.prospectRepository.findOne({ where: { id } });
                if (prospect) {
                    await this.cacheService.set(cacheKey, JSON.stringify(prospect), 600);
                }
                this.logger.debug(`Prospect retrieved from database: ${id}, found: ${!!prospect}`);
                span.setAttribute('prospect.found', !!prospect);
                span.setAttribute('cache.hit', false);
                this.tracingService.markSuccess();
                return prospect;
            }
            catch (error) {
                this.tracingService.markError(error);
                this.logger.error(`Error retrieving prospect by ID ${id}: ${error.message}`);
                throw error;
            }
            finally {
                span.end();
            }
        }, { 'db.operation': 'select', 'db.table': 'prospects' });
    }
    async findAll(page = 1, limit = 10) {
        return await this.tracingService.executeInSpan('prospect_repository.find_all', async () => {
            const span = this.tracingService.createProspectSpan('find_all');
            try {
                const cacheKey = `prospects:page:${page}:limit:${limit}`;
                const cached = await this.cacheService.get(cacheKey);
                if (cached && typeof cached === 'string') {
                    this.logger.debug(`Prospects retrieved from cache: page ${page}, limit ${limit}`);
                    span.setAttribute('cache.hit', true);
                    this.tracingService.markSuccess();
                    return JSON.parse(cached);
                }
                const offset = (page - 1) * limit;
                const [data, total] = await this.prospectRepository.findAndCount({
                    skip: offset,
                    take: limit,
                    order: { created_at: 'DESC' },
                });
                const result = {
                    data,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                };
                await this.cacheService.set(cacheKey, JSON.stringify(result), 300);
                this.logger.debug(`Prospects retrieved from database: page ${page}, limit ${limit}, total ${total}, count ${data.length}`);
                span.setAttribute('prospects.count', data.length);
                span.setAttribute('prospects.total', total);
                span.setAttribute('cache.hit', false);
                this.tracingService.markSuccess();
                return result;
            }
            catch (error) {
                this.tracingService.markError(error);
                this.logger.error(`Error retrieving prospects: page ${page}, limit ${limit}, error: ${error.message}`);
                throw error;
            }
            finally {
                span.end();
            }
        }, { 'db.operation': 'select', 'db.table': 'prospects' });
    }
    async update(id, updateData) {
        return await this.tracingService.executeInSpan('prospect_repository.update', async () => {
            const span = this.tracingService.createProspectSpan('update', id);
            try {
                const result = await this.prospectRepository.update(id, updateData);
                if (result.affected === 0) {
                    this.logger.warn(`Prospect not found for update: ${id}`);
                    span.setAttribute('prospect.updated', false);
                    this.tracingService.markSuccess();
                    return null;
                }
                await this.cacheService.del(`prospect:${id}`);
                await this.cacheService.del('prospects:all');
                await this.cacheService.del('prospects:stats');
                const updatedProspect = await this.prospectRepository.findOne({ where: { id } });
                this.logger.log(`Prospect successfully updated: ${id}, updated fields: ${Object.keys(updateData).join(', ')}`);
                span.setAttribute('prospect.updated', true);
                span.setAttribute('prospect.updated_fields', Object.keys(updateData).join(','));
                this.tracingService.markSuccess();
                return updatedProspect;
            }
            catch (error) {
                this.tracingService.markError(error);
                this.logger.error(`Error updating prospect ${id}: ${error.message}`);
                throw error;
            }
            finally {
                span.end();
            }
        }, { 'db.operation': 'update', 'db.table': 'prospects' });
    }
    async delete(id) {
        return await this.tracingService.executeInSpan('prospect_repository.delete', async () => {
            const span = this.tracingService.createProspectSpan('delete', id);
            try {
                const result = await this.prospectRepository.delete(id);
                if (result.affected === 0) {
                    this.logger.warn(`Prospect not found for deletion: ${id}`);
                    span.setAttribute('prospect.deleted', false);
                    this.tracingService.markSuccess();
                    return false;
                }
                await this.cacheService.del(`prospect:${id}`);
                await this.cacheService.del('prospects:all');
                await this.cacheService.del('prospects:stats');
                this.logger.log(`Prospect successfully deleted: ${id}`);
                span.setAttribute('prospect.deleted', true);
                this.tracingService.markSuccess();
                return true;
            }
            catch (error) {
                this.tracingService.markError(error);
                this.logger.error(`Error deleting prospect ${id}: ${error.message}`);
                throw error;
            }
            finally {
                span.end();
            }
        }, { 'db.operation': 'delete', 'db.table': 'prospects' });
    }
    async findByEmail(email) {
        return await this.prospectRepository.findOne({ where: { email } });
    }
    async findByCompany(company) {
        return await this.prospectRepository.find({ where: { company } });
    }
    async findByStatus(status) {
        return await this.prospectRepository.find({ where: { status } });
    }
    async findByIndustry(industry) {
        return await this.prospectRepository.find({ where: { industry } });
    }
    async findWithPagination(page, limit) {
        const [data, total] = await this.prospectRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { created_at: 'DESC' },
        });
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async search(query) {
        return await this.prospectRepository.find({
            where: [
                { name: (0, typeorm_2.Like)(`%${query}%`) },
                { email: (0, typeorm_2.Like)(`%${query}%`) },
                { company: (0, typeorm_2.Like)(`%${query}%`) },
                { industry: (0, typeorm_2.Like)(`%${query}%`) },
            ],
        });
    }
    async findByFilters(filters) {
        const whereConditions = {};
        if (filters.status)
            whereConditions.status = filters.status;
        if (filters.industry)
            whereConditions.industry = filters.industry;
        if (filters.company)
            whereConditions.company = filters.company;
        const queryBuilder = this.prospectRepository.createQueryBuilder('prospect');
        if (Object.keys(whereConditions).length > 0) {
            queryBuilder.where(whereConditions);
        }
        if (filters.createdAfter) {
            queryBuilder.andWhere('prospect.created_at >= :createdAfter', { createdAfter: filters.createdAfter });
        }
        if (filters.createdBefore) {
            queryBuilder.andWhere('prospect.created_at <= :createdBefore', { createdBefore: filters.createdBefore });
        }
        return await queryBuilder.getMany();
    }
    async getStats() {
        return await this.tracingService.executeInSpan('prospect_repository.get_stats', async () => {
            const span = this.tracingService.createProspectSpan('get_stats');
            try {
                const cacheKey = 'prospects:stats';
                const cached = await this.cacheService.get(cacheKey);
                if (cached && typeof cached === 'string') {
                    this.logger.debug('Estadísticas obtenidas del cache');
                    span.setAttribute('cache.hit', true);
                    this.tracingService.markSuccess();
                    return JSON.parse(cached);
                }
                const total = await this.prospectRepository.count();
                const statusCounts = await this.prospectRepository
                    .createQueryBuilder('prospect')
                    .select('prospect.status', 'status')
                    .addSelect('COUNT(*)', 'count')
                    .groupBy('prospect.status')
                    .getRawMany();
                const byStatus = Object.values(prospect_entity_1.ProspectStatus).reduce((acc, status) => {
                    acc[status] = 0;
                    return acc;
                }, {});
                statusCounts.forEach(({ status, count }) => {
                    byStatus[status] = parseInt(count);
                });
                const industryCounts = await this.prospectRepository
                    .createQueryBuilder('prospect')
                    .select('prospect.industry', 'industry')
                    .addSelect('COUNT(*)', 'count')
                    .groupBy('prospect.industry')
                    .getRawMany();
                const byIndustry = industryCounts.reduce((acc, { industry, count }) => {
                    acc[industry] = parseInt(count);
                    return acc;
                }, {});
                const convertedCount = await this.prospectRepository.count({
                    where: { status: prospect_entity_1.ProspectStatus.CONVERTED },
                });
                const conversionRate = total > 0 ? (convertedCount / total) * 100 : 0;
                const stats = { total, byStatus, byIndustry, conversionRate };
                await this.cacheService.set(cacheKey, JSON.stringify(stats), 300);
                this.logger.debug(`Estadísticas obtenidas de la base de datos: total ${total}, conversión ${conversionRate}%`);
                span.setAttribute('stats.total', total);
                span.setAttribute('stats.statuses', Object.keys(byStatus).join(','));
                span.setAttribute('cache.hit', false);
                this.tracingService.markSuccess();
                return stats;
            }
            catch (error) {
                this.tracingService.markError(error);
                this.logger.error(`Error al obtener estadísticas: ${error.message}`);
                throw error;
            }
            finally {
                span.end();
            }
        }, { 'db.operation': 'select', 'db.table': 'prospects' });
    }
};
exports.ProspectRepository = ProspectRepository;
exports.ProspectRepository = ProspectRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(prospect_entity_1.Prospect)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cache_service_1.CacheService,
        logger_service_1.AppLogger,
        tracing_service_1.TracingService])
], ProspectRepository);
//# sourceMappingURL=prospect.repository.js.map