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
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_2 = require("cache-manager");
let CacheService = class CacheService {
    cacheManager;
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
    }
    async get(key) {
        const value = await this.cacheManager.get(key);
        return value || null;
    }
    async set(key, value, ttl) {
        await this.cacheManager.set(key, value, ttl);
    }
    async del(key) {
        await this.cacheManager.del(key);
    }
    async reset() {
        try {
            await this.invalidateProspectsCache();
        }
        catch (error) {
            console.warn('Could not reset cache:', error);
        }
    }
    async getProspect(id) {
        return await this.get(`prospect:${id}`);
    }
    async setProspect(id, prospect, ttl = 300) {
        await this.set(`prospect:${id}`, prospect, ttl);
    }
    async invalidateProspect(id) {
        await this.del(`prospect:${id}`);
        await this.del('prospects:list');
        await this.del('prospects:stats');
    }
    async getProspectsList(page, limit) {
        return await this.get(`prospects:list:${page}:${limit}`);
    }
    async setProspectsList(page, limit, data, ttl = 300) {
        await this.set(`prospects:list:${page}:${limit}`, data, ttl);
    }
    async getProspectsStats() {
        return await this.get('prospects:stats');
    }
    async setProspectsStats(stats, ttl = 600) {
        await this.set('prospects:stats', stats, ttl);
    }
    async invalidateProspectsCache() {
        for (let page = 1; page <= 10; page++) {
            for (let limit = 10; limit <= 50; limit += 10) {
                await this.del(`prospects:list:${page}:${limit}`);
            }
        }
        await this.del('prospects:stats');
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeof (_a = typeof cache_manager_2.Cache !== "undefined" && cache_manager_2.Cache) === "function" ? _a : Object])
], CacheService);
//# sourceMappingURL=cache.service.js.map