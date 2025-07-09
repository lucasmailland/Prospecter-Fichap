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
exports.ProspectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/database/prisma.service");
let ProspectsService = class ProspectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.lead.findMany({
            include: {
                hubspotContact: true,
                leadScores: true,
                conversationAnalyses: true,
            },
        });
    }
    async findById(id) {
        return this.prisma.lead.findUnique({
            where: { id },
            include: {
                hubspotContact: true,
                leadScores: true,
                conversationAnalyses: true,
            },
        });
    }
    async create(leadData) {
        return this.prisma.lead.create({
            data: leadData,
            include: {
                hubspotContact: true,
                leadScores: true,
                conversationAnalyses: true,
            },
        });
    }
    async update(id, leadData) {
        return this.prisma.lead.update({
            where: { id },
            data: leadData,
            include: {
                hubspotContact: true,
                leadScores: true,
                conversationAnalyses: true,
            },
        });
    }
    async delete(id) {
        await this.prisma.lead.delete({
            where: { id },
        });
    }
    async bulkCreate(leads) {
        return this.prisma.lead.createMany({
            data: leads,
        });
    }
};
exports.ProspectsService = ProspectsService;
exports.ProspectsService = ProspectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProspectsService);
//# sourceMappingURL=prospects.service.js.map