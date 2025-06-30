import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, LeadStatus } from '../entities/lead.entity';
import { EnrichmentLog, EnrichmentType, EnrichmentStatus, ApiProvider } from '../entities/enrichment-log.entity';
import { IApiProvider, EmailValidationResult, CompanyEnrichmentResult, PersonEnrichmentResult } from '../../infrastructure/external/api-provider.interface';
import { MailboxLayerProvider } from '../../infrastructure/external/providers/mailboxlayer.provider';
import { HunterProvider } from '../../infrastructure/external/providers/hunter.provider';
import { ClearbitProvider } from '../../infrastructure/external/providers/clearbit.provider';

export interface EnrichmentResult {
  success: boolean;
  lead: Lead;
  logs: EnrichmentLog[];
  totalCost: number;
  totalTime: number;
}

export interface ScoringFactors {
  emailValidation: number;
  companySize: number;
  industry: number;
  location: number;
  jobTitle: number;
  socialPresence: number;
  companyRevenue: number;
  employeeCount: number;
}

@Injectable()
export class EnrichmentOrchestratorService {
  private readonly logger = new Logger(EnrichmentOrchestratorService.name);
  private readonly providers: Map<ApiProvider, IApiProvider> = new Map();

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(EnrichmentLog)
    private readonly enrichmentLogRepository: Repository<EnrichmentLog>,
    private readonly mailboxLayerProvider: MailboxLayerProvider,
    private readonly hunterProvider: HunterProvider,
    private readonly clearbitProvider: ClearbitProvider,
  ) {
    // Registrar proveedores en orden de prioridad
    this.providers.set(ApiProvider.MAILBOXLAYER, mailboxLayerProvider);
    this.providers.set(ApiProvider.HUNTER, hunterProvider);
    this.providers.set(ApiProvider.CLEARBIT, clearbitProvider);
  }

  async enrichLead(leadId: string, enrichmentTypes?: string[]): Promise<EnrichmentResult> {
    const startTime = Date.now();
    const logs: EnrichmentLog[] = [];
    let totalCost = 0;

    // Obtener el lead
    const lead = await this.leadRepository.findOne({ where: { id: leadId } });
    if (!lead) {
      throw new Error(`Lead with ID ${leadId} not found`);
    }

    try {
      this.logger.log(`Starting enrichment for lead: ${lead.email}`);

      // Determinar tipos de enriquecimiento a realizar
      const typesToEnrich = enrichmentTypes || ['email_validation', 'company_enrichment', 'person_enrichment'];

      // 1. Validación de email
      if (typesToEnrich.includes('email_validation')) {
        const emailResult = await this.validateEmail(lead.email);
        logs.push(...emailResult.logs);
        totalCost += emailResult.cost;

        if (emailResult.success && emailResult.data) {
          lead.isEmailValid = emailResult.data.isValid;
          lead.emailValidationScore = emailResult.data.score;
          lead.emailValidationDetails = emailResult.data.details;
          lead.validatedAt = new Date();
        } else {
          lead.isEmailValid = false;
        }
      }

      // 2. Enriquecimiento de empresa
      if (typesToEnrich.includes('company_enrichment') && lead.company) {
        const domain = this.extractDomainFromEmail(lead.email) || lead.website;
        if (domain) {
          const companyResult = await this.enrichCompany(domain);
          logs.push(...companyResult.logs);
          totalCost += companyResult.cost;

          if (companyResult.success && companyResult.data) {
            this.updateLeadWithCompanyData(lead, companyResult.data);
          }
        }
      }

      // 3. Enriquecimiento de persona
      if (typesToEnrich.includes('person_enrichment')) {
        const personResult = await this.enrichPerson(lead.email);
        logs.push(...personResult.logs);
        totalCost += personResult.cost;

        if (personResult.success && personResult.data) {
          this.updateLeadWithPersonData(lead, personResult.data);
        }
      }

      // 4. Calcular scoring y priorización
      if (typesToEnrich.includes('scoring')) {
        const scoringResult = await this.calculateScoring(lead);
        logs.push(...scoringResult.logs);
        totalCost += scoringResult.cost;

        if (scoringResult.success) {
          lead.score = scoringResult.score;
          lead.priority = scoringResult.priority;
          lead.scoringFactors = JSON.stringify(scoringResult.factors);
        }
      }

      // 5. Actualizar estado del lead
      lead.status = this.determineLeadStatus(lead);
      lead.enrichedAt = new Date();

      // 6. Guardar lead y logs
      await this.leadRepository.save(lead);
      await this.enrichmentLogRepository.save(logs);

      const totalTime = Date.now() - startTime;

      this.logger.log(`Enrichment completed for lead: ${lead.email} in ${totalTime}ms`);

      return {
        success: true,
        lead,
        logs,
        totalCost,
        totalTime,
      };

    } catch (error) {
      this.logger.error(`Enrichment failed for lead ${leadId}: ${error.message}`);
      const totalTime = Date.now() - startTime;
      throw error;
    }
  }

  async bulkEnrich(leadIds: string[], enrichmentTypes?: string[]): Promise<EnrichmentResult[]> {
    const results: EnrichmentResult[] = [];
    
    for (const leadId of leadIds) {
      try {
        const result = await this.enrichLead(leadId, enrichmentTypes);
        results.push(result);
        
        // Pausa entre enriquecimientos para evitar rate limiting
        await this.sleep(1000);
      } catch (error) {
        this.logger.error(`Bulk enrichment failed for lead ${leadId}: ${error.message}`);
        results.push({
          success: false,
          lead: null,
          logs: [],
          totalCost: 0,
          totalTime: 0,
        });
      }
    }

    return results;
  }

  private async validateEmail(email: string): Promise<{ success: boolean; data?: EmailValidationResult; logs: EnrichmentLog[]; cost: number }> {
    const logs: EnrichmentLog[] = [];
    let totalCost = 0;

    // Intentar con MailboxLayer primero
    if (this.mailboxLayerProvider.isActive && !this.mailboxLayerProvider.isRateLimited()) {
      const log = await this.createEnrichmentLog(EnrichmentType.EMAIL_VALIDATION, ApiProvider.MAILBOXLAYER);
      
      try {
        const response = await this.mailboxLayerProvider.validateEmail(email);
        
        log.status = response.success ? EnrichmentStatus.SUCCESS : EnrichmentStatus.FAILED;
        log.responseData = JSON.stringify(response);
        log.responseTime = response.responseTime;
        log.cost = response.cost || 0;
        log.errorMessage = response.error;
        log.completedAt = new Date();
        
        logs.push(log);
        totalCost += log.cost;

        if (response.success && response.data) {
          return { success: true, data: response.data, logs, cost: totalCost };
        }
      } catch (error) {
        log.status = EnrichmentStatus.FAILED;
        log.errorMessage = error.message;
        log.completedAt = new Date();
        logs.push(log);
      }
    }

    // Fallback a Hunter
    if (this.hunterProvider.isActive && !this.hunterProvider.isRateLimited()) {
      const log = await this.createEnrichmentLog(EnrichmentType.EMAIL_VALIDATION, ApiProvider.HUNTER);
      
      try {
        const response = await this.hunterProvider.validateEmail(email);
        
        log.status = response.success ? EnrichmentStatus.SUCCESS : EnrichmentStatus.FAILED;
        log.responseData = JSON.stringify(response);
        log.responseTime = response.responseTime;
        log.cost = response.cost || 0;
        log.errorMessage = response.error;
        log.completedAt = new Date();
        
        logs.push(log);
        totalCost += log.cost;

        if (response.success && response.data) {
          return { success: true, data: response.data, logs, cost: totalCost };
        }
      } catch (error) {
        log.status = EnrichmentStatus.FAILED;
        log.errorMessage = error.message;
        log.completedAt = new Date();
        logs.push(log);
      }
    }

    return { success: false, logs, cost: totalCost };
  }

  private async enrichCompany(domain: string): Promise<{ success: boolean; data?: CompanyEnrichmentResult; logs: EnrichmentLog[]; cost: number }> {
    const logs: EnrichmentLog[] = [];
    let totalCost = 0;

    // Intentar con Clearbit
    if (this.clearbitProvider.isActive && !this.clearbitProvider.isRateLimited()) {
      const log = await this.createEnrichmentLog(EnrichmentType.COMPANY_ENRICHMENT, ApiProvider.CLEARBIT);
      
      try {
        const response = await this.clearbitProvider.enrichCompany(domain);
        
        log.status = response.success ? EnrichmentStatus.SUCCESS : EnrichmentStatus.FAILED;
        log.responseData = JSON.stringify(response);
        log.responseTime = response.responseTime;
        log.cost = response.cost || 0;
        log.errorMessage = response.error;
        log.completedAt = new Date();
        
        logs.push(log);
        totalCost += log.cost;

        if (response.success && response.data) {
          return { success: true, data: response.data, logs, cost: totalCost };
        }
      } catch (error) {
        log.status = EnrichmentStatus.FAILED;
        log.errorMessage = error.message;
        log.completedAt = new Date();
        logs.push(log);
      }
    }

    return { success: false, logs, cost: totalCost };
  }

  private async enrichPerson(email: string): Promise<{ success: boolean; data?: PersonEnrichmentResult; logs: EnrichmentLog[]; cost: number }> {
    const logs: EnrichmentLog[] = [];
    let totalCost = 0;

    // Intentar con Hunter
    if (this.hunterProvider.isActive && !this.hunterProvider.isRateLimited()) {
      const log = await this.createEnrichmentLog(EnrichmentType.PERSON_ENRICHMENT, ApiProvider.HUNTER);
      
      try {
        const response = await this.hunterProvider.enrichPerson(email);
        
        log.status = response.success ? EnrichmentStatus.SUCCESS : EnrichmentStatus.FAILED;
        log.responseData = JSON.stringify(response);
        log.responseTime = response.responseTime;
        log.cost = response.cost || 0;
        log.errorMessage = response.error;
        log.completedAt = new Date();
        
        logs.push(log);
        totalCost += log.cost;

        if (response.success && response.data) {
          return { success: true, data: response.data, logs, cost: totalCost };
        }
      } catch (error) {
        log.status = EnrichmentStatus.FAILED;
        log.errorMessage = error.message;
        log.completedAt = new Date();
        logs.push(log);
      }
    }

    return { success: false, logs, cost: totalCost };
  }

  private async calculateScoring(lead: Lead): Promise<{ success: boolean; score: number; priority: number; factors: ScoringFactors; logs: EnrichmentLog[]; cost: number }> {
    const logs: EnrichmentLog[] = [];
    const factors: ScoringFactors = {
      emailValidation: 0,
      companySize: 0,
      industry: 0,
      location: 0,
      jobTitle: 0,
      socialPresence: 0,
      companyRevenue: 0,
      employeeCount: 0,
    };

    let totalScore = 0;
    let totalCost = 0;

    // Factor 1: Validación de email (25 puntos)
    if (lead.isEmailValid) {
      factors.emailValidation = 25;
      totalScore += 25;
    }

    // Factor 2: Tamaño de la empresa (20 puntos)
    if (lead.companySize) {
      const sizeScore = this.calculateCompanySizeScore(lead.companySize);
      factors.companySize = sizeScore;
      totalScore += sizeScore;
    }

    // Factor 3: Industria (15 puntos)
    if (lead.industry) {
      const industryScore = this.calculateIndustryScore(lead.industry);
      factors.industry = industryScore;
      totalScore += industryScore;
    }

    // Factor 4: Ubicación (10 puntos)
    if (lead.country && lead.country.toLowerCase() === 'spain') {
      factors.location = 10;
      totalScore += 10;
    }

    // Factor 5: Cargo (15 puntos)
    if (lead.jobTitle) {
      const jobScore = this.calculateJobTitleScore(lead.jobTitle);
      factors.jobTitle = jobScore;
      totalScore += jobScore;
    }

    // Factor 6: Presencia social (10 puntos)
    if (lead.linkedinUrl) {
      factors.socialPresence = 10;
      totalScore += 10;
    }

    // Factor 7: Ingresos de la empresa (5 puntos)
    if (lead.metadata?.revenue) {
      factors.companyRevenue = 5;
      totalScore += 5;
    }

    // Calcular prioridad basada en el score
    const priority = this.calculatePriority(totalScore);

    return {
      success: true,
      score: Math.min(100, totalScore),
      priority,
      factors,
      logs,
      cost: totalCost,
    };
  }

  private calculateCompanySizeScore(size: string): number {
    const sizeLower = size.toLowerCase();
    
    if (sizeLower.includes('1000+') || sizeLower.includes('10000+')) return 20;
    if (sizeLower.includes('500+') || sizeLower.includes('1000')) return 15;
    if (sizeLower.includes('100+') || sizeLower.includes('500')) return 10;
    if (sizeLower.includes('50+') || sizeLower.includes('100')) return 5;
    
    return 0;
  }

  private calculateIndustryScore(industry: string): number {
    const industryLower = industry.toLowerCase();
    
    // Industrias de alto valor
    const highValueIndustries = ['technology', 'software', 'fintech', 'healthcare', 'ecommerce'];
    if (highValueIndustries.some(ind => industryLower.includes(ind))) return 15;
    
    // Industrias de valor medio
    const mediumValueIndustries = ['consulting', 'marketing', 'finance', 'real estate'];
    if (mediumValueIndustries.some(ind => industryLower.includes(ind))) return 10;
    
    return 5;
  }

  private calculateJobTitleScore(jobTitle: string): number {
    const titleLower = jobTitle.toLowerCase();
    
    // Cargos de decisión
    const decisionMakers = ['ceo', 'cto', 'cfo', 'director', 'manager', 'head', 'vp', 'president'];
    if (decisionMakers.some(title => titleLower.includes(title))) return 15;
    
    // Cargos técnicos
    const technicalRoles = ['engineer', 'developer', 'architect', 'lead', 'senior'];
    if (technicalRoles.some(title => titleLower.includes(title))) return 10;
    
    return 5;
  }

  private calculatePriority(score: number): number {
    if (score >= 80) return 10;
    if (score >= 70) return 9;
    if (score >= 60) return 8;
    if (score >= 50) return 7;
    if (score >= 40) return 6;
    if (score >= 30) return 5;
    if (score >= 20) return 4;
    if (score >= 10) return 3;
    return 1;
  }

  private determineLeadStatus(lead: Lead): LeadStatus {
    if (lead.score >= 80 && lead.isEmailValid) return LeadStatus.PRIORITIZED;
    if (lead.isEmailValid) return LeadStatus.VALIDATED;
    if (lead.enrichedAt) return LeadStatus.ENRICHED;
    return LeadStatus.NEW;
  }

  private updateLeadWithCompanyData(lead: Lead, companyData: CompanyEnrichmentResult): void {
    if (companyData.name && !lead.company) lead.company = companyData.name;
    if (companyData.size) lead.companySize = companyData.size;
    if (companyData.industry) lead.industry = companyData.industry;
    if (companyData.website) lead.website = companyData.website;
    if (companyData.location) lead.location = companyData.location;
    if (companyData.country) lead.country = companyData.country;
    if (companyData.city) lead.city = companyData.city;
    if (companyData.state) lead.state = companyData.state;
    if (companyData.timezone) lead.timezone = companyData.timezone;
    if (companyData.language) lead.language = companyData.language;
    if (companyData.socialProfiles?.linkedin) lead.linkedinUrl = companyData.socialProfiles.linkedin;

    // Guardar datos adicionales en metadata
    if (!lead.metadata) lead.metadata = {};
    if (companyData.founded) lead.metadata.founded = companyData.founded;
    if (companyData.revenue) lead.metadata.revenue = companyData.revenue;
    if (companyData.employees) lead.metadata.employees = companyData.employees;
    if (companyData.description) lead.metadata.description = companyData.description;
  }

  private updateLeadWithPersonData(lead: Lead, personData: PersonEnrichmentResult): void {
    if (personData.firstName && !lead.firstName) lead.firstName = personData.firstName;
    if (personData.lastName && !lead.lastName) lead.lastName = personData.lastName;
    if (personData.fullName && !lead.fullName) lead.fullName = personData.fullName;
    if (personData.jobTitle && !lead.jobTitle) lead.jobTitle = personData.jobTitle;
    if (personData.company && !lead.company) lead.company = personData.company;
    if (personData.location && !lead.location) lead.location = personData.location;
    if (personData.timezone && !lead.timezone) lead.timezone = personData.timezone;
    if (personData.language && !lead.language) lead.language = personData.language;
    if (personData.linkedinUrl && !lead.linkedinUrl) lead.linkedinUrl = personData.linkedinUrl;

    // Guardar datos adicionales en metadata
    if (!lead.metadata) lead.metadata = {};
    if (personData.bio) lead.metadata.bio = personData.bio;
    if (personData.avatar) lead.metadata.avatar = personData.avatar;
  }

  private extractDomainFromEmail(email: string): string {
    return email.split('@')[1]?.toLowerCase() || '';
  }

  private async createEnrichmentLog(type: EnrichmentType, provider: ApiProvider): Promise<EnrichmentLog> {
    const log = new EnrichmentLog();
    log.type = type;
    log.provider = provider;
    log.status = EnrichmentStatus.IN_PROGRESS;
    return log;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
} 