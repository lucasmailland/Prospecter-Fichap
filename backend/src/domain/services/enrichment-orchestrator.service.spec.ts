import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrichmentOrchestratorService } from './enrichment-orchestrator.service';
import { Lead, LeadStatus } from '../entities/lead.entity';
import { EnrichmentLog, EnrichmentType, ApiProvider } from '../entities/enrichment-log.entity';
import { MailboxLayerProvider } from '../../infrastructure/external/providers/mailboxlayer.provider';
import { HunterProvider } from '../../infrastructure/external/providers/hunter.provider';
import { ClearbitProvider } from '../../infrastructure/external/providers/clearbit.provider';

describe('EnrichmentOrchestratorService', () => {
  let service: EnrichmentOrchestratorService;
  let leadRepository: Repository<Lead>;
  let enrichmentLogRepository: Repository<EnrichmentLog>;
  let mailboxLayerProvider: MailboxLayerProvider;
  let hunterProvider: HunterProvider;
  let clearbitProvider: ClearbitProvider;

  const mockLeadRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
  };

  const mockEnrichmentLogRepository = {
    save: jest.fn(),
  };

  const mockMailboxLayerProvider = {
    isActive: true,
    isRateLimited: jest.fn().mockReturnValue(false),
    validateEmail: jest.fn(),
  };

  const mockHunterProvider = {
    isActive: true,
    isRateLimited: jest.fn().mockReturnValue(false),
    validateEmail: jest.fn(),
    enrichPerson: jest.fn(),
  };

  const mockClearbitProvider = {
    isActive: true,
    isRateLimited: jest.fn().mockReturnValue(false),
    enrichCompany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrichmentOrchestratorService,
        {
          provide: getRepositoryToken(Lead),
          useValue: mockLeadRepository,
        },
        {
          provide: getRepositoryToken(EnrichmentLog),
          useValue: mockEnrichmentLogRepository,
        },
        {
          provide: MailboxLayerProvider,
          useValue: mockMailboxLayerProvider,
        },
        {
          provide: HunterProvider,
          useValue: mockHunterProvider,
        },
        {
          provide: ClearbitProvider,
          useValue: mockClearbitProvider,
        },
      ],
    }).compile();

    service = module.get<EnrichmentOrchestratorService>(EnrichmentOrchestratorService);
    leadRepository = module.get<Repository<Lead>>(getRepositoryToken(Lead));
    enrichmentLogRepository = module.get<Repository<EnrichmentLog>>(getRepositoryToken(EnrichmentLog));
    mailboxLayerProvider = module.get<MailboxLayerProvider>(MailboxLayerProvider);
    hunterProvider = module.get<HunterProvider>(HunterProvider);
    clearbitProvider = module.get<ClearbitProvider>(ClearbitProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('enrichLead', () => {
    const mockLead: Lead = {
      id: 'test-lead-id',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      company: 'Test Company',
      status: LeadStatus.NEW,
      score: 0,
      priority: 0,
      isEmailValid: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Lead;

    it('should enrich a lead successfully', async () => {
      // Arrange
      mockLeadRepository.findOne.mockResolvedValue(mockLead);
      mockLeadRepository.save.mockResolvedValue(mockLead);
      mockEnrichmentLogRepository.save.mockResolvedValue([]);

      mockMailboxLayerProvider.validateEmail.mockResolvedValue({
        success: true,
        data: {
          isValid: true,
          score: 85,
          details: 'Email válido',
        },
        cost: 0.01,
        responseTime: 100,
      });

      // Act
      const result = await service.enrichLead('test-lead-id', ['email_validation']);

      // Assert
      expect(result.success).toBe(true);
      expect(result.lead.isEmailValid).toBe(true);
      expect(result.lead.emailValidationScore).toBe(85);
      expect(result.totalCost).toBe(0.01);
      expect(mockLeadRepository.save).toHaveBeenCalled();
    });

    it('should handle lead not found', async () => {
      // Arrange
      mockLeadRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.enrichLead('non-existent-id')).rejects.toThrow('Lead with ID non-existent-id not found');
    });

    it('should handle provider errors gracefully', async () => {
      // Arrange
      mockLeadRepository.findOne.mockResolvedValue(mockLead);
      mockMailboxLayerProvider.validateEmail.mockResolvedValue({
        success: false,
        error: 'API error',
        responseTime: 100,
      });

      // Act
      const result = await service.enrichLead('test-lead-id', ['email_validation']);

      // Assert
      expect(result.success).toBe(true); // Service should still succeed even if enrichment fails
      expect(result.lead.isEmailValid).toBe(false);
    });
  });

  describe('bulkEnrich', () => {
    it('should enrich multiple leads', async () => {
      // Arrange
      const mockLead = {
        id: 'test-lead-id',
        email: 'test@example.com',
        status: LeadStatus.NEW,
        score: 0,
        priority: 0,
        isEmailValid: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Lead;

      mockLeadRepository.findOne.mockResolvedValue(mockLead);
      mockLeadRepository.save.mockResolvedValue(mockLead);
      mockEnrichmentLogRepository.save.mockResolvedValue([]);

      mockMailboxLayerProvider.validateEmail.mockResolvedValue({
        success: true,
        data: {
          isValid: true,
          score: 85,
          details: 'Email válido',
        },
        cost: 0.01,
        responseTime: 100,
      });

      // Act
      const results = await service.bulkEnrich(['lead1', 'lead2'], ['email_validation']);

      // Assert
      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
    });
  });
}); 