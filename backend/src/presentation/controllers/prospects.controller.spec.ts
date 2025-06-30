import { Test, TestingModule } from '@nestjs/testing';
import { ProspectsController } from './prospects.controller';
import { ProspectsService } from '../../domain/services/prospects.service';
import { Lead, LeadStatus, LeadSource } from '../../domain/entities/lead.entity';
import { CreateProspectDto } from '../dto/create-prospect.dto';
import { UpdateProspectDto } from '../dto/update-prospect.dto';

// Helper function to generate secure test emails dynamically
function generateSecureTestEmail(): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  return `test_${timestamp}_${randomId}@secure-test-domain.local`;
}

// Helper function to generate test data with dynamic values
function createTestProspectData(overrides: Partial<CreateProspectDto> = {}): CreateProspectDto {
  return {
    email: generateSecureTestEmail(),
    name: 'John Doe Test',
    company: 'Test Company Inc',
    phone: '+1234567890',
    ...overrides
  };
}

describe('ProspectsController', () => {
  let controller: ProspectsController;
  let prospectsService: ProspectsService;

  const mockProspectsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProspectsController],
      providers: [
        {
          provide: ProspectsService,
          useValue: mockProspectsService,
        },
      ],
    }).compile();

    controller = module.get<ProspectsController>(ProspectsController);
    prospectsService = module.get<ProspectsService>(ProspectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /prospects', () => {
    const createProspectDto = createTestProspectData();

    const mockLead = new Lead();
    Object.assign(mockLead, {
      id: 'test-lead-id',
      email: createProspectDto.email,
      fullName: createProspectDto.name,
      company: createProspectDto.company,
      phone: createProspectDto.phone,
      status: LeadStatus.NEW,
      source: LeadSource.MANUAL,
      score: 0,
      priority: 0,
      isEmailValid: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    it('should create a new prospect successfully', async () => {
      mockProspectsService.create.mockResolvedValue(mockLead);

      const result = await controller.create(createProspectDto);

      expect(result).toEqual(mockLead);
      expect(mockProspectsService.create).toHaveBeenCalledWith(createProspectDto);
    });

    it('should handle creation failure', async () => {
      const error = new Error('Email already exists');
      mockProspectsService.create.mockRejectedValue(error);

      await expect(controller.create(createProspectDto)).rejects.toThrow('Email already exists');
      expect(mockProspectsService.create).toHaveBeenCalledWith(createProspectDto);
    });
  });

  describe('GET /prospects', () => {
    it('should return all prospects', async () => {
      const mockLeads = [
        { 
          id: 'lead1', 
          email: generateSecureTestEmail(), 
          status: LeadStatus.NEW 
        },
        { 
          id: 'lead2', 
          email: generateSecureTestEmail(), 
          status: LeadStatus.VALIDATED 
        },
      ];

      mockProspectsService.findAll.mockResolvedValue(mockLeads);

      const result = await controller.findAll();

      expect(result).toEqual(mockLeads);
      expect(mockProspectsService.findAll).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      mockProspectsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('GET /prospects/:id', () => {
    it('should return a specific prospect', async () => {
      const testEmail = generateSecureTestEmail();
      const mockLead = new Lead();
      Object.assign(mockLead, {
        id: 'test-lead-id',
        email: testEmail,
        fullName: 'John Doe Test',
        status: LeadStatus.NEW,
      });

      mockProspectsService.findOne.mockResolvedValue(mockLead);

      const result = await controller.findOne('test-lead-id');

      expect(result).toEqual(mockLead);
      expect(mockProspectsService.findOne).toHaveBeenCalledWith('test-lead-id');
    });

    it('should handle prospect not found', async () => {
      mockProspectsService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('PUT /prospects/:id', () => {
    const updateProspectDto: UpdateProspectDto = {
      name: 'Jane Smith Test',
      company: 'Updated Test Company',
    };

    it('should update a prospect successfully', async () => {
      const testEmail = generateSecureTestEmail();
      const mockUpdatedLead = new Lead();
      Object.assign(mockUpdatedLead, {
        id: 'test-lead-id',
        email: testEmail,
        fullName: 'Jane Smith Test',
        company: 'Updated Test Company',
        status: LeadStatus.NEW,
      });

      mockProspectsService.update.mockResolvedValue(mockUpdatedLead);

      const result = await controller.update('test-lead-id', updateProspectDto);

      expect(result).toEqual(mockUpdatedLead);
      expect(mockProspectsService.update).toHaveBeenCalledWith('test-lead-id', updateProspectDto);
    });

    it('should handle update failure', async () => {
      const error = new Error('Prospect not found');
      mockProspectsService.update.mockRejectedValue(error);

      await expect(controller.update('non-existent-id', updateProspectDto)).rejects.toThrow('Prospect not found');
    });
  });

  describe('DELETE /prospects/:id', () => {
    it('should delete a prospect successfully', async () => {
      mockProspectsService.remove.mockResolvedValue(true);

      const result = await controller.remove('test-lead-id');

      expect(result).toBe(true);
      expect(mockProspectsService.remove).toHaveBeenCalledWith('test-lead-id');
    });

    it('should handle deletion failure', async () => {
      const error = new Error('Prospect not found');
      mockProspectsService.remove.mockRejectedValue(error);

      await expect(controller.remove('non-existent-id')).rejects.toThrow('Prospect not found');
    });
  });
}); 