// ========================================================================================
// HUBSPOT TYPES - Tipado completo para la integración con HubSpot
// ========================================================================================

export interface HubSpotContact {
  id: string;
  properties: {
    email: string;
    firstname: string;
    lastname: string;
    company: string;
    jobtitle: string;
    phone: string;
    website: string;
    linkedin_url: string;
    country: string;
    state: string;
    city: string;
    industry: string;
    num_employees: string;
    annual_revenue: string;
    lifecycle_stage: string;
    lead_status: string;
    hs_lead_status: string;
    createdate: string;
    lastmodifieddate: string;
    last_activity_date: string;
    hubspot_owner_id: string;
    hs_time_zone: string;
  };
  associations?: {
    companies?: { id: string }[];
    deals?: { id: string }[];
  };
}

export interface HubSpotEmailMetrics {
  contact_id: string;
  emails_sent: number;
  emails_opened: number;
  emails_clicked: number;
  emails_replied: number;
  emails_bounced: number;
  open_rate: number;
  click_rate: number;
  reply_rate: number;
  last_email_date: string;
  last_open_date: string;
  last_click_date: string;
}

export interface HubSpotConversation {
  id: string;
  thread_id: string;
  contact_id: string;
  subject: string;
  content: string;
  html_content: string;
  timestamp: string;
  direction: 'INCOMING' | 'OUTGOING';
  email_status: 'SENT' | 'DELIVERED' | 'OPENED' | 'CLICKED' | 'BOUNCED';
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

export interface ConversationAnalysis {
  contact_id: string;
  analysis_date: string;
  sentiment: {
    score: number;           // -1 a 1
    confidence: number;      // 0 a 1
    trend: 'improving' | 'declining' | 'stable';
    history: {
      date: string;
      score: number;
    }[];
  };
  
  intents: {
    buying_signals: number;     // 0-100
    objections: number;         // 0-100
    interest_level: number;     // 0-100
    urgency: number;           // 0-100
    budget_mentions: number;    // 0-100
    authority_indicators: number; // 0-100
  };
  
  keywords: {
    positive: string[];         
    negative: string[];         
    technical: string[];        
    business: string[];         
    urgency: string[];
    budget: string[];
  };
  
  conversation_quality: {
    response_time_avg: number;  // horas
    message_length_avg: number; // caracteres
    question_ratio: number;     // % de mensajes con preguntas
    engagement_score: number;   // 0-100
  };
  
  predictions: {
    conversion_probability: number; // 0-100
    optimal_followup_time: string; // ISO date
    recommended_action: 'CALL' | 'EMAIL' | 'MEETING' | 'PROPOSAL' | 'NURTURE' | 'DISQUALIFY';
    confidence: number; // 0-100
  };
}

export interface ScoringFactors {
  // ICP Alignment (30%)
  icp_company_size: number;      // 0-25
  icp_industry: number;          // 0-25
  icp_role: number;             // 0-25
  icp_geography: number;        // 0-15
  icp_technology: number;       // 0-10
  
  // AI Conversation Analysis (25%)
  ai_buying_signals: number;     // 0-30
  ai_interest_level: number;     // 0-25
  ai_sentiment: number;          // 0-20
  ai_urgency: number;           // 0-15
  ai_authority: number;         // 0-10
  
  // HubSpot Engagement (25%)
  email_engagement: number;      // 0-30
  activity_frequency: number;    // 0-25
  response_velocity: number;     // 0-20
  content_interaction: number;   // 0-15
  meeting_acceptance: number;    // 0-10
  
  // Data Quality (20%)
  profile_completeness: number;  // 0-25
  data_freshness: number;        // 0-25
  contact_reachability: number;  // 0-25
  information_accuracy: number;  // 0-25
}

export interface LeadScore {
  id: string;
  lead_id: string;
  total_score: number;           // 0-100
  previous_score?: number;
  score_change: number;
  factors: ScoringFactors;
  calculated_at: string;
  expires_at: string;
  confidence: number;            // 0-100
  category: 'HOT' | 'WARM' | 'COLD' | 'QUALIFIED' | 'NURTURE' | 'DISQUALIFIED';
  recommended_actions: string[];
  notes?: string;
}

export interface HubSpotApiResponse<T> {
  results: T[];
  total?: number;
  paging?: {
    next?: {
      after: string;
      link?: string;
    };
    prev?: {
      before: string;
      link?: string;
    };
  };
}

export interface HubSpotConfig {
  api_token: string;
  portal_id: string;
  base_url: string;
  rate_limit: {
    requests_per_second: number;
    burst_limit: number;
  };
  sync_settings: {
    auto_sync: boolean;
    sync_interval: number; // minutos
    batch_size: number;
    sync_direction: 'BIDIRECTIONAL' | 'FROM_HUBSPOT' | 'TO_HUBSPOT';
  };
  scoring_settings: {
    auto_rescore: boolean;
    rescore_triggers: string[];
    ai_analysis_enabled: boolean;
    conversation_analysis_enabled: boolean;
  };
}

// Nuevos tipos para búsqueda y filtrado
export interface HubSpotFilter {
  property: string;
  operator: 'EQ' | 'NEQ' | 'LT' | 'LTE' | 'GT' | 'GTE' | 'IN' | 'NOT_IN' | 'HAS_PROPERTY' | 'NOT_HAS_PROPERTY' | 'CONTAINS_TOKEN' | 'NOT_CONTAINS_TOKEN';
  value: string;
}

export interface HubSpotSort {
  propertyName: string;
  direction: 'ASCENDING' | 'DESCENDING';
}

// Tipos para actividades
export interface HubSpotActivity {
  id: string;
  type: 'EMAIL' | 'CALL' | 'MEETING' | 'TASK' | 'NOTE' | 'LINKEDIN_MESSAGE' | 'POSTAL_MAIL';
  timestamp: string;
  subject?: string;
  body?: string;
  outcome?: string;
  duration?: number; // en minutos
  meetingOutcome?: string;
  ownerId?: string;
  properties: Record<string, any>;
}

// Mejorar propiedades de contacto
export interface HubSpotContactProperties {
  email: string;
  firstname?: string;
  lastname?: string;
  company?: string;
  jobtitle?: string;
  phone?: string;
  website?: string;
  linkedin_url?: string;
  country?: string;
  state?: string;
  city?: string;
  industry?: string;
  num_employees?: string;
  annual_revenue?: string;
  lifecycle_stage?: string;
  lead_status?: string;
  hs_lead_status?: string;
  createdate?: string;
  lastmodifieddate?: string;
  last_activity_date?: string;
  hubspot_owner_id?: string;
  hs_time_zone?: string;
  
  // Campos adicionales para scoring
  notes_last_contacted?: string;
  notes_last_activity?: string;
  hs_analytics_source?: string;
  hs_analytics_source_data_1?: string;
  hs_analytics_source_data_2?: string;
  hs_email_bounce?: string;
  hs_email_click?: string;
  hs_email_delivered?: string;
  hs_email_open?: string;
  hs_email_optout?: string;
  hs_email_replied?: string;
  hs_marketable_status?: string;
}

// Configuración avanzada de sincronización
export interface HubSpotSyncConfig {
  batchSize: number;
  rateLimitPerSecond: number;
  maxConcurrentRequests: number;
  retryAttempts: number;
  retryDelay: number;
  includedProperties: string[];
  excludedProperties: string[];
  syncDirection: 'FROM_HUBSPOT' | 'TO_HUBSPOT' | 'BIDIRECTIONAL';
  autoSync: boolean;
  syncInterval: number; // en minutos
}

// Métricas de sincronización
export interface SyncMetrics {
  startTime: Date;
  endTime?: Date;
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errors: SyncError[];
  performance: {
    averageRecordsPerSecond: number;
    totalTimeMs: number;
    apiCallsCount: number;
    rateLimitHits: number;
  };
}

export interface SyncError {
  recordId: string;
  error: string;
  timestamp: Date;
  retryCount: number;
}
