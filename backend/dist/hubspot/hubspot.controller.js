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
exports.HubspotController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hubspot_service_1 = require("./hubspot.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let HubspotController = class HubspotController {
    constructor(hubspotService) {
        this.hubspotService = hubspotService;
    }
    async getContacts() {
        return this.hubspotService.getContacts();
    }
    async syncContacts() {
        return this.hubspotService.syncContacts();
    }
};
exports.HubspotController = HubspotController;
__decorate([
    (0, common_1.Get)('contacts'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener contactos de HubSpot' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contactos obtenidos exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HubspotController.prototype, "getContacts", null);
__decorate([
    (0, common_1.Post)('sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Sincronizar con HubSpot' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sincronización iniciada' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HubspotController.prototype, "syncContacts", null);
exports.HubspotController = HubspotController = __decorate([
    (0, swagger_1.ApiTags)('hubspot'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('hubspot'),
    __metadata("design:paramtypes", [hubspot_service_1.HubspotService])
], HubspotController);
//# sourceMappingURL=hubspot.controller.js.map