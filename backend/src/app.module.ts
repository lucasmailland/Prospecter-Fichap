import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';

import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProspectsModule } from './prospects/prospects.module';
import { HubspotModule } from './hubspot/hubspot.module';
import { TasksModule } from './tasks/tasks.module';
import { AiModule } from './ai/ai.module';
import { SecurityModule } from './security/security.module';
import { SettingsModule } from './settings/settings.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    
    // Programación de tareas
    ScheduleModule.forRoot(),
    
    // Cache
    CacheModule.register({
      isGlobal: true,
      ttl: 5000,
      max: 10,
    }),
    
    // Módulos de la aplicación
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProspectsModule,
    HubspotModule,
    TasksModule,
    AiModule,
    SecurityModule,
    SettingsModule,
    WebhooksModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {} 