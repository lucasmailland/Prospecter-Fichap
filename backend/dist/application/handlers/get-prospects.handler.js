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
exports.GetProspectsHandler = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
let GetProspectsHandler = class GetProspectsHandler {
    prospectRepository;
    constructor(prospectRepository) {
        this.prospectRepository = prospectRepository;
    }
    async execute(page = 1, limit = 10) {
        return await this.prospectRepository.findAll(page, limit);
    }
    async executeById(query) {
        const prospect = await this.prospectRepository.findById(query.id);
        return prospect ? this.toResponseDto(prospect) : null;
    }
    async executeStats(query) {
        return await this.prospectRepository.getStats();
    }
    toResponseDto(prospect) {
        return {
            id: prospect.id,
            name: prospect.name,
            email: prospect.email,
            phone: prospect.phone,
            company: prospect.company,
            position: prospect.position,
            linkedin_url: prospect.linkedin_url,
            website: prospect.website,
            industry: prospect.industry,
            status: prospect.status,
            source: prospect.source,
            notes: prospect.notes,
            hubspot_id: prospect.hubspot_id,
            created_at: prospect.created_at,
            updated_at: prospect.updated_at,
        };
    }
};
exports.GetProspectsHandler = GetProspectsHandler;
exports.GetProspectsHandler = GetProspectsHandler = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('PROSPECT_REPOSITORY')),
    __metadata("design:paramtypes", [Object])
], GetProspectsHandler);
//# sourceMappingURL=get-prospects.handler.js.map