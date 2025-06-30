import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SecurityService } from './security.service';
import { SecurityMiddleware } from './security.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60'),
        limit: parseInt(process.env.RATE_LIMIT_LIMIT || '100'),
      },
      {
        name: 'strict',
        ttl: 60,
        limit: 10,
      },
      {
        name: 'login',
        ttl: 300,
        limit: 5,
      },
    ]),
  ],
  providers: [
    SecurityService,
    SecurityMiddleware,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [SecurityService, SecurityMiddleware],
})
export class SecurityModule {} 