import { Prospect } from './prospect.entity';
export declare enum ActivityType {
    EMAIL = "email",
    CALL = "call",
    LINKEDIN_MESSAGE = "linkedin_message",
    MEETING = "meeting",
    FOLLOW_UP = "follow_up"
}
export declare enum ActivityStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare class ProspectingActivity {
    id: number;
    prospect_id: number;
    activity_type: ActivityType;
    status: ActivityStatus;
    scheduled_at: Date;
    completed_at: Date;
    notes: string;
    created_at: Date;
    updated_at: Date;
    prospect: Prospect;
}
