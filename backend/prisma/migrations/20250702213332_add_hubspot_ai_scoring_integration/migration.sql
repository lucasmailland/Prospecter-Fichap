-- CreateTable
CREATE TABLE "hubspot_contacts" (
    "id" TEXT NOT NULL,
    "hubspotId" TEXT NOT NULL,
    "leadId" TEXT,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "company" TEXT,
    "jobTitle" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "linkedinUrl" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "industry" TEXT,
    "numEmployees" TEXT,
    "annualRevenue" TEXT,
    "lifecycleStage" TEXT,
    "leadStatus" TEXT,
    "hsLeadStatus" TEXT,
    "hubspotOwnerId" TEXT,
    "timezone" TEXT,
    "lastActivityDate" TIMESTAMP(3),
    "hubspotCreateDate" TIMESTAMP(3),
    "hubspotModifiedDate" TIMESTAMP(3),
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hubspot_email_metrics" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "emailsSent" INTEGER NOT NULL DEFAULT 0,
    "emailsOpened" INTEGER NOT NULL DEFAULT 0,
    "emailsClicked" INTEGER NOT NULL DEFAULT 0,
    "emailsReplied" INTEGER NOT NULL DEFAULT 0,
    "emailsBounced" INTEGER NOT NULL DEFAULT 0,
    "openRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clickRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "replyRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastEmailDate" TIMESTAMP(3),
    "lastOpenDate" TIMESTAMP(3),
    "lastClickDate" TIMESTAMP(3),
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_email_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hubspot_conversations" (
    "id" TEXT NOT NULL,
    "hubspotId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "htmlContent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "direction" TEXT NOT NULL,
    "emailStatus" TEXT,
    "attachments" TEXT,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hubspot_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hubspot_activities" (
    "id" TEXT NOT NULL,
    "hubspotId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "subject" TEXT,
    "body" TEXT,
    "outcome" TEXT,
    "duration" INTEGER,
    "meetingOutcome" TEXT,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hubspot_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_analyses" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "contactId" TEXT,
    "analysisDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentimentScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sentimentConfidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sentimentTrend" TEXT NOT NULL DEFAULT 'stable',
    "sentimentHistory" TEXT,
    "buyingSignals" INTEGER NOT NULL DEFAULT 0,
    "objections" INTEGER NOT NULL DEFAULT 0,
    "interestLevel" INTEGER NOT NULL DEFAULT 0,
    "urgency" INTEGER NOT NULL DEFAULT 0,
    "budgetMentions" INTEGER NOT NULL DEFAULT 0,
    "authorityIndicators" INTEGER NOT NULL DEFAULT 0,
    "positiveKeywords" TEXT,
    "negativeKeywords" TEXT,
    "technicalKeywords" TEXT,
    "businessKeywords" TEXT,
    "urgencyKeywords" TEXT,
    "budgetKeywords" TEXT,
    "responseTimeAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "messageLengthAvg" INTEGER NOT NULL DEFAULT 0,
    "questionRatio" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "engagementScore" INTEGER NOT NULL DEFAULT 0,
    "conversionProbability" INTEGER NOT NULL DEFAULT 0,
    "optimalFollowupTime" TIMESTAMP(3),
    "recommendedAction" TEXT NOT NULL DEFAULT 'EMAIL',
    "predictionConfidence" INTEGER NOT NULL DEFAULT 0,
    "analysisVersion" TEXT NOT NULL DEFAULT '1.0',
    "processingTimeMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversation_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_scores" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "previousScore" INTEGER,
    "scoreChange" INTEGER NOT NULL DEFAULT 0,
    "confidence" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL DEFAULT 'COLD',
    "icpCompanySize" INTEGER NOT NULL DEFAULT 0,
    "icpIndustry" INTEGER NOT NULL DEFAULT 0,
    "icpRole" INTEGER NOT NULL DEFAULT 0,
    "icpGeography" INTEGER NOT NULL DEFAULT 0,
    "icpTechnology" INTEGER NOT NULL DEFAULT 0,
    "aiBuyingSignals" INTEGER NOT NULL DEFAULT 0,
    "aiInterestLevel" INTEGER NOT NULL DEFAULT 0,
    "aiSentiment" INTEGER NOT NULL DEFAULT 0,
    "aiUrgency" INTEGER NOT NULL DEFAULT 0,
    "aiAuthority" INTEGER NOT NULL DEFAULT 0,
    "emailEngagement" INTEGER NOT NULL DEFAULT 0,
    "activityFrequency" INTEGER NOT NULL DEFAULT 0,
    "responseVelocity" INTEGER NOT NULL DEFAULT 0,
    "contentInteraction" INTEGER NOT NULL DEFAULT 0,
    "meetingAcceptance" INTEGER NOT NULL DEFAULT 0,
    "profileCompleteness" INTEGER NOT NULL DEFAULT 0,
    "dataFreshness" INTEGER NOT NULL DEFAULT 0,
    "contactReachability" INTEGER NOT NULL DEFAULT 0,
    "informationAccuracy" INTEGER NOT NULL DEFAULT 0,
    "recommendedActions" TEXT,
    "scoringNotes" TEXT,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "scoringVersion" TEXT NOT NULL DEFAULT '1.0',
    "processingTimeMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hubspot_sync_status" (
    "id" TEXT NOT NULL,
    "syncType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "recordsProcessed" INTEGER NOT NULL DEFAULT 0,
    "recordsTotal" INTEGER NOT NULL DEFAULT 0,
    "errors" TEXT,
    "progressPercentage" INTEGER NOT NULL DEFAULT 0,
    "syncVersion" TEXT NOT NULL DEFAULT '1.0',
    "triggeredBy" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_sync_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_configuration" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'STRING',
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'GENERAL',
    "isEncrypted" BOOLEAN NOT NULL DEFAULT false,
    "isEditable" BOOLEAN NOT NULL DEFAULT true,
    "validationRegex" TEXT,
    "defaultValue" TEXT,
    "lastModifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_configuration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hubspot_contacts_hubspotId_key" ON "hubspot_contacts"("hubspotId");

-- CreateIndex
CREATE UNIQUE INDEX "hubspot_contacts_leadId_key" ON "hubspot_contacts"("leadId");

-- CreateIndex
CREATE INDEX "hubspot_contacts_hubspotId_idx" ON "hubspot_contacts"("hubspotId");

-- CreateIndex
CREATE INDEX "hubspot_contacts_email_idx" ON "hubspot_contacts"("email");

-- CreateIndex
CREATE INDEX "hubspot_contacts_leadId_idx" ON "hubspot_contacts"("leadId");

-- CreateIndex
CREATE INDEX "hubspot_contacts_syncedAt_idx" ON "hubspot_contacts"("syncedAt");

-- CreateIndex
CREATE UNIQUE INDEX "hubspot_email_metrics_contactId_key" ON "hubspot_email_metrics"("contactId");

-- CreateIndex
CREATE INDEX "hubspot_email_metrics_contactId_idx" ON "hubspot_email_metrics"("contactId");

-- CreateIndex
CREATE INDEX "hubspot_email_metrics_calculatedAt_idx" ON "hubspot_email_metrics"("calculatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "hubspot_conversations_hubspotId_key" ON "hubspot_conversations"("hubspotId");

-- CreateIndex
CREATE INDEX "hubspot_conversations_hubspotId_idx" ON "hubspot_conversations"("hubspotId");

-- CreateIndex
CREATE INDEX "hubspot_conversations_contactId_idx" ON "hubspot_conversations"("contactId");

-- CreateIndex
CREATE INDEX "hubspot_conversations_threadId_idx" ON "hubspot_conversations"("threadId");

-- CreateIndex
CREATE INDEX "hubspot_conversations_timestamp_idx" ON "hubspot_conversations"("timestamp");

-- CreateIndex
CREATE INDEX "hubspot_conversations_direction_idx" ON "hubspot_conversations"("direction");

-- CreateIndex
CREATE UNIQUE INDEX "hubspot_activities_hubspotId_key" ON "hubspot_activities"("hubspotId");

-- CreateIndex
CREATE INDEX "hubspot_activities_hubspotId_idx" ON "hubspot_activities"("hubspotId");

-- CreateIndex
CREATE INDEX "hubspot_activities_contactId_idx" ON "hubspot_activities"("contactId");

-- CreateIndex
CREATE INDEX "hubspot_activities_activityType_idx" ON "hubspot_activities"("activityType");

-- CreateIndex
CREATE INDEX "hubspot_activities_timestamp_idx" ON "hubspot_activities"("timestamp");

-- CreateIndex
CREATE INDEX "conversation_analyses_leadId_idx" ON "conversation_analyses"("leadId");

-- CreateIndex
CREATE INDEX "conversation_analyses_contactId_idx" ON "conversation_analyses"("contactId");

-- CreateIndex
CREATE INDEX "conversation_analyses_analysisDate_idx" ON "conversation_analyses"("analysisDate");

-- CreateIndex
CREATE INDEX "conversation_analyses_conversionProbability_idx" ON "conversation_analyses"("conversionProbability");

-- CreateIndex
CREATE INDEX "conversation_analyses_recommendedAction_idx" ON "conversation_analyses"("recommendedAction");

-- CreateIndex
CREATE INDEX "lead_scores_leadId_idx" ON "lead_scores"("leadId");

-- CreateIndex
CREATE INDEX "lead_scores_totalScore_idx" ON "lead_scores"("totalScore");

-- CreateIndex
CREATE INDEX "lead_scores_category_idx" ON "lead_scores"("category");

-- CreateIndex
CREATE INDEX "lead_scores_calculatedAt_idx" ON "lead_scores"("calculatedAt");

-- CreateIndex
CREATE INDEX "lead_scores_expiresAt_idx" ON "lead_scores"("expiresAt");

-- CreateIndex
CREATE INDEX "hubspot_sync_status_syncType_idx" ON "hubspot_sync_status"("syncType");

-- CreateIndex
CREATE INDEX "hubspot_sync_status_status_idx" ON "hubspot_sync_status"("status");

-- CreateIndex
CREATE INDEX "hubspot_sync_status_startedAt_idx" ON "hubspot_sync_status"("startedAt");

-- CreateIndex
CREATE INDEX "hubspot_sync_status_completedAt_idx" ON "hubspot_sync_status"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "system_configuration_key_key" ON "system_configuration"("key");

-- CreateIndex
CREATE INDEX "system_configuration_key_idx" ON "system_configuration"("key");

-- CreateIndex
CREATE INDEX "system_configuration_category_idx" ON "system_configuration"("category");

-- CreateIndex
CREATE INDEX "leads_hubspotId_idx" ON "leads"("hubspotId");

-- AddForeignKey
ALTER TABLE "hubspot_contacts" ADD CONSTRAINT "hubspot_contacts_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hubspot_email_metrics" ADD CONSTRAINT "hubspot_email_metrics_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "hubspot_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hubspot_conversations" ADD CONSTRAINT "hubspot_conversations_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "hubspot_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hubspot_activities" ADD CONSTRAINT "hubspot_activities_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "hubspot_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_analyses" ADD CONSTRAINT "conversation_analyses_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_scores" ADD CONSTRAINT "lead_scores_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
