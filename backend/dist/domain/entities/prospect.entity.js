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
exports.Prospect = exports.ProspectStatus = void 0;
const typeorm_1 = require("typeorm");
const prospecting_activity_entity_1 = require("./prospecting-activity.entity");
const campaign_prospect_entity_1 = require("./campaign-prospect.entity");
var ProspectStatus;
(function (ProspectStatus) {
    ProspectStatus["NEW"] = "new";
    ProspectStatus["CONTACTED"] = "contacted";
    ProspectStatus["INTERESTED"] = "interested";
    ProspectStatus["QUALIFIED"] = "qualified";
    ProspectStatus["CONVERTED"] = "converted";
    ProspectStatus["LOST"] = "lost";
})(ProspectStatus || (exports.ProspectStatus = ProspectStatus = {}));
let Prospect = class Prospect {
    id;
    name;
    email;
    phone;
    company;
    position;
    linkedin_url;
    website;
    industry;
    status;
    source;
    notes;
    hubspot_id;
    created_at;
    updated_at;
    activities;
    campaignProspects;
};
exports.Prospect = Prospect;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Prospect.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Prospect.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true, nullable: true }),
    __metadata("design:type", String)
], Prospect.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Prospect.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Prospect.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Prospect.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Prospect.prototype, "linkedin_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Prospect.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Prospect.prototype, "industry", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProspectStatus,
        default: ProspectStatus.NEW,
    }),
    __metadata("design:type", String)
], Prospect.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Prospect.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Prospect.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Prospect.prototype, "hubspot_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Prospect.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Prospect.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => prospecting_activity_entity_1.ProspectingActivity, activity => activity.prospect),
    __metadata("design:type", Array)
], Prospect.prototype, "activities", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => campaign_prospect_entity_1.CampaignProspect, cp => cp.prospect),
    __metadata("design:type", Array)
], Prospect.prototype, "campaignProspects", void 0);
exports.Prospect = Prospect = __decorate([
    (0, typeorm_1.Entity)('prospects')
], Prospect);
//# sourceMappingURL=prospect.entity.js.map