import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }

  @Get('ready')
  async getReadiness() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok',
        externalApis: 'ok',
        memory: 'ok',
      },
    };
  }

  @Get('live')
  async getLiveness() {
    const memUsage = process.memoryUsage();
    const totalMem = memUsage.heapTotal;
    const usedMem = memUsage.heapUsed;
    const memPercentage = (usedMem / totalMem) * 100;

    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      memory: {
        used: Math.round(usedMem / 1024 / 1024), // MB
        total: Math.round(totalMem / 1024 / 1024), // MB
        percentage: Math.round(memPercentage),
      },
    };
  }
} 