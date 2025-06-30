import { Test, TestingModule } from '@nestjs/testing';
import { EnrichmentController } from './enrichment.controller';
import { EnrichmentOrchestratorService } from '../../domain/services/enrichment-orchestrator.service';
import { Lead, LeadStatus } from '../../domain/entities/lead.entity';
import { EnrichmentLog, EnrichmentType, ApiProvider } from '../../domain/entities/enrichment-log.entity';

describe('EnrichmentController', () => {
  let controller: EnrichmentController;
  let enrichmentService: EnrichmentOrchestratorService;

  const mockEnrichmentService = {
    enrichLead: jest.fn(),
    bulkEnrich: jest.fn(),
    getEnrichmentStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrichmentController],
      providers: [
        {
          provide: EnrichmentOrchestratorService,
          useValue: mockEnrichmentService,
        },
      ],
    }).compile();

    controller = module.get<EnrichmentController>(EnrichmentController);
    enrichmentService = module.get<EnrichmentOrchestratorService>(EnrichmentOrchestratorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /enrichment/lead', () => {
    const mockLead = new Lead();
    Object.assign(mockLead, {
      id: 'test-lead-id',
      email: 'test_1751316807@test-domain.local',
      fullName: 'John Doe',
      company: 'Test Company',
      status: LeadStatus.NEW,
      score: 0,
      priority: 0,
      isEmailValid: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    it('should enrich a single lead successfully', async () => {
      const enrichDto = {
        leadId: 'test-lead-id',
        enrichmentTypes: ['email_validation', 'company_enrichment'],
      };

      const mockResult = {
        success: true,
        lead: mockLead,
        logs: [],
        totalCost: 0.03,
        totalTime: 1500,
      };

      mockEnrichmentService.enrichLead.mockResolvedValue(mockResult);

      const result = await controller.enrichLead(enrichDto);

      expect(result.success).toBe(true);
      expect(result.lead).toBeDefined();
      expect(result.totalCost).toBe(0.03);
      expect(result.totalTime).toBe(1500);
      expect(mockEnrichmentService.enrichLead).toHaveBeenCalledWith('test-lead-id', ['email_validation', 'company_enrichment']);
    });

    it('should handle enrichment failure gracefully', async () => {
      const enrichDto = {
        leadId: 'non-existent-id',
        enrichmentTypes: ['email_validation'],
      };

      const error = new Error('Lead not found');
      mockEnrichmentService.enrichLead.mockRejectedValue(error);

      await expect(controller.enrichLead(enrichDto)).rejects.toThrow('Lead not found');
      expect(mockEnrichmentService.enrichLead).toHaveBeenCalledWith('non-existent-id', ['email_validation']);
    });

    it('should enrich with default types when none specified', async () => {
      const enrichDto = {
        leadId: 'test-lead-id',
        enrichmentTypes: undefined,
      };

      const mockResult = {
        success: true,
        lead: mockLead,
        logs: [],
        totalCost: 0.05,
        totalTime: 2000,
      };

      mockEnrichmentService.enrichLead.mockResolvedValue(mockResult);

      const result = await controller.enrichLead(enrichDto);

      expect(result.success).toBe(true);
      expect(mockEnrichmentService.enrichLead).toHaveBeenCalledWith('test-lead-id', undefined);
    });
  });

  describe('POST /enrichment/bulk', () => {
    it('should enrich multiple leads successfully', async () => {
      const bulkDto = {
        leadIds: ['lead1', 'lead2', 'lead3'],
        enrichmentTypes: ['email_validation'],
      };

      const mockResults = [
        { success: true, lead: { id: 'lead1' }, logs: [], totalCost: 0.01, totalTime: 500 },
        { success: true, lead: { id: 'lead2' }, logs: [], totalCost: 0.01, totalTime: 600 },
        { success: false, lead: null, logs: [], totalCost: 0, totalTime: 0 },
      ];

      mockEnrichmentService.bulkEnrich.mockResolvedValue(mockResults);

      const result = await controller.bulkEnrich(bulkDto);

      expect(result.success).toBe(false); // false because one failed
      expect(result.results).toHaveLength(3);
      expect(result.summary.totalLeads).toBe(3);
      expect(result.summary.successful).toBe(2);
      expect(result.summary.failed).toBe(1);
      expect(mockEnrichmentService.bulkEnrich).toHaveBeenCalledWith(['lead1', 'lead2', 'lead3'], ['email_validation']);
    });
  });

  describe('GET /enrichment/providers/status', () => {
    it('should return provider status information', async () => {
      const result = await controller.getProvidersStatus();

      expect(result).toHaveProperty('providers');
      expect(Array.isArray(result.providers)).toBe(true);
      expect(result.providers.length).toBeGreaterThan(0);
      
      const firstProvider = result.providers[0];
      expect(firstProvider).toHaveProperty('name');
      expect(firstProvider).toHaveProperty('provider');
      expect(firstProvider).toHaveProperty('isActive');
      expect(firstProvider).toHaveProperty('isRateLimited');
      expect(firstProvider).toHaveProperty('remainingRequests');
    });
  });

  describe('GET /enrichment/stats', () => {
    it('should return enrichment statistics', async () => {
      const mockStats = {
        totalEnrichments: 150,
        successfulEnrichments: 142,
        failedEnrichments: 8,
        totalCost: 7.50,
        averageResponseTime: 1200,
        topProviders: [
          { provider: 'mailboxlayer', requests: 50, successRate: 0.96, totalCost: 0.50 },
        ],
        enrichmentTypes: {
          email_validation: 50,
          company_enrichment: 30,
          person_enrichment: 20,
        },
      };

      mockEnrichmentService.getEnrichmentStats.mockResolvedValue(mockStats);

      const result = await controller.getEnrichmentStats(30);

      expect(result).toEqual(mockStats);
      expect(mockEnrichmentService.getEnrichmentStats).toHaveBeenCalledWith(30);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      mockEnrichmentService.getEnrichmentStats.mockRejectedValue(error);

      await expect(controller.getEnrichmentStats()).rejects.toThrow('Database connection failed');
    });
  });
}); 