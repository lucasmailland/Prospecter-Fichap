import { PrismaService } from '@/common/database/prisma.service';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        lead: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            company: string;
        };
        assignedTo: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        description: string | null;
        type: import(".prisma/client").$Enums.TaskType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        timezone: string;
        priority: import(".prisma/client").$Enums.TaskPriority;
        status: import(".prisma/client").$Enums.TaskStatus;
        leadId: string | null;
        syncedAt: Date | null;
        subject: string;
        category: import(".prisma/client").$Enums.TaskCategory;
        scheduledDate: Date | null;
        scheduledTime: string | null;
        estimatedDuration: number;
        aiGeneratedEmail: string | null;
        aiGeneratedScript: string | null;
        aiGeneratedComment: string | null;
        aiConfidenceScore: number;
        customMessage: string | null;
        customNotes: string | null;
        contactEmail: string;
        contactName: string | null;
        companyName: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectedReason: string | null;
        hubspotTaskId: string | null;
        syncedToHubspot: boolean;
        syncError: string | null;
        completed: boolean;
        completedAt: Date | null;
        outcome: import(".prisma/client").$Enums.TaskOutcome | null;
        responseReceived: boolean;
        responseTime: number | null;
        conversionValue: number | null;
        successProbability: number;
        bestContactDay: string | null;
        bestContactTime: string | null;
        personalityInsights: import("@prisma/client/runtime/library").JsonValue | null;
        templateId: string | null;
        leadId2: string | null;
        assignedToId: string;
        parentTaskId: string | null;
        abTestGroup: string | null;
        abTestId: string | null;
    })[]>;
    create(taskData: any): Promise<{
        lead: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            company: string;
        };
        assignedTo: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        description: string | null;
        type: import(".prisma/client").$Enums.TaskType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        timezone: string;
        priority: import(".prisma/client").$Enums.TaskPriority;
        status: import(".prisma/client").$Enums.TaskStatus;
        leadId: string | null;
        syncedAt: Date | null;
        subject: string;
        category: import(".prisma/client").$Enums.TaskCategory;
        scheduledDate: Date | null;
        scheduledTime: string | null;
        estimatedDuration: number;
        aiGeneratedEmail: string | null;
        aiGeneratedScript: string | null;
        aiGeneratedComment: string | null;
        aiConfidenceScore: number;
        customMessage: string | null;
        customNotes: string | null;
        contactEmail: string;
        contactName: string | null;
        companyName: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectedReason: string | null;
        hubspotTaskId: string | null;
        syncedToHubspot: boolean;
        syncError: string | null;
        completed: boolean;
        completedAt: Date | null;
        outcome: import(".prisma/client").$Enums.TaskOutcome | null;
        responseReceived: boolean;
        responseTime: number | null;
        conversionValue: number | null;
        successProbability: number;
        bestContactDay: string | null;
        bestContactTime: string | null;
        personalityInsights: import("@prisma/client/runtime/library").JsonValue | null;
        templateId: string | null;
        leadId2: string | null;
        assignedToId: string;
        parentTaskId: string | null;
        abTestGroup: string | null;
        abTestId: string | null;
    }>;
}
