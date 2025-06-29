import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;
  let typeOrmHealthIndicator: TypeOrmHealthIndicator;

  const mockHealthCheckService = {
    check: jest.fn(),
  };

  const mockTypeOrmHealthIndicator = {
    pingCheck: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: mockTypeOrmHealthIndicator,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
    typeOrmHealthIndicator = module.get<TypeOrmHealthIndicator>(TypeOrmHealthIndicator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const mockHealthResult = {
        status: 'ok',
        info: {
          database: {
            status: 'up',
          },
        },
        error: {},
        details: {
          database: {
            status: 'up',
          },
        },
      };

      mockHealthCheckService.check.mockResolvedValue(mockHealthResult);

      const result = await controller.check();

      expect(result).toEqual(mockHealthResult);
      expect(mockHealthCheckService.check).toHaveBeenCalledWith([
        expect.any(Function),
      ]);
    });

    it('should include database health check', async () => {
      const mockHealthResult = {
        status: 'ok',
        info: {
          database: {
            status: 'up',
          },
        },
        error: {},
        details: {
          database: {
            status: 'up',
          },
        },
      };

      mockHealthCheckService.check.mockResolvedValue(mockHealthResult);

      await controller.check();

      expect(mockHealthCheckService.check).toHaveBeenCalledWith([
        expect.any(Function),
      ]);
    });

    it('should handle health check failure', async () => {
      const mockHealthResult = {
        status: 'error',
        info: {},
        error: {
          database: {
            status: 'down',
            message: 'Database connection failed',
          },
        },
        details: {
          database: {
            status: 'down',
            message: 'Database connection failed',
          },
        },
      };

      mockHealthCheckService.check.mockResolvedValue(mockHealthResult);

      const result = await controller.check();

      expect(result.status).toBe('error');
      expect(result.error.database.status).toBe('down');
    });
  });

  describe('GET /health/ready', () => {
    it('should return ready status', async () => {
      const result = await controller.getReadiness();

      expect(result).toEqual({
        status: 'ready',
        timestamp: expect.any(String),
        checks: {
          database: 'ok',
          externalApis: 'ok',
          memory: 'ok',
        },
      });
    });

    it('should include all required readiness check fields', async () => {
      const result = await controller.getReadiness();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('checks');
      expect(result.checks).toHaveProperty('database');
      expect(result.checks).toHaveProperty('externalApis');
      expect(result.checks).toHaveProperty('memory');
    });

    it('should return ready status when all checks pass', async () => {
      const result = await controller.getReadiness();

      expect(result.status).toBe('ready');
      expect(result.checks.database).toBe('ok');
      expect(result.checks.externalApis).toBe('ok');
      expect(result.checks.memory).toBe('ok');
    });
  });

  describe('GET /health/live', () => {
    it('should return liveness status', async () => {
      const result = await controller.getLiveness();

      expect(result).toEqual({
        status: 'alive',
        timestamp: expect.any(String),
        memory: {
          used: expect.any(Number),
          total: expect.any(Number),
          percentage: expect.any(Number),
        },
      });
    });

    it('should include all required liveness check fields', async () => {
      const result = await controller.getLiveness();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('memory');
      expect(result.memory).toHaveProperty('used');
      expect(result.memory).toHaveProperty('total');
      expect(result.memory).toHaveProperty('percentage');
    });

    it('should return alive status', async () => {
      const result = await controller.getLiveness();

      expect(result.status).toBe('alive');
    });

    it('should return valid memory information', async () => {
      const result = await controller.getLiveness();

      expect(result.memory.used).toBeGreaterThan(0);
      expect(result.memory.total).toBeGreaterThan(0);
      expect(result.memory.percentage).toBeGreaterThan(0);
      expect(result.memory.percentage).toBeLessThanOrEqual(100);
    });
  });
}); 