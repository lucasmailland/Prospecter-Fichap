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
exports.ProspectingActivity = exports.ActivityStatus = exports.ActivityType = void 0;
const typeorm_1 = require("typeorm");
const prospect_entity_1 = require("./prospect.entity");
var ActivityType;
(function (ActivityType) {
    ActivityType["EMAIL"] = "email";
    ActivityType["CALL"] = "call";
    ActivityType["LINKEDIN_MESSAGE"] = "linkedin_message";
    ActivityType["MEETING"] = "meeting";
    ActivityType["FOLLOW_UP"] = "follow_up";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
var ActivityStatus;
(function (ActivityStatus) {
    ActivityStatus["PENDING"] = "pending";
    ActivityStatus["IN_PROGRESS"] = "in_progress";
    ActivityStatus["COMPLETED"] = "completed";
    ActivityStatus["FAILED"] = "failed";
    ActivityStatus["CANCELLED"] = "cancelled";
})(ActivityStatus || (exports.ActivityStatus = ActivityStatus = {}));
let ProspectingActivity = class ProspectingActivity {
    id;
    prospect_id;
    activity_type;
    status;
    scheduled_at;
    completed_at;
    notes;
    created_at;
    updated_at;
    prospect;
};
exports.ProspectingActivity = ProspectingActivity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProspectingActivity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'prospect_id' }),
    __metadata("design:type", Number)
], ProspectingActivity.prototype, "prospect_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ActivityType,
    }),
    __metadata("design:type", String)
], ProspectingActivity.prototype, "activity_type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ActivityStatus,
        default: ActivityStatus.PENDING,
    }),
    __metadata("design:type", String)
], ProspectingActivity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ProspectingActivity.prototype, "scheduled_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], ProspectingActivity.prototype, "completed_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProspectingActivity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProspectingActivity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ProspectingActivity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => prospect_entity_1.Prospect, prospect => prospect.activities, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'prospect_id' }),
    __metadata("design:type", prospect_entity_1.Prospect)
], ProspectingActivity.prototype, "prospect", void 0);
exports.ProspectingActivity = ProspectingActivity = __decorate([
    (0, typeorm_1.Entity)('prospecting_activities')
], ProspectingActivity);
//# sourceMappingURL=prospecting-activity.entity.js.map