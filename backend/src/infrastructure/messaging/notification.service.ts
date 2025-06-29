import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as nodemailer from 'nodemailer';
import { Lead, LeadStatus } from '../../domain/entities/lead.entity';

export interface NotificationConfig {
  email: {
    enabled: boolean;
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    from: string;
    to: string[];
  };
  discord: {
    enabled: boolean;
    webhookUrl: string;
  };
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {
    // Configurar transporter de email
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailyLeadReport() {
    this.logger.log('Sending daily lead report...');

    try {
      const report = await this.generateDailyLeadReport();
      
      if (report.hasNewLeads) {
        await this.sendEmailNotification(report);
        await this.sendDiscordNotification(report);
      }
    } catch (error) {
      this.logger.error(`Failed to send daily lead report: ${error.message}`);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async sendHighPriorityLeadAlert() {
    this.logger.log('Checking for high priority leads...');

    try {
      const highPriorityLeads = await this.getHighPriorityLeads();
      
      if (highPriorityLeads.length > 0) {
        await this.sendHighPriorityAlert(highPriorityLeads);
      }
    } catch (error) {
      this.logger.error(`Failed to send high priority alert: ${error.message}`);
    }
  }

  async sendManualNotification(leadIds: string[], message: string) {
    try {
      const leads = await this.leadRepository.findByIds(leadIds);
      
      const notification = {
        type: 'manual',
        message,
        leads,
        timestamp: new Date(),
      };

      await this.sendEmailNotification(notification);
      await this.sendDiscordNotification(notification);
      
      this.logger.log(`Manual notification sent for ${leads.length} leads`);
    } catch (error) {
      this.logger.error(`Failed to send manual notification: ${error.message}`);
    }
  }

  private async generateDailyLeadReport() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Obtener leads creados ayer
    const newLeads = await this.leadRepository.find({
      where: {
        createdAt: {
          $gte: yesterday,
          $lt: today,
        } as any,
      },
      order: { createdAt: 'DESC' },
    });

    // Obtener leads enriquecidos ayer
    const enrichedLeads = await this.leadRepository.find({
      where: {
        enrichedAt: {
          $gte: yesterday,
          $lt: today,
        } as any,
      },
      order: { enrichedAt: 'DESC' },
    });

    // Obtener leads prioritarios
    const highPriorityLeads = await this.getHighPriorityLeads();

    // Estadísticas generales
    const totalLeads = await this.leadRepository.count();
    const validatedLeads = await this.leadRepository.count({ where: { isEmailValid: true } });
    const prioritizedLeads = await this.leadRepository.count({ where: { status: LeadStatus.PRIORITIZED } });

    return {
      type: 'daily_report',
      date: yesterday,
      hasNewLeads: newLeads.length > 0 || enrichedLeads.length > 0 || highPriorityLeads.length > 0,
      stats: {
        totalLeads,
        validatedLeads,
        prioritizedLeads,
        newLeadsCount: newLeads.length,
        enrichedLeadsCount: enrichedLeads.length,
        highPriorityLeadsCount: highPriorityLeads.length,
      },
      newLeads: newLeads.slice(0, 10), // Top 10
      enrichedLeads: enrichedLeads.slice(0, 10), // Top 10
      highPriorityLeads: highPriorityLeads.slice(0, 5), // Top 5
      timestamp: new Date(),
    };
  }

  private async getHighPriorityLeads(): Promise<Lead[]> {
    return await this.leadRepository.find({
      where: [
        { priority: { $gte: 8 } as any },
        { score: { $gte: 80 } as any },
        { status: LeadStatus.PRIORITIZED },
      ],
      order: { priority: 'DESC', score: 'DESC' },
      take: 20,
    });
  }

  private async sendEmailNotification(notification: any) {
    if (!process.env.SMTP_ENABLED || process.env.SMTP_ENABLED !== 'true') {
      this.logger.debug('Email notifications disabled');
      return;
    }

    const subject = this.getEmailSubject(notification);
    const html = this.generateEmailHtml(notification);

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@prospecter-fichap.com',
      to: process.env.NOTIFICATION_EMAIL?.split(',') || [],
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log('Email notification sent successfully');
    } catch (error) {
      this.logger.error(`Failed to send email notification: ${error.message}`);
    }
  }

  private async sendDiscordNotification(notification: any) {
    if (!process.env.DISCORD_WEBHOOK_URL) {
      this.logger.debug('Discord notifications disabled');
      return;
    }

    const embed = this.generateDiscordEmbed(notification);

    try {
      const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ embeds: [embed] }),
      });

      if (response.ok) {
        this.logger.log('Discord notification sent successfully');
      } else {
        this.logger.error(`Discord notification failed: ${response.statusText}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send Discord notification: ${error.message}`);
    }
  }

  private async sendHighPriorityAlert(leads: Lead[]) {
    const notification = {
      type: 'high_priority_alert',
      leads,
      message: `🚨 ${leads.length} leads de alta prioridad detectados`,
      timestamp: new Date(),
    };

    await this.sendEmailNotification(notification);
    await this.sendDiscordNotification(notification);
  }

  private getEmailSubject(notification: any): string {
    switch (notification.type) {
      case 'daily_report':
        return `📊 Reporte Diario de Leads - ${notification.date.toLocaleDateString('es-ES')}`;
      case 'high_priority_alert':
        return `🚨 Alert: ${notification.leads.length} Leads de Alta Prioridad`;
      case 'manual':
        return `📢 Notificación Manual: ${notification.message}`;
      default:
        return 'Prospecter-Fichap Notification';
    }
  }

  private generateEmailHtml(notification: any): string {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
          .stat-card { background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; }
          .stat-number { font-size: 24px; font-weight: bold; color: #667eea; }
          .leads-section { margin-bottom: 20px; }
          .lead-card { background: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; margin-bottom: 10px; }
          .lead-name { font-weight: bold; color: #495057; }
          .lead-company { color: #6c757d; font-size: 14px; }
          .lead-score { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .score-high { background: #d4edda; color: #155724; }
          .score-medium { background: #fff3cd; color: #856404; }
          .score-low { background: #f8d7da; color: #721c24; }
          .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${this.getEmailSubject(notification)}</h1>
            <p>Prospecter-Fichap - Sistema de Enriquecimiento de Leads</p>
          </div>
    `;

    if (notification.type === 'daily_report') {
      html += `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">${notification.stats.totalLeads}</div>
            <div>Total Leads</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${notification.stats.newLeadsCount}</div>
            <div>Nuevos Hoy</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${notification.stats.highPriorityLeadsCount}</div>
            <div>Alta Prioridad</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${notification.stats.validatedLeads}</div>
            <div>Emails Válidos</div>
          </div>
        </div>
      `;

      if (notification.highPriorityLeads.length > 0) {
        html += `
          <div class="leads-section">
            <h2>🚨 Leads de Alta Prioridad</h2>
            ${notification.highPriorityLeads.map(lead => this.generateLeadCard(lead)).join('')}
          </div>
        `;
      }

      if (notification.newLeads.length > 0) {
        html += `
          <div class="leads-section">
            <h2>📥 Nuevos Leads</h2>
            ${notification.newLeads.map(lead => this.generateLeadCard(lead)).join('')}
          </div>
        `;
      }
    } else if (notification.type === 'high_priority_alert') {
      html += `
        <div class="leads-section">
          <h2>🚨 Alert: ${notification.leads.length} Leads de Alta Prioridad</h2>
          ${notification.leads.map(lead => this.generateLeadCard(lead)).join('')}
        </div>
      `;
    }

    html += `
          <div class="footer">
            <p>Este es un mensaje automático del sistema Prospecter-Fichap</p>
            <p>Enviado el ${new Date().toLocaleString('es-ES')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return html;
  }

  private generateLeadCard(lead: Lead): string {
    const scoreClass = lead.score >= 80 ? 'score-high' : lead.score >= 60 ? 'score-medium' : 'score-low';
    
    return `
      <div class="lead-card">
        <div class="lead-name">${lead.displayName || lead.email}</div>
        <div class="lead-company">${lead.company || 'Sin empresa'}</div>
        <div style="margin-top: 8px;">
          <span class="lead-score ${scoreClass}">Score: ${lead.score}</span>
          <span class="lead-score ${scoreClass}">Prioridad: ${lead.priority}</span>
          ${lead.isEmailValid ? '<span class="lead-score score-high">✓ Email Válido</span>' : ''}
        </div>
      </div>
    `;
  }

  private generateDiscordEmbed(notification: any): any {
    const embed = {
      title: this.getDiscordTitle(notification),
      description: this.getDiscordDescription(notification),
      color: this.getDiscordColor(notification),
      fields: [],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Prospecter-Fichap',
      },
    };

    if (notification.type === 'daily_report') {
      embed.fields = [
        {
          name: '📊 Estadísticas',
          value: `Total: ${notification.stats.totalLeads}\nNuevos: ${notification.stats.newLeadsCount}\nAlta Prioridad: ${notification.stats.highPriorityLeadsCount}`,
          inline: true,
        },
        {
          name: '✅ Validación',
          value: `Emails Válidos: ${notification.stats.validatedLeads}\nPriorizados: ${notification.stats.prioritizedLeads}`,
          inline: true,
        },
      ];

      if (notification.highPriorityLeads.length > 0) {
        embed.fields.push({
          name: '🚨 Leads de Alta Prioridad',
          value: notification.highPriorityLeads.slice(0, 5).map(lead => 
            `• ${lead.displayName || lead.email} (Score: ${lead.score})`
          ).join('\n'),
          inline: false,
        });
      }
    } else if (notification.type === 'high_priority_alert') {
      embed.fields = notification.leads.slice(0, 5).map(lead => ({
        name: `${lead.displayName || lead.email}`,
        value: `Empresa: ${lead.company || 'N/A'}\nScore: ${lead.score} | Prioridad: ${lead.priority}`,
        inline: true,
      }));
    }

    return embed;
  }

  private getDiscordTitle(notification: any): string {
    switch (notification.type) {
      case 'daily_report':
        return `📊 Reporte Diario - ${notification.date.toLocaleDateString('es-ES')}`;
      case 'high_priority_alert':
        return `🚨 ${notification.leads.length} Leads de Alta Prioridad`;
      case 'manual':
        return `📢 ${notification.message}`;
      default:
        return 'Prospecter-Fichap Notification';
    }
  }

  private getDiscordDescription(notification: any): string {
    switch (notification.type) {
      case 'daily_report':
        return 'Resumen diario de actividad en el sistema de enriquecimiento de leads';
      case 'high_priority_alert':
        return 'Se han detectado leads que requieren atención inmediata';
      case 'manual':
        return notification.message;
      default:
        return 'Notificación del sistema Prospecter-Fichap';
    }
  }

  private getDiscordColor(notification: any): number {
    switch (notification.type) {
      case 'daily_report':
        return 0x667eea; // Azul
      case 'high_priority_alert':
        return 0xff6b6b; // Rojo
      case 'manual':
        return 0x51cf66; // Verde
      default:
        return 0x6c757d; // Gris
    }
  }
} 