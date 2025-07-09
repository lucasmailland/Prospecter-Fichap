// ========================================================================================
// HUBSPOT ADVANCED TYPES - Tipos para funcionalidades avanzadas
// ========================================================================================

export interface HubSpotDeal {
  id: string;
  properties: {
    dealname: string;
    amount: string;
    dealstage: string;
    pipeline: string;
    closedate: string;
    createdate: string;
    hubspot_owner_id: string;
    deal_currency_code: string;
    dealtype: string;
    hs_analytics_source: string;
    hs_analytics_source_data_1: string;
    hs_analytics_source_data_2: string;
    hs_campaign?: string;
    hs_deal_stage_probability: string;
    hs_forecast_amount: string;
    hs_forecast_probability: string;
    hs_is_closed: string;
    hs_is_closed_won: string;
    hs_next_step: string;
    hs_object_id: string;
    num_contacted_notes: string;
    num_notes: string;
    num_associated_contacts: string;
    description?: string;
  };
  associations?: {
    contacts?: Array<{ id: string; type: string }>;
    companies?: Array<{ id: string; type: string }>;
    line_items?: Array<{ id: string; type: string }>;
  };
}

export interface HubSpotCompany {
  id: string;
  properties: {
    name: string;
    domain: string;
    industry: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    website: string;
    numberofemployees: string;
    annualrevenue: string;
    description: string;
    founded_year: string;
    type: string;
    hs_lead_status: string;
    lifecyclestage: string;
    hubspot_owner_id: string;
    createdate: string;
    hs_lastmodifieddate: string;
    linkedin_company_page?: string;
    twitterhandle?: string;
    facebookcompanypage?: string;
    
    // Campos personalizados avanzados
    total_money_raised?: string;
    recent_deal_amount?: string;
    recent_deal_close_date?: string;
    num_associated_contacts?: string;
    num_associated_deals?: string;
    days_to_close?: string;
    hs_analytics_source?: string;
    hs_analytics_source_data_1?: string;
    hs_analytics_source_data_2?: string;
  };
}

export interface HubSpotTicket {
  id: string;
  properties: {
    hs_ticket_id: string;
    subject: string;
    content: string;
    hs_ticket_priority: 'LOW' | 'MEDIUM' | 'HIGH';
    hs_ticket_category: string;
    hs_pipeline_stage: string;
    hs_pipeline: string;
    hubspot_owner_id: string;
    createdate: string;
    hs_lastmodifieddate: string;
    closed_date?: string;
    time_to_close?: string;
    time_to_first_agent_reply?: string;
    hs_num_times_contacted?: string;
    hs_ticket_source?: string;
    hs_resolution?: string;
    hs_ticket_category?: string;
    hs_ticket_subcategory?: string;
    source_type?: string;
  };
  associations?: {
    contacts?: Array<{ id: string; type: string }>;
    companies?: Array<{ id: string; type: string }>;
    deals?: Array<{ id: string; type: string }>;
  };
}

export interface HubSpotTask {
  id: string;
  properties: {
    hs_task_subject: string;
    hs_task_body: string;
    hs_task_status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'WAITING' | 'DEFERRED';
    hs_task_priority: 'LOW' | 'MEDIUM' | 'HIGH';
    hs_task_type: 'EMAIL' | 'CALL' | 'TODO' | 'MEETING';
    hs_timestamp: string;
    hubspot_owner_id: string;
    hs_task_completion_date?: string;
    hs_task_is_completed?: string;
    hs_task_duration?: string;
    hs_task_reminders?: string;
    hs_task_for_object_type?: string;
    hs_task_contact_timezone?: string;
    hs_task_sequence_step_enrollment_id?: string;
    hs_task_sequence_enrollment_id?: string;
    hs_task_is_all_day?: string;
    hs_task_send_default_reminder?: string;
    hs_task_completion_status?: string;
  };
  associations?: {
    contacts?: Array<{ id: string; type: string }>;
    companies?: Array<{ id: string; type: string }>;
    deals?: Array<{ id: string; type: string }>;
  };
}

export interface HubSpotNote {
  id: string;
  properties: {
    hs_note_body: string;
    hs_timestamp: string;
    hubspot_owner_id: string;
    hs_attachment_ids?: string;
    hs_note_body_preview?: string;
    hs_created_by_user_id?: string;
    hs_modified_by_user_id?: string;
  };
  associations?: {
    contacts?: Array<{ id: string; type: string }>;
    companies?: Array<{ id: string; type: string }>;
    deals?: Array<{ id: string; type: string }>;
    tickets?: Array<{ id: string; type: string }>;
  };
}

export interface HubSpotEmail {
  id: string;
  properties: {
    hs_email_subject: string;
    hs_email_html: string;
    hs_email_text: string;
    hs_email_direction: 'EMAIL' | 'INCOMING_EMAIL' | 'FORWARDED_EMAIL';
    hs_email_status: 'SENT' | 'PENDING' | 'FAILED' | 'SCHEDULED';
    hs_timestamp: string;
    hubspot_owner_id: string;
    hs_email_from_email?: string;
    hs_email_from_firstname?: string;
    hs_email_from_lastname?: string;
    hs_email_to_email?: string;
    hs_email_to_firstname?: string;
    hs_email_to_lastname?: string;
    hs_email_cc?: string;
    hs_email_bcc?: string;
    hs_email_reply_to?: string;
    hs_email_message_id?: string;
    hs_email_thread_id?: string;
    hs_email_tracker_key?: string;
    hs_email_open_count?: string;
    hs_email_click_count?: string;
    hs_email_reply_count?: string;
    hs_email_bounce_count?: string;
    hs_email_attached_video_opened?: string;
    hs_email_attached_video_watched?: string;
    hs_email_validation_skipped?: string;
    hs_email_send_event_id?: string;
    hs_email_media_processing_status?: string;
    hs_email_logging_status?: string;
    hs_email_confirmations_requested?: string;
    hs_email_confirmations_confirmed?: string;
    hs_email_facsimile_send_id?: string;
    hs_email_recipient_drop_reasons?: string;
    hs_email_post_send_status?: string;
    hs_email_pre_send_status?: string;
    hs_email_source?: string;
    hs_email_source_id?: string;
    hs_email_source_campaign_id?: string;
    hs_email_source_sequence_id?: string;
    hs_email_source_sequence_step_id?: string;
    hs_email_source_task_id?: string;
    hs_email_source_workflow_id?: string;
    hs_email_source_user_id?: string;
    hs_email_source_portal_id?: string;
    hs_email_source_app_id?: string;
    hs_email_source_app_name?: string;
    hs_email_source_created_by?: string;
    hs_merged_object_ids?: string;
    hs_unique_creation_key?: string;
    hs_unique_id?: string;
    hs_updated_by_user_id?: string;
    hs_user_ids_of_all_notification_followers?: string;
    hs_user_ids_of_all_notification_unfollowers?: string;
    hs_user_ids_of_all_owners?: string;
    hs_was_imported?: string;
    hubspot_team_id?: string;
    hs_all_assigned_business_unit_ids?: string;
    hs_created_by_user_id?: string;
    hs_updated_by_user_id?: string;
    hs_createdate?: string;
    hs_lastmodifieddate?: string;
    hs_object_id?: string;
  };
  associations?: {
    contacts?: Array<{ id: string; type: string }>;
    companies?: Array<{ id: string; type: string }>;
    deals?: Array<{ id: string; type: string }>;
    tickets?: Array<{ id: string; type: string }>;
  };
}

export interface HubSpotCall {
  id: string;
  properties: {
    hs_call_body: string;
    hs_call_callee_object_id: string;
    hs_call_callee_object_type: string;
    hs_call_direction: 'INBOUND' | 'OUTBOUND';
    hs_call_disposition: 'ANSWERED' | 'BUSY' | 'FAILED' | 'LEFT_LIVE_MESSAGE' | 'LEFT_VOICEMAIL' | 'NO_ANSWER' | 'CANCELED' | 'COMPLETED';
    hs_call_duration: string;
    hs_call_from_number: string;
    hs_call_recording_url?: string;
    hs_call_source: string;
    hs_call_status: 'BUSY' | 'CALLING' | 'CANCELED' | 'COMPLETED' | 'CONNECTING' | 'FAILED' | 'IN_PROGRESS' | 'NO_ANSWER' | 'QUEUED' | 'RINGING';
    hs_call_title: string;
    hs_call_to_number: string;
    hs_timestamp: string;
    hubspot_owner_id: string;
    hs_activity_type?: string;
    hs_all_accessible_team_ids?: string;
    hs_all_owner_ids?: string;
    hs_all_team_ids?: string;
    hs_at_mentioned_owner_ids?: string;
    hs_attachment_ids?: string;
    hs_body_preview?: string;
    hs_body_preview_html?: string;
    hs_body_preview_is_truncated?: string;
    hs_created_by?: string;
    hs_created_by_user_id?: string;
    hs_createdate?: string;
    hs_engagement_source?: string;
    hs_engagement_source_id?: string;
    hs_follow_up_action?: string;
    hs_gdpr_deleted?: string;
    hs_lastmodifieddate?: string;
    hs_modified_by?: string;
    hs_object_id?: string;
    hs_product_name?: string;
    hs_queue_membership_ids?: string;
    hs_unique_creation_key?: string;
    hs_unique_id?: string;
    hs_updated_by_user_id?: string;
    hs_user_ids_of_all_notification_followers?: string;
    hs_user_ids_of_all_notification_unfollowers?: string;
    hs_user_ids_of_all_owners?: string;
    hubspot_team_id?: string;
    hs_all_assigned_business_unit_ids?: string;
  };
  associations?: {
    contacts?: Array<{ id: string; type: string }>;
    companies?: Array<{ id: string; type: string }>;
    deals?: Array<{ id: string; type: string }>;
    tickets?: Array<{ id: string; type: string }>;
  };
}

export interface HubSpotMeeting {
  id: string;
  properties: {
    hs_meeting_title: string;
    hs_meeting_body: string;
    hs_meeting_start_time: string;
    hs_meeting_end_time: string;
    hs_meeting_location?: string;
    hs_meeting_outcome: 'SCHEDULED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW' | 'RESCHEDULED';
    hs_meeting_source: string;
    hs_meeting_source_id?: string;
    hs_timestamp: string;
    hubspot_owner_id: string;
    hs_meeting_created_from_link_id?: string;
    hs_meeting_web_conference_meeting_id?: string;
    hs_meeting_external_url?: string;
    hs_meeting_pre_meeting_prospect_reminders?: string;
    hs_meeting_allow_conflict_meetings?: string;
    hs_meeting_link_id?: string;
    hs_meeting_location_type?: string;
    hs_meeting_ms_teams_payload?: string;
    hs_meeting_organizer_user_id?: string;
    hs_meeting_zoom_meeting_uuid?: string;
    hs_activity_type?: string;
    hs_all_accessible_team_ids?: string;
    hs_all_owner_ids?: string;
    hs_all_team_ids?: string;
    hs_at_mentioned_owner_ids?: string;
    hs_attachment_ids?: string;
    hs_body_preview?: string;
    hs_body_preview_html?: string;
    hs_body_preview_is_truncated?: string;
    hs_created_by?: string;
    hs_created_by_user_id?: string;
    hs_createdate?: string;
    hs_engagement_source?: string;
    hs_engagement_source_id?: string;
    hs_follow_up_action?: string;
    hs_gdpr_deleted?: string;
    hs_lastmodifieddate?: string;
    hs_modified_by?: string;
    hs_object_id?: string;
    hs_product_name?: string;
    hs_queue_membership_ids?: string;
    hs_unique_creation_key?: string;
    hs_unique_id?: string;
    hs_updated_by_user_id?: string;
    hs_user_ids_of_all_notification_followers?: string;
    hs_user_ids_of_all_notification_unfollowers?: string;
    hs_user_ids_of_all_owners?: string;
    hubspot_team_id?: string;
    hs_all_assigned_business_unit_ids?: string;
  };
  associations?: {
    contacts?: Array<{ id: string; type: string }>;
    companies?: Array<{ id: string; type: string }>;
    deals?: Array<{ id: string; type: string }>;
    tickets?: Array<{ id: string; type: string }>;
  };
}

export interface HubSpotProduct {
  id: string;
  properties: {
    name: string;
    description?: string;
    price: string;
    hs_sku: string;
    hs_cost_of_goods_sold?: string;
    hs_dimensions?: string;
    hs_folder_id?: string;
    hs_images?: string;
    hs_product_type?: string;
    hs_recurring_billing_period?: string;
    hs_tax_code?: string;
    hs_url?: string;
    hs_weight?: string;
    hs_createdate?: string;
    hs_lastmodifieddate?: string;
    hs_object_id?: string;
    createdate?: string;
    hs_updated_by_user_id?: string;
    hs_created_by_user_id?: string;
  };
}

export interface HubSpotLineItem {
  id: string;
  properties: {
    name: string;
    hs_product_id: string;
    quantity: string;
    price: string;
    amount: string;
    hs_line_item_currency_code?: string;
    hs_discount_amount?: string;
    hs_discount_percentage?: string;
    hs_tax_amount?: string;
    hs_total_discount?: string;
    hs_line_item_type?: string;
    hs_custom_line_item_id?: string;
    hs_recurring_billing_start_date?: string;
    hs_recurring_billing_end_date?: string;
    hs_recurring_billing_period?: string;
    hs_line_item_original_line_item_id?: string;
    hs_line_item_gross_price?: string;
    hs_line_item_net_price?: string;
    hs_line_item_unit_price?: string;
    hs_margin?: string;
    hs_margin_acv?: string;
    hs_margin_arr?: string;
    hs_margin_mrr?: string;
    hs_margin_tcv?: string;
    hs_acv?: string;
    hs_arr?: string;
    hs_mrr?: string;
    hs_tcv?: string;
    hs_createdate?: string;
    hs_lastmodifieddate?: string;
    hs_object_id?: string;
    createdate?: string;
    hs_updated_by_user_id?: string;
    hs_created_by_user_id?: string;
  };
  associations?: {
    deals?: Array<{ id: string; type: string }>;
    quotes?: Array<{ id: string; type: string }>;
    products?: Array<{ id: string; type: string }>;
  };
}

export interface HubSpotQuote {
  id: string;
  properties: {
    hs_title: string;
    hs_public_url_key: string;
    hs_status: 'DRAFT' | 'APPROVAL_NOT_NEEDED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'PENDING_SIGNATURE' | 'CONTRACT_SIGNED' | 'EXPIRED';
    hs_language: string;
    hs_currency: string;
    hs_quote_amount: string;
    hs_quote_number: string;
    hs_expiration_date?: string;
    hs_terms?: string;
    hs_sender_company_name?: string;
    hs_sender_company_address?: string;
    hs_sender_company_city?: string;
    hs_sender_company_state?: string;
    hs_sender_company_postal_code?: string;
    hs_sender_company_country?: string;
    hs_recipient_company_name?: string;
    hs_recipient_company_address?: string;
    hs_recipient_company_city?: string;
    hs_recipient_company_state?: string;
    hs_recipient_company_postal_code?: string;
    hs_recipient_company_country?: string;
    hs_comments?: string;
    hs_domain?: string;
    hs_esign_enabled?: string;
    hs_pdf_download_link?: string;
    hs_public_url?: string;
    hs_quote_amount_summary?: string;
    hs_quote_template_id?: string;
    hs_total_quote_amount?: string;
    hs_createdate?: string;
    hs_lastmodifieddate?: string;
    hs_object_id?: string;
    createdate?: string;
    hs_updated_by_user_id?: string;
    hs_created_by_user_id?: string;
    hubspot_owner_id?: string;
  };
  associations?: {
    contacts?: Array<{ id: string; type: string }>;
    companies?: Array<{ id: string; type: string }>;
    deals?: Array<{ id: string; type: string }>;
    line_items?: Array<{ id: string; type: string }>;
  };
}

export interface HubSpotOwner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  teams?: Array<{
    id: string;
    name: string;
    primary: boolean;
  }>;
}

export interface HubSpotForm {
  id: string;
  name: string;
  action: string;
  method: 'POST' | 'GET';
  cssClass: string;
  redirect: string;
  submitText: string;
  followUpId: string;
  notifyRecipients: string;
  leadNurturingCampaignId: string;
  formFieldGroups: Array<{
    fields: Array<{
      name: string;
      label: string;
      type: string;
      fieldType: string;
      description: string;
      groupName: string;
      displayOrder: number;
      required: boolean;
      selectedOptions: Array<{
        label: string;
        value: string;
      }>;
      options: Array<{
        label: string;
        value: string;
        displayOrder: number;
      }>;
      validation: {
        name: string;
        message: string;
        data: string;
        useDefaultBlockList: boolean;
        blockedEmailAddresses: string[];
      };
      enabled: boolean;
      hidden: boolean;
      defaultValue: string;
      isSmartField: boolean;
      unselectedLabel: string;
      placeholder: string;
      dependentFieldFilters: Array<{
        filters: Array<{
          operator: string;
          strValue: string;
          boolValue: boolean;
          numberValue: number;
          strValues: string[];
        }>;
        dependentFormField: {
          name: string;
        };
        formFieldAction: string;
      }>;
      labelHidden: boolean;
      propertyObjectType: string;
      metaData: Array<{
        name: string;
        value: string;
      }>;
      objectTypeId: string;
    }>;
    default: boolean;
    isSmartGroup: boolean;
    richText: {
      content: string;
      type: string;
    };
  }>;
  createdAt: number;
  updatedAt: number;
  portalId: number;
  contactsCount: number;
  conversion: {
    contactsCount: number;
    submissionsCount: number;
    conversionRate: number;
  };
  viewsCount: number;
  submissionsCount: number;
}

export interface HubSpotWorkflow {
  id: string;
  name: string;
  type: 'DRIP_DELAY' | 'PROPERTY_ANCHOR' | 'DATE_ANCHOR' | 'RECURRING_DATE_ANCHOR' | 'FORM_ANCHOR' | 'STATIC_ANCHOR';
  enabled: boolean;
  createdBy: number;
  updatedBy: number;
  createdAt: number;
  updatedAt: number;
  contactListIds: {
    enrolled: number;
    active: number;
    steps: Array<{
      id: string;
      enrolled: number;
      active: number;
    }>;
  };
  internal: boolean;
  onlyExecOnBizDays: boolean;
  onlyExecuteOnBusinessDays: boolean;
  portalId: number;
  isSegmentationOnly: boolean;
  nurtureTimeRange: {
    enabled: boolean;
    startHour: number;
    stopHour: number;
  };
  enabled: boolean;
  segmentCriteria: Array<{
    filterFamily: string;
    withinTimeMode: string;
    acceptsVisitors: boolean;
    operator: string;
    type: string;
    value: string;
    property: string;
    checkPastVersions: boolean;
  }>;
  goalCriteria: Array<{
    filterFamily: string;
    withinTimeMode: string;
    acceptsVisitors: boolean;
    operator: string;
    type: string;
    value: string;
    property: string;
    checkPastVersions: boolean;
  }>;
  suppressionListIds: number[];
  actions: Array<{
    type: string;
    delayMillis: number;
    filterFamily: string;
    operator: string;
    value: string;
    property: string;
    newValue: string;
    emailCampaignId: number;
    taskType: string;
    taskNote: string;
    taskDueDate: string;
    taskPriority: string;
    ownerId: number;
    staticListId: number;
    workflowId: number;
  }>;
  unenrollmentSettings: {
    enabled: boolean;
    criteriaGroups: Array<{
      criteria: Array<{
        filterFamily: string;
        withinTimeMode: string;
        acceptsVisitors: boolean;
        operator: string;
        type: string;
        value: string;
        property: string;
        checkPastVersions: boolean;
      }>;
    }>;
  };
  allowContactToTriggerMultipleTimes: boolean;
  enrollmentCriteria: {
    criteriaGroups: Array<{
      criteria: Array<{
        filterFamily: string;
        withinTimeMode: string;
        acceptsVisitors: boolean;
        operator: string;
        type: string;
        value: string;
        property: string;
        checkPastVersions: boolean;
      }>;
    }>;
  };
  personaTagIds: number[];
  useListMembership: boolean;
  activeListIds: number[];
  contactListIds: number[];
  listMemberships: Array<{
    listId: number;
    listName: string;
    listType: string;
    membershipType: string;
  }>;
  eventAnchor: {
    contactPropertyAnchor: string;
    eventTypeId: number;
    staticDateAnchor: string;
    contactPropertyArrayAnchor: string;
    recurringDateAnchor: {
      frequency: string;
      interval: number;
    };
  };
  listening: boolean;
  lastUpdatedBy: number;
  migrationStatus: {
    portalId: number;
    flowId: number;
    status: string;
    migrationTime: number;
    flowErrors: string[];
  };
}

export interface HubSpotWebhook {
  id: string;
  createdAt: string;
  updatedAt: string;
  eventType: string;
  propertyName?: string;
  active: boolean;
  targetUrl: string;
  throttling: {
    maxConcurrentRequests: number;
    period: string;
  };
}

export interface HubSpotFile {
  id: string;
  name: string;
  path: string;
  parentPath: string;
  url: string;
  type: 'FILE' | 'FOLDER';
  extension: string;
  size: number;
  archived: boolean;
  cloudinaryUrl?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  parentFolderId?: string;
  encoding?: string;
  height?: number;
  width?: number;
  access: 'PRIVATE' | 'PUBLIC_INDEXABLE' | 'PUBLIC_NOT_INDEXABLE';
  ttl?: string;
  hostingType?: string;
  duplicateValidationStrategy?: string;
  duplicateValidationScope?: string;
  overwrite?: boolean;
  isUsableInContent?: boolean;
  altText?: string;
  folderPath?: string;
  defaultHostingUrlType?: string;
  metadata?: Record<string, any>;
}

// Tipos para Analytics y Reportes
export interface HubSpotAnalytics {
  totalContacts: number;
  totalCompanies: number;
  totalDeals: number;
  totalRevenue: number;
  averageDealSize: number;
  winRate: number;
  salesCycleLength: number;
  leadsThisMonth: number;
  dealsThisMonth: number;
  revenueThisMonth: number;
  conversionRates: {
    leadToOpportunity: number;
    opportunityToCustomer: number;
    leadToCustomer: number;
  };
  pipelineMetrics: {
    totalPipelineValue: number;
    weightedPipelineValue: number;
    expectedCloseValue: number;
    averageDaysInStage: Record<string, number>;
  };
  activityMetrics: {
    emailsSent: number;
    emailsOpened: number;
    emailsClicked: number;
    callsMade: number;
    meetingsHeld: number;
    tasksCompleted: number;
  };
  sourceAttribution: Record<string, {
    contacts: number;
    deals: number;
    revenue: number;
    conversionRate: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    contacts: number;
    deals: number;
    revenue: number;
    activities: number;
  }>;
}

// Tipos para Social Selling
export interface LinkedInInsights {
  profile: {
    profileUrl: string;
    headline: string;
    location: string;
    industry: string;
    connectionCount: number;
    followersCount: number;
    recentActivity: Array<{
      type: 'POST' | 'COMMENT' | 'SHARE' | 'REACTION';
      content: string;
      timestamp: string;
      engagement: {
        likes: number;
        comments: number;
        shares: number;
      };
    }>;
  };
  mutualConnections: Array<{
    name: string;
    profileUrl: string;
    position: string;
    company: string;
    sharedConnection: boolean;
  }>;
  companyInsights: {
    size: string;
    growth: string;
    recentNews: Array<{
      title: string;
      url: string;
      publishedAt: string;
      source: string;
    }>;
    keyPeople: Array<{
      name: string;
      position: string;
      profileUrl: string;
      isConnection: boolean;
    }>;
  };
  contentInteractions: Array<{
    contentType: 'ARTICLE' | 'VIDEO' | 'POST' | 'DOCUMENT';
    title: string;
    url: string;
    interactionType: 'VIEW' | 'LIKE' | 'COMMENT' | 'SHARE';
    timestamp: string;
  }>;
  salesNavigatorData: {
    leadRecommendations: Array<{
      name: string;
      position: string;
      company: string;
      reason: string;
      score: number;
    }>;
    accountInsights: Array<{
      type: 'FUNDING' | 'EXECUTIVE_CHANGE' | 'EXPANSION' | 'NEWS_MENTION';
      description: string;
      date: string;
      relevanceScore: number;
    }>;
  };
}

// Tipos para Document Tracking
export interface DocumentTracking {
  documentId: string;
  contactId: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  lastViewedDate?: string;
  totalViews: number;
  uniqueViews: number;
  averageViewTime: number;
  totalViewTime: number;
  downloadCount: number;
  shareCount: number;
  viewingSessions: Array<{
    sessionId: string;
    startTime: string;
    endTime: string;
    duration: number;
    pagesViewed: number;
    completionPercentage: number;
    userAgent: string;
    ipAddress: string;
    location: {
      country: string;
      city: string;
      region: string;
    };
  }>;
  pageAnalytics: Array<{
    pageNumber: number;
    viewCount: number;
    averageTimeOnPage: number;
    exitRate: number;
  }>;
  engagementScore: number;
  insights: Array<{
    type: 'HIGH_ENGAGEMENT' | 'REPEATED_VIEWS' | 'SHARED_DOCUMENT' | 'DOWNLOADED' | 'NO_ENGAGEMENT';
    description: string;
    actionable: boolean;
    suggestedAction?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
}

// Configuración avanzada para integraciones
export interface HubSpotAdvancedConfig {
  // Configuración de objetos CRM
  objects: {
    contacts: {
      enabled: boolean;
      customProperties: string[];
      syncFrequency: number;
      autoEnrichment: boolean;
    };
    companies: {
      enabled: boolean;
      customProperties: string[];
      syncFrequency: number;
      autoEnrichment: boolean;
    };
    deals: {
      enabled: boolean;
      customProperties: string[];
      syncFrequency: number;
      autoCreation: boolean;
      scoringThreshold: number;
    };
    tickets: {
      enabled: boolean;
      customProperties: string[];
      syncFrequency: number;
      autoAssignment: boolean;
    };
    products: {
      enabled: boolean;
      customProperties: string[];
      syncFrequency: number;
    };
  };
  
  // Configuración de automatización
  automation: {
    workflows: {
      enabled: boolean;
      autoTriggers: string[];
      leadNurturing: boolean;
      taskAutomation: boolean;
    };
    scoring: {
      enabled: boolean;
      realTimeUpdates: boolean;
      aiEnhanced: boolean;
      scoringRules: Array<{
        trigger: string;
        points: number;
        conditions: Record<string, any>;
      }>;
    };
    tasks: {
      enabled: boolean;
      autoAssignment: boolean;
      intelligentScheduling: boolean;
      followUpAutomation: boolean;
    };
  };
  
  // Configuración de analytics
  analytics: {
    enabled: boolean;
    customDashboards: boolean;
    revenueAttribution: boolean;
    predictiveAnalytics: boolean;
    realTimeMetrics: boolean;
    customReports: string[];
  };
  
  // Configuración de comunicaciones
  communications: {
    email: {
      enabled: boolean;
      trackingEnabled: boolean;
      templateSync: boolean;
      autoResponders: boolean;
    };
    calls: {
      enabled: boolean;
      recordingEnabled: boolean;
      transcriptionEnabled: boolean;
      autoLogging: boolean;
    };
    meetings: {
      enabled: boolean;
      calendarIntegration: boolean;
      autoScheduling: boolean;
      reminderAutomation: boolean;
    };
  };
  
  // Configuración de integraciones sociales
  social: {
    linkedin: {
      enabled: boolean;
      salesNavigator: boolean;
      contentTracking: boolean;
      connectionInsights: boolean;
    };
    twitter: {
      enabled: boolean;
      mentionTracking: boolean;
      engagementTracking: boolean;
    };
    facebook: {
      enabled: boolean;
      pageIntegration: boolean;
      adTracking: boolean;
    };
  };
  
  // Configuración de seguridad y privacidad
  security: {
    dataEncryption: boolean;
    accessControl: boolean;
    auditLogging: boolean;
    gdprCompliance: boolean;
    dataRetentionDays: number;
  };
  
  // Configuración de performance
  performance: {
    batchSize: number;
    rateLimiting: {
      requestsPerSecond: number;
      burstLimit: number;
    };
    caching: {
      enabled: boolean;
      ttlSeconds: number;
    };
    retryPolicy: {
      maxRetries: number;
      backoffMultiplier: number;
      maxBackoffSeconds: number;
    };
  };
}

export interface HubSpotIntegrationMetrics {
  lastSyncTime: string;
  totalRecordsSynced: number;
  syncErrors: number;
  apiCallsToday: number;
  apiLimitRemaining: number;
  averageResponseTime: number;
  syncStatus: 'HEALTHY' | 'WARNING' | 'ERROR';
  errorDetails?: Array<{
    type: string;
    message: string;
    timestamp: string;
    recordId?: string;
  }>;
  performanceMetrics: {
    syncThroughput: number; // records per minute
    errorRate: number; // percentage
    uptime: number; // percentage
  };
}

export interface HubSpotBulkOperation {
  operationId: string;
  operationType: 'CREATE' | 'UPDATE' | 'DELETE' | 'UPSERT';
  objectType: string;
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  startTime: string;
  endTime?: string;
  errors?: Array<{
    recordId: string;
    error: string;
    details: unknown;
  }>;
  results?: Array<{
    recordId: string;
    hubspotId: string;
    status: 'SUCCESS' | 'FAILED';
    error?: string;
  }>;
}

export interface RevenueForecast {
  period: string;
  totalForecast: number;
  confidenceLevel: number;
  byOwner: Record<string, {
    forecast: number;
    confidence: number;
    pipeline: number;
  }>;
  byProduct: Record<string, {
    forecast: number;
    confidence: number;
    pipeline: number;
  }>;
  byRegion: Record<string, {
    forecast: number;
    confidence: number;
    pipeline: number;
  }>;
  assumptions: string[];
  risks: Array<{
    type: string;
    description: string;
    impact: number;
    probability: number;
  }>;
  opportunities: Array<{
    type: string;
    description: string;
    impact: number;
    probability: number;
  }>;
}

export interface HubSpotRevenueAttribution {
  totalRevenue: number;
  attributionModel: 'FIRST_TOUCH' | 'LAST_TOUCH' | 'MULTI_TOUCH' | 'LINEAR' | 'TIME_DECAY';
  byChannel: Record<string, {
    revenue: number;
    deals: number;
    contacts: number;
    conversionRate: number;
    averageDealSize: number;
    salesCycleLength: number;
    roi: number;
    cost: number;
  }>;
  byCampaign: Record<string, {
    revenue: number;
    deals: number;
    contacts: number;
    conversionRate: number;
    averageDealSize: number;
    salesCycleLength: number;
    roi: number;
    cost: number;
  }>;
  byContent: Record<string, {
    revenue: number;
    deals: number;
    contacts: number;
    conversionRate: number;
    averageDealSize: number;
    salesCycleLength: number;
    roi: number;
    cost: number;
  }>;
  touchpointAnalysis: Array<{
    touchpointType: string;
    touchpointValue: string;
    position: 'FIRST' | 'MIDDLE' | 'LAST';
    averagePosition: number;
    influence: number;
    revenue: number;
    deals: number;
  }>;
  customerJourney: {
    averageTouchpoints: number;
    averageTimeToClose: number;
    commonPaths: Array<{
      path: string[];
      frequency: number;
      conversionRate: number;
      averageRevenue: number;
    }>;
  };
}

export interface HubSpotPredictiveInsights {
  contactId: string;
  predictionDate: string;
  scores: {
    conversionProbability: number;
    churnRisk: number;
    upsellPotential: number;
    engagementScore: number;
    lifetimeValue: number;
  };
  predictions: {
    nextBestAction: {
      action: string;
      confidence: number;
      expectedOutcome: string;
      timeline: string;
    };
    optimalTiming: {
      bestContactTime: string;
      bestContactDay: string;
      bestContactMethod: string;
    };
    contentRecommendations: Array<{
      contentType: string;
      topic: string;
      format: string;
      reason: string;
      confidence: number;
    }>;
  };
  insights: {
    keyFactors: Array<{
      factor: string;
      impact: number;
      trend: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    }>;
    similarProfiles: Array<{
      contactId: string;
      similarity: number;
      outcome: string;
      timeline: string;
    }>;
    behaviorPatterns: Array<{
      pattern: string;
      frequency: number;
      correlation: number;
    }>;
  };
  recommendations: Array<{
    type: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    action: string;
    reason: string;
    expectedImpact: string;
    timeline: string;
  }>;
}

export type HubSpotObjectType = 'contacts' | 'companies' | 'deals' | 'tickets' | 'products' | 'line_items' | 'quotes' | 'tasks' | 'notes' | 'emails' | 'calls' | 'meetings';

export interface HubSpotPermission {
  scope: string;
  description: string;
  required: boolean;
  useCases: string[];
  businessValue: string;
  implementationComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedDevelopmentTime: string;
}

export interface HubSpotIntegrationPlan {
  phase: number;
  name: string;
  description: string;
  permissions: HubSpotPermission[];
  estimatedTime: string;
  businessValue: string;
  technicalComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
  prerequisites: string[];
  deliverables: string[];
  successMetrics: string[];
} 