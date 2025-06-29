import { Cache } from 'cache-manager';
export declare class CacheService {
    private cacheManager;
    constructor(cacheManager: Cache);
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: any, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    reset(): Promise<void>;
    getProspect(id: number): Promise<unknown>;
    setProspect(id: number, prospect: any, ttl?: number): Promise<void>;
    invalidateProspect(id: number): Promise<void>;
    getProspectsList(page: number, limit: number): Promise<unknown>;
    setProspectsList(page: number, limit: number, data: any, ttl?: number): Promise<void>;
    getProspectsStats(): Promise<unknown>;
    setProspectsStats(stats: any, ttl?: number): Promise<void>;
    invalidateProspectsCache(): Promise<void>;
}
