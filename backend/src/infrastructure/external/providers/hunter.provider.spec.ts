import { Test, TestingModule } from '@nestjs/testing';
import { HunterProvider } from './hunter.provider';

describe('HunterProvider', () => {
  let provider: HunterProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HunterProvider],
    }).compile();

    provider = module.get<HunterProvider>(HunterProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should have correct provider configuration', () => {
    expect(provider.provider).toBe('hunter');
    expect(provider.name).toBe('Hunter');
    expect(provider.baseUrl).toBe('https://api.hunter.io/v2');
    expect(provider.costPerRequest).toBe(0.02);
  });

  describe('validateEmail', () => {
    it('should validate email successfully', async () => {
      jest.spyOn(provider as any, 'makeRequest').mockResolvedValue({
        success: true,
        data: {
          data: {
            status: 'valid',
            result: 'valid',
            score: 90,
            email: 'test_1751316807@test-domain.local',
            regexp: true,
            gibberish: false,
            disposable: false,
            webmail: false,
            mx_records: true,
            smtp_server: true,
            smtp_check: true,
            accept_all: false,
            block: false,
            sources: [],
          },
        },
        responseTime: 80,
      });

      const result = await provider.validateEmail('test_1751316807@test-domain.local');
      expect(result.success).toBe(true);
      expect(result.data.isValid).toBe(true);
      expect(result.data.score).toBeGreaterThan(0);
    });

    it('should handle API errors gracefully', async () => {
      jest.spyOn(provider as any, 'makeRequest').mockResolvedValue({
        success: false,
        error: 'API Error',
        responseTime: 100,
      });

      const result = await provider.validateEmail('test_1751316807@test-domain.local');
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('enrichCompany', () => {
    it('should return not supported error', async () => {
      const result = await provider.enrichCompany('test.com');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Company enrichment not supported by Hunter');
    });
  });

  describe('enrichPerson', () => {
    it('should enrich person successfully', async () => {
      jest.spyOn(provider as any, 'makeRequest').mockResolvedValue({
        success: true,
        data: {
          data: {
            email: 'test_1751316807@test-domain.local',
            first_name: 'John',
            last_name: 'Doe',
            score: 90,
            domain: 'Test Company',
            accept_all: false,
            role: false,
            disposable: false,
            free_email: false,
            mx_record: true,
            smtp_server: true,
            smtp_check: true,
            catch_all: false,
            lead: false,
            sources: [
              { domain: 'linkedin.com', uri: 'https://linkedin.com/in/johndoe', extracted_on: '', last_seen_on: '', still_on_page: true },
            ],
          },
        },
        responseTime: 90,
      });

      const result = await provider.enrichPerson('test_1751316807@test-domain.local');
      expect(result.success).toBe(true);
      expect(result.data.firstName).toBe('John');
      expect(result.data.jobTitle).toBeUndefined();
    });

    it('should handle API errors gracefully', async () => {
      jest.spyOn(provider as any, 'makeRequest').mockResolvedValue({
        success: false,
        error: 'API Error',
        responseTime: 100,
      });

      const result = await provider.enrichPerson('test_1751316807@test-domain.local');
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });
}); 