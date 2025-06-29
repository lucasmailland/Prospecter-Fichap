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
exports.CreateProspectHandler = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
let CreateProspectHandler = class CreateProspectHandler {
    prospectRepository;
    constructor(prospectRepository) {
        this.prospectRepository = prospectRepository;
    }
    async execute(createProspectDto) {
        return await this.prospectRepository.create(createProspectDto);
    }
};
exports.CreateProspectHandler = CreateProspectHandler;
exports.CreateProspectHandler = CreateProspectHandler = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('PROSPECT_REPOSITORY')),
    __metadata("design:paramtypes", [Object])
], CreateProspectHandler);
//# sourceMappingURL=create-prospect.handler.js.map