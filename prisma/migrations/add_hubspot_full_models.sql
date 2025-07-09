-- ========================================================================================
-- HUBSPOT FULL INTEGRATION MIGRATION
-- Agrega todos los modelos necesarios para la integración completa de HubSpot
-- ========================================================================================

-- HubSpot Companies
CREATE TABLE "hubspot_companies" (
    "id" TEXT NOT NULL,
    "hubspotId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "industry" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "numEmployees" TEXT,
    "annualRevenue" TEXT,
    "description" TEXT,
    "foundedYear" TEXT,
    "companyType" TEXT,
    "hsLeadStatus" TEXT,
    "lifecycleStage" TEXT,
    "hubspotOwnerId" TEXT,
    "createDate" TIMESTAMP(3),
    "lastModifiedDate" TIMESTAMP(3),
    "linkedinPage" TEXT,
    "twitterHandle" TEXT,
    "facebookPage" TEXT,
    "totalMoneyRaised" TEXT,
    "recentDealAmount" TEXT,
    "recentDealCloseDate" TEXT,
    "numAssociatedContacts" TEXT,
    "numAssociatedDeals" TEXT,
    "daysToClose" TEXT,
    "hsAnalyticsSource" TEXT,
    "customProperties" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_companies_pkey" PRIMARY KEY ("id")
);

-- HubSpot Deals
CREATE TABLE "hubspot_deals" (
    "id" TEXT NOT NULL,
    "hubspotId" TEXT NOT NULL,
    "dealName" TEXT NOT NULL,
    "amount" TEXT,
    "dealStage" TEXT NOT NULL,
    "pipeline" TEXT,
    "closeDate" TIMESTAMP(3),
    "createDate" TIMESTAMP(3),
    "hubspotOwnerId" TEXT,
    "dealCurrencyCode" TEXT,
    "dealType" TEXT,
    "hsAnalyticsSource" TEXT,
    "hsCampaign" TEXT,
    "hsDealStageProbability" TEXT,
    "hsForecastAmount" TEXT,
    "hsForecastProbability" TEXT,
    "hsIsClosed" TEXT,
    "hsIsClosedWon" TEXT,
    "hsNextStep" TEXT,
    "numContactedNotes" TEXT,
    "numNotes" TEXT,
    "numAssociatedContacts" TEXT,
    "description" TEXT,
    "customProperties" JSONB,
    "leadId" TEXT,
    "contactId" TEXT,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_deals_pkey" PRIMARY KEY ("id")
);

-- HubSpot Tasks
CREATE TABLE "hubspot_tasks" (
    "id" TEXT NOT NULL,
    "hubspotId" TEXT NOT NULL,
    "taskSubject" TEXT NOT NULL,
    "taskBody" TEXT,
    "taskStatus" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "taskPriority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "taskType" TEXT NOT NULL DEFAULT 'TODO',
    "timestamp" TIMESTAMP(3) NOT NULL,
    "hubspotOwnerId" TEXT,
    "taskCompletionDate" TIMESTAMP(3),
    "taskIsCompleted" BOOLEAN NOT NULL DEFAULT false,
    "taskDuration" TEXT,
    "taskReminders" TEXT,
    "taskForObjectType" TEXT,
    "taskContactTimezone" TEXT,
    "leadId" TEXT,
    "contactId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_tasks_pkey" PRIMARY KEY ("id")
);

-- HubSpot Emails
CREATE TABLE "hubspot_emails" (
    "id" TEXT NOT NULL,
    "hubspotId" TEXT NOT NULL,
    "emailSubject" TEXT NOT NULL,
    "emailHtml" TEXT,
    "emailText" TEXT,
    "emailDirection" TEXT NOT NULL,
    "emailStatus" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "hubspotOwnerId" TEXT,
    "emailFromEmail" TEXT,
    "emailFromFirstname" TEXT,
    "emailFromLastname" TEXT,
    "emailToEmail" TEXT,
    "emailToFirstname" TEXT,
    "emailToLastname" TEXT,
    "emailCc" TEXT,
    "emailBcc" TEXT,
    "emailReplyTo" TEXT,
    "emailMessageId" TEXT,
    "emailThreadId" TEXT,
    "emailTrackerKey" TEXT,
    "emailOpenCount" TEXT,
    "emailClickCount" TEXT,
    "emailReplyCount" TEXT,
    "emailBounceCount" TEXT,
    "leadId" TEXT,
    "contactId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_emails_pkey" PRIMARY KEY ("id")
);

-- HubSpot Calls
CREATE TABLE "hubspot_calls" (
    "id" TEXT NOT NULL,
    "hubspotId" TEXT NOT NULL,
    "callBody" TEXT,
    "callCalleeObjectId" TEXT NOT NULL,
    "callCalleeObjectType" TEXT NOT NULL,
    "callDirection" TEXT NOT NULL,
    "callDisposition" TEXT NOT NULL,
    "callDuration" TEXT,
    "callFromNumber" TEXT,
    "callRecordingUrl" TEXT,
    "callSource" TEXT NOT NULL,
    "callStatus" TEXT NOT NULL,
    "callTitle" TEXT NOT NULL,
    "callToNumber" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "hubspotOwnerId" TEXT,
    "leadId" TEXT,
    "contactId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_calls_pkey" PRIMARY KEY ("id")
);

-- HubSpot Meetings
CREATE TABLE "hubspot_meetings" (
    "id" TEXT NOT NULL,
    "hubspotId" TEXT NOT NULL,
    "meetingTitle" TEXT NOT NULL,
    "meetingBody" TEXT,
    "meetingStartTime" TIMESTAMP(3) NOT NULL,
    "meetingEndTime" TIMESTAMP(3) NOT NULL,
    "meetingLocation" TEXT,
    "meetingOutcome" TEXT NOT NULL,
    "meetingSource" TEXT NOT NULL,
    "meetingSourceId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "hubspotOwnerId" TEXT,
    "meetingExternalUrl" TEXT,
    "leadId" TEXT,
    "contactId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_meetings_pkey" PRIMARY KEY ("id")
);

-- HubSpot Notes
CREATE TABLE "hubspot_notes" (
    "id" TEXT NOT NULL,
    "hubspotId" TEXT NOT NULL,
    "noteBody" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "hubspotOwnerId" TEXT,
    "attachmentIds" TEXT,
    "noteBodyPreview" TEXT,
    "createdByUserId" TEXT,
    "modifiedByUserId" TEXT,
    "leadId" TEXT,
    "contactId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_notes_pkey" PRIMARY KEY ("id")
);

-- HubSpot Tickets
CREATE TABLE "hubspot_tickets" (
    "id" TEXT NOT NULL,
    "hubspotId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT,
    "ticketPriority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "ticketCategory" TEXT,
    "pipelineStage" TEXT,
    "pipeline" TEXT,
    "hubspotOwnerId" TEXT,
    "createDate" TIMESTAMP(3),
    "lastModifiedDate" TIMESTAMP(3),
    "closedDate" TIMESTAMP(3),
    "timeToClose" TEXT,
    "timeToFirstAgentReply" TEXT,
    "numTimesContacted" TEXT,
    "ticketSource" TEXT,
    "resolution" TEXT,
    "ticketSubcategory" TEXT,
    "sourceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_tickets_pkey" PRIMARY KEY ("id")
);

-- HubSpot Products
CREATE TABLE "hubspot_products" (
    "id" TEXT NOT NULL,
    "hubspotId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" TEXT,
    "sku" TEXT,
    "costOfGoodsSold" TEXT,
    "dimensions" TEXT,
    "folderId" TEXT,
    "images" TEXT,
    "productType" TEXT,
    "recurringBillingPeriod" TEXT,
    "taxCode" TEXT,
    "url" TEXT,
    "weight" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_products_pkey" PRIMARY KEY ("id")
);

-- HubSpot Forms
CREATE TABLE "hubspot_forms" (
    "id" TEXT NOT NULL,
    "hubspotId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "action" TEXT,
    "method" TEXT,
    "cssClass" TEXT,
    "redirect" TEXT,
    "submitText" TEXT,
    "followUpId" TEXT,
    "notifyRecipients" TEXT,
    "leadNurturingCampaignId" TEXT,
    "formFieldGroups" JSONB,
    "contactsCount" INTEGER NOT NULL DEFAULT 0,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "submissionsCount" INTEGER NOT NULL DEFAULT 0,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_forms_pkey" PRIMARY KEY ("id")
);

-- HubSpot Workflows
CREATE TABLE "hubspot_workflows" (
    "id" TEXT NOT NULL,
    "hubspotId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "workflowType" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "enrolledContacts" INTEGER NOT NULL DEFAULT 0,
    "activeContacts" INTEGER NOT NULL DEFAULT 0,
    "internal" BOOLEAN NOT NULL DEFAULT false,
    "onlyExecOnBizDays" BOOLEAN NOT NULL DEFAULT false,
    "segmentCriteria" JSONB,
    "goalCriteria" JSONB,
    "suppressionListIds" TEXT[],
    "actions" JSONB,
    "unenrollmentSettings" JSONB,
    "enrollmentCriteria" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_workflows_pkey" PRIMARY KEY ("id")
);

-- HubSpot Documents
CREATE TABLE "hubspot_documents" (
    "id" TEXT NOT NULL,
    "hubspotId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL,
    "lastViewedDate" TIMESTAMP(3),
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "uniqueViews" INTEGER NOT NULL DEFAULT 0,
    "averageViewTime" INTEGER NOT NULL DEFAULT 0,
    "totalViewTime" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "engagementScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "viewingSessions" JSONB,
    "pageAnalytics" JSONB,
    "insights" JSONB,
    "contactId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_documents_pkey" PRIMARY KEY ("id")
);

-- HubSpot Social Insights
CREATE TABLE "hubspot_social_insights" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "profileUrl" TEXT,
    "headline" TEXT,
    "location" TEXT,
    "industry" TEXT,
    "connectionCount" INTEGER NOT NULL DEFAULT 0,
    "followersCount" INTEGER NOT NULL DEFAULT 0,
    "recentActivity" JSONB,
    "mutualConnections" JSONB,
    "companyInsights" JSONB,
    "contentInteractions" JSONB,
    "salesNavigatorData" JSONB,
    "bestContactTime" TEXT,
    "bestContactDay" TEXT,
    "bestContactMethod" TEXT,
    "warmingOpportunities" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_social_insights_pkey" PRIMARY KEY ("id")
);

-- HubSpot Analytics
CREATE TABLE "hubspot_analytics" (
    "id" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "dateRange" TEXT NOT NULL,
    "totalContacts" INTEGER NOT NULL DEFAULT 0,
    "totalCompanies" INTEGER NOT NULL DEFAULT 0,
    "totalDeals" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageDealSize" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "winRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "salesCycleLength" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leadsThisMonth" INTEGER NOT NULL DEFAULT 0,
    "dealsThisMonth" INTEGER NOT NULL DEFAULT 0,
    "revenueThisMonth" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conversionRates" JSONB,
    "pipelineMetrics" JSONB,
    "activityMetrics" JSONB,
    "sourceAttribution" JSONB,
    "monthlyTrends" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hubspot_analytics_pkey" PRIMARY KEY ("id")
);

-- ========================================================================================
-- INDICES
-- ========================================================================================

-- Unique constraints
CREATE UNIQUE INDEX "hubspot_companies_hubspotId_key" ON "hubspot_companies"("hubspotId");
CREATE UNIQUE INDEX "hubspot_deals_hubspotId_key" ON "hubspot_deals"("hubspotId");
CREATE UNIQUE INDEX "hubspot_tasks_hubspotId_key" ON "hubspot_tasks"("hubspotId");
CREATE UNIQUE INDEX "hubspot_emails_hubspotId_key" ON "hubspot_emails"("hubspotId");
CREATE UNIQUE INDEX "hubspot_calls_hubspotId_key" ON "hubspot_calls"("hubspotId");
CREATE UNIQUE INDEX "hubspot_meetings_hubspotId_key" ON "hubspot_meetings"("hubspotId");
CREATE UNIQUE INDEX "hubspot_notes_hubspotId_key" ON "hubspot_notes"("hubspotId");
CREATE UNIQUE INDEX "hubspot_tickets_hubspotId_key" ON "hubspot_tickets"("hubspotId");
CREATE UNIQUE INDEX "hubspot_products_hubspotId_key" ON "hubspot_products"("hubspotId");
CREATE UNIQUE INDEX "hubspot_forms_hubspotId_key" ON "hubspot_forms"("hubspotId");
CREATE UNIQUE INDEX "hubspot_workflows_hubspotId_key" ON "hubspot_workflows"("hubspotId");
CREATE UNIQUE INDEX "hubspot_documents_hubspotId_key" ON "hubspot_documents"("hubspotId");

-- Performance indices
CREATE INDEX "hubspot_companies_name_idx" ON "hubspot_companies"("name");
CREATE INDEX "hubspot_companies_domain_idx" ON "hubspot_companies"("domain");
CREATE INDEX "hubspot_companies_industry_idx" ON "hubspot_companies"("industry");

CREATE INDEX "hubspot_deals_dealStage_idx" ON "hubspot_deals"("dealStage");
CREATE INDEX "hubspot_deals_amount_idx" ON "hubspot_deals"("amount");
CREATE INDEX "hubspot_deals_closeDate_idx" ON "hubspot_deals"("closeDate");
CREATE INDEX "hubspot_deals_leadId_idx" ON "hubspot_deals"("leadId");
CREATE INDEX "hubspot_deals_contactId_idx" ON "hubspot_deals"("contactId");
CREATE INDEX "hubspot_deals_companyId_idx" ON "hubspot_deals"("companyId");

CREATE INDEX "hubspot_tasks_taskStatus_idx" ON "hubspot_tasks"("taskStatus");
CREATE INDEX "hubspot_tasks_taskPriority_idx" ON "hubspot_tasks"("taskPriority");
CREATE INDEX "hubspot_tasks_timestamp_idx" ON "hubspot_tasks"("timestamp");
CREATE INDEX "hubspot_tasks_contactId_idx" ON "hubspot_tasks"("contactId");

CREATE INDEX "hubspot_emails_emailDirection_idx" ON "hubspot_emails"("emailDirection");
CREATE INDEX "hubspot_emails_emailStatus_idx" ON "hubspot_emails"("emailStatus");
CREATE INDEX "hubspot_emails_timestamp_idx" ON "hubspot_emails"("timestamp");
CREATE INDEX "hubspot_emails_contactId_idx" ON "hubspot_emails"("contactId");

CREATE INDEX "hubspot_calls_callDirection_idx" ON "hubspot_calls"("callDirection");
CREATE INDEX "hubspot_calls_callStatus_idx" ON "hubspot_calls"("callStatus");
CREATE INDEX "hubspot_calls_timestamp_idx" ON "hubspot_calls"("timestamp");
CREATE INDEX "hubspot_calls_contactId_idx" ON "hubspot_calls"("contactId");

CREATE INDEX "hubspot_meetings_meetingOutcome_idx" ON "hubspot_meetings"("meetingOutcome");
CREATE INDEX "hubspot_meetings_meetingStartTime_idx" ON "hubspot_meetings"("meetingStartTime");
CREATE INDEX "hubspot_meetings_contactId_idx" ON "hubspot_meetings"("contactId");

CREATE INDEX "hubspot_tickets_ticketPriority_idx" ON "hubspot_tickets"("ticketPriority");
CREATE INDEX "hubspot_tickets_pipelineStage_idx" ON "hubspot_tickets"("pipelineStage");
CREATE INDEX "hubspot_tickets_createDate_idx" ON "hubspot_tickets"("createDate");

CREATE INDEX "hubspot_forms_conversionRate_idx" ON "hubspot_forms"("conversionRate");
CREATE INDEX "hubspot_forms_submissionsCount_idx" ON "hubspot_forms"("submissionsCount");

CREATE INDEX "hubspot_documents_contactId_idx" ON "hubspot_documents"("contactId");
CREATE INDEX "hubspot_documents_engagementScore_idx" ON "hubspot_documents"("engagementScore");
CREATE INDEX "hubspot_documents_totalViews_idx" ON "hubspot_documents"("totalViews");

CREATE INDEX "hubspot_social_insights_contactId_idx" ON "hubspot_social_insights"("contactId");
CREATE INDEX "hubspot_social_insights_platform_idx" ON "hubspot_social_insights"("platform");

-- ========================================================================================
-- FOREIGN KEY CONSTRAINTS
-- ========================================================================================

-- Agregar foreign keys para mantener integridad referencial
ALTER TABLE "hubspot_deals" ADD CONSTRAINT "hubspot_deals_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "hubspot_deals" ADD CONSTRAINT "hubspot_deals_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "hubspot_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "hubspot_deals" ADD CONSTRAINT "hubspot_deals_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "hubspot_companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "hubspot_tasks" ADD CONSTRAINT "hubspot_tasks_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "hubspot_tasks" ADD CONSTRAINT "hubspot_tasks_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "hubspot_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "hubspot_emails" ADD CONSTRAINT "hubspot_emails_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "hubspot_emails" ADD CONSTRAINT "hubspot_emails_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "hubspot_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "hubspot_calls" ADD CONSTRAINT "hubspot_calls_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "hubspot_calls" ADD CONSTRAINT "hubspot_calls_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "hubspot_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "hubspot_meetings" ADD CONSTRAINT "hubspot_meetings_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "hubspot_meetings" ADD CONSTRAINT "hubspot_meetings_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "hubspot_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "hubspot_notes" ADD CONSTRAINT "hubspot_notes_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "hubspot_notes" ADD CONSTRAINT "hubspot_notes_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "hubspot_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "hubspot_documents" ADD CONSTRAINT "hubspot_documents_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "hubspot_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ========================================================================================
-- COMENTARIOS
-- ========================================================================================

COMMENT ON TABLE "hubspot_companies" IS 'Empresas sincronizadas desde HubSpot';
COMMENT ON TABLE "hubspot_deals" IS 'Deals/oportunidades de HubSpot';
COMMENT ON TABLE "hubspot_tasks" IS 'Tareas de HubSpot';
COMMENT ON TABLE "hubspot_emails" IS 'Emails de HubSpot';
COMMENT ON TABLE "hubspot_calls" IS 'Llamadas de HubSpot';
COMMENT ON TABLE "hubspot_meetings" IS 'Reuniones de HubSpot';
COMMENT ON TABLE "hubspot_notes" IS 'Notas de HubSpot';
COMMENT ON TABLE "hubspot_tickets" IS 'Tickets de soporte de HubSpot';
COMMENT ON TABLE "hubspot_products" IS 'Productos de HubSpot';
COMMENT ON TABLE "hubspot_forms" IS 'Formularios de HubSpot';
COMMENT ON TABLE "hubspot_workflows" IS 'Workflows/automatizaciones de HubSpot';
COMMENT ON TABLE "hubspot_documents" IS 'Documentos compartidos con tracking';
COMMENT ON TABLE "hubspot_social_insights" IS 'Insights de redes sociales (LinkedIn, etc.)';
COMMENT ON TABLE "hubspot_analytics" IS 'Analytics y reportes de HubSpot'; 