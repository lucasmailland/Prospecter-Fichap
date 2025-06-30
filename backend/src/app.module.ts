import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule } from '@nestjs/schedule';

// Controllers
import { HealthController } from './presentation/controllers/health.controller';
import { ProspectsController } from './presentation/controllers/prospects.controller';
import { EnrichmentController } from './presentation/controllers/enrichment.controller';
import { SecurityController } from './presentation/controllers/security.controller';

// Services
import { ProspectsService } from './domain/services/prospects.service';
import { EnrichmentOrchestratorService } from './domain/services/enrichment-orchestrator.service';
import { NotificationService } from './infrastructure/messaging/notification.service';

// Entities
import { Lead } from './domain/entities/lead.entity';
import { EnrichmentLog } from './domain/entities/enrichment-log.entity';
import { User } from './infrastructure/users/entities/user.entity';

// API Providers
import { MailboxLayerProvider } from './infrastructure/external/providers/mailboxlayer.provider';
import { HunterProvider } from './infrastructure/external/providers/hunter.provider';
import { ClearbitProvider } from './infrastructure/external/providers/clearbit.provider';

// Security
import { SecurityModule } from './infrastructure/security/security.module';
import { SecurityMiddleware } from './infrastructure/security/security.middleware';

// Auth
import { AuthModule } from './infrastructure/auth/auth.module';

// Users
import { UsersModule } from './infrastructure/users/users.module';

// Pentest
import { PentestModule } from './infrastructure/security/pentest/pentest.module';

@Module({
  imports: [
    // Configuración
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Base de datos
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Lead, EnrichmentLog, User],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    
    // Entidades para TypeORM
    TypeOrmModule.forFeature([Lead, EnrichmentLog, User]),
    
    // Rate limiting (configurado en SecurityModule)
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
        limit: parseInt(process.env.RATE_LIMIT_LIMIT, 10) || 100,
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
    
    // Health checks
    TerminusModule,
    
    // Scheduling para tareas automáticas
    ScheduleModule.forRoot(),
    
    // Módulo de seguridad
    SecurityModule,
    
    // Módulo de autenticación
    AuthModule,
    
    // Módulo de usuarios
    UsersModule,
    
    // Módulo de pentesting
    PentestModule,
  ],
  controllers: [
    HealthController,
    ProspectsController,
    EnrichmentController,
    SecurityController,
  ],
  providers: [
    ProspectsService,
    EnrichmentOrchestratorService,
    NotificationService,
    MailboxLayerProvider,
    HunterProvider,
    ClearbitProvider,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SecurityMiddleware)
      .forRoutes(
        { path: '*', method: RequestMethod.ALL },
      );
  }
} 