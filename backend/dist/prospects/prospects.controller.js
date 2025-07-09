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
exports.ProspectsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prospects_service_1 = require("./prospects.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ProspectsController = class ProspectsController {
    constructor(prospectsService) {
        this.prospectsService = prospectsService;
    }
    async findAll() {
        return this.prospectsService.findAll();
    }
    async findById(id) {
        return this.prospectsService.findById(id);
    }
    async create(leadData) {
        return this.prospectsService.create(leadData);
    }
    async update(id, leadData) {
        return this.prospectsService.update(id, leadData);
    }
    async delete(id) {
        await this.prospectsService.delete(id);
    }
    async bulkCreate(leads) {
        return this.prospectsService.bulkCreate(leads);
    }
};
exports.ProspectsController = ProspectsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los prospectos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de prospectos obtenida exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProspectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener prospecto por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prospecto obtenido exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prospecto no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProspectsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nuevo prospecto' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Prospecto creado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProspectsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar prospecto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prospecto actualizado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prospecto no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProspectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar prospecto' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Prospecto eliminado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Prospecto no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProspectsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear múltiples prospectos' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Prospectos creados exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ProspectsController.prototype, "bulkCreate", null);
exports.ProspectsController = ProspectsController = __decorate([
    (0, swagger_1.ApiTags)('prospects'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('prospects'),
    __metadata("design:paramtypes", [prospects_service_1.ProspectsService])
], ProspectsController);
//# sourceMappingURL=prospects.controller.js.map