import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Lead } from './lead.entity';

export enum EnrichmentType {
  EMAIL_VALIDATION = 'email_validation',
  COMPANY_ENRICHMENT = 'company_enrichment',
  PERSON_ENRICHMENT = 'person_enrichment',
  SCORING = 'scoring',
  PRIORITIZATION = 'prioritization',
}

export enum EnrichmentStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  SUCCESS = 'success',
  FAILED = 'failed',
  RATE_LIMITED = 'rate_limited',
}

export enum ApiProvider {
  CLEARBIT = 'clearbit',
  HUNTER = 'hunter',
  MAILBOXLAYER = 'mailboxlayer',
  ABSTRACT_API = 'abstract_api',
  APOLLO = 'apollo',
  ZOOM_INFO = 'zoominfo',
  MANUAL = 'manual',
}

@Entity('enrichment_logs')
@Index(['leadId'])
@Index(['type'])
@Index(['status'])
@Index(['provider'])
@Index(['createdAt'])
export class EnrichmentLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  leadId: string;

  @ManyToOne(() => Lead, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'leadId' })
  lead: Lead;

  @Column({
    type: 'enum',
    enum: EnrichmentType,
  })
  type: EnrichmentType;

  @Column({
    type: 'enum',
    enum: EnrichmentStatus,
    default: EnrichmentStatus.PENDING,
  })
  status: EnrichmentStatus;

  @Column({
    type: 'enum',
    enum: ApiProvider,
  })
  provider: ApiProvider;

  @Column({ type: 'text', nullable: true })
  requestData: string; // JSON con datos de la petición

  @Column({ type: 'text', nullable: true })
  responseData: string; // JSON con respuesta de la API

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'int', default: 0 })
  responseTime: number; // en milisegundos

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cost: number; // costo en créditos o dinero

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  // Métodos de utilidad
  get isSuccessful(): boolean {
    return this.status === EnrichmentStatus.SUCCESS;
  }

  get isFailed(): boolean {
    return this.status === EnrichmentStatus.FAILED;
  }

  get isRateLimited(): boolean {
    return this.status === EnrichmentStatus.RATE_LIMITED;
  }

  get duration(): number {
    if (this.completedAt && this.createdAt) {
      return this.completedAt.getTime() - this.createdAt.getTime();
    }
    return 0;
  }
} 