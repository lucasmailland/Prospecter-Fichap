import { Test, TestingModule } from '@nestjs/testing';
import { MailboxLayerProvider } from './mailboxlayer.provider';

describe('MailboxLayerProvider', () => {
  let provider: MailboxLayerProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailboxLayerProvider],
    }).compile();

    provider = module.get<MailboxLayerProvider>(MailboxLayerProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should have correct provider configuration', () => {
    expect(provider.provider).toBe('mailboxlayer');
    expect(provider.name).toBe('MailboxLayer');
    expect(provider.baseUrl).toBe('https://api.apilayer.com/email_validation');
    expect(provider.costPerRequest).toBe(0.01);
  });

  describe('validateEmail', () => {
    it('should reject invalid email format', async () => {
      const result = await provider.validateEmail('invalid-email');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should validate correct email format', async () => {
      // Mock the internal makeRequest method
      jest.spyOn(provider as any, 'makeRequest').mockResolvedValue({
        success: true,
        data: {
          email: 'test@example.com',
          format_valid: true,
          mx_found: true,
          smtp_check: true,
          catch_all: false,
          disposable: false,
          free_email: false,
          role: false,
          score: 100,
        },
        responseTime: 100,
      });

      const result = await provider.validateEmail('test@example.com');
      
      expect(result.success).toBe(true);
      expect(result.data.isValid).toBe(true);
      expect(result.data.score).toBe(100);
    });

    it('should handle API errors gracefully', async () => {
      jest.spyOn(provider as any, 'makeRequest').mockResolvedValue({
        success: false,
        error: 'API Error',
        responseTime: 100,
      });

      const result = await provider.validateEmail('test@example.com');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('enrichCompany', () => {
    it('should return not supported error', async () => {
      const result = await provider.enrichCompany('example.com');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Company enrichment not supported by MailboxLayer');
    });
  });

  describe('enrichPerson', () => {
    it('should return not supported error', async () => {
      const result = await provider.enrichPerson('test@example.com');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Person enrichment not supported by MailboxLayer');
    });
  });
}); 