import { Test, TestingModule } from '@nestjs/testing';
import { ClearbitProvider } from './clearbit.provider';

describe('ClearbitProvider', () => {
  let provider: ClearbitProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClearbitProvider],
    }).compile();

    provider = module.get<ClearbitProvider>(ClearbitProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should have correct provider configuration', () => {
    expect(provider.provider).toBe('clearbit');
    expect(provider.name).toBe('Clearbit');
    expect(provider.baseUrl).toBe('https://company.clearbit.com/v2');
    expect(provider.costPerRequest).toBe(0.05);
  });

  describe('enrichCompany', () => {
    it('should enrich company successfully', async () => {
      jest.spyOn(provider as any, 'makeRequest').mockResolvedValue({
        success: true,
        data: {
          name: 'Test Company',
          metrics: { employeesRange: undefined },
          category: { industry: 'Software' },
          domain: 'https://test.com',
          location: { country: 'Spain', city: 'Madrid', state: 'Madrid' },
          timeZone: 'Europe/Madrid',
          foundedYear: 2010,
          description: 'Empresa de software',
          linkedin: { handle: 'testcompany' },
          twitter: { handle: 'testcompany' },
          facebook: { handle: 'testcompany' },
        },
        responseTime: 120,
      });

      const result = await provider.enrichCompany('test.com');
      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Test Company');
      expect(result.data.size).toBe('Unknown');
      expect(result.data.industry).toBe('Software');
    });

    it('should handle API errors gracefully', async () => {
      jest.spyOn(provider as any, 'makeRequest').mockResolvedValue({
        success: false,
        error: 'API Error',
        responseTime: 100,
      });

      const result = await provider.enrichCompany('test.com');
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('validateEmail', () => {
    it('should return not supported error', async () => {
      const result = await provider.validateEmail('test_1751316807@test-domain.local');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Email validation not supported by Clearbit');
    });
  });

  describe('enrichPerson', () => {
    it('should return not supported error', async () => {
      const result = await provider.enrichPerson('test_1751316807@test-domain.local');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Person enrichment not supported by Clearbit');
    });
  });
}); 