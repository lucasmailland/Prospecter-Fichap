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
exports.CampaignProspect = void 0;
const typeorm_1 = require("typeorm");
const campaign_entity_1 = require("./campaign.entity");
const prospect_entity_1 = require("./prospect.entity");
let CampaignProspect = class CampaignProspect {
    id;
    campaign_id;
    prospect_id;
    added_at;
    campaign;
    prospect;
};
exports.CampaignProspect = CampaignProspect;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CampaignProspect.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'campaign_id' }),
    __metadata("design:type", Number)
], CampaignProspect.prototype, "campaign_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'prospect_id' }),
    __metadata("design:type", Number)
], CampaignProspect.prototype, "prospect_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CampaignProspect.prototype, "added_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => campaign_entity_1.Campaign, campaign => campaign.campaignProspects, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'campaign_id' }),
    __metadata("design:type", campaign_entity_1.Campaign)
], CampaignProspect.prototype, "campaign", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => prospect_entity_1.Prospect, prospect => prospect.campaignProspects, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'prospect_id' }),
    __metadata("design:type", prospect_entity_1.Prospect)
], CampaignProspect.prototype, "prospect", void 0);
exports.CampaignProspect = CampaignProspect = __decorate([
    (0, typeorm_1.Entity)('campaign_prospects')
], CampaignProspect);
//# sourceMappingURL=campaign-prospect.entity.js.map