import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum LeadStatus {
  NEW = 'new',
  ENRICHED = 'enriched',
  VALIDATED = 'validated',
  PRIORITIZED = 'prioritized',
  CONTACTED = 'contacted',
  CONVERTED = 'converted',
  LOST = 'lost',
}

export enum LeadSource {
  HUBSPOT = 'hubspot',
  MANUAL = 'manual',
  IMPORT = 'import',
  API = 'api',
}

@Entity('leads')
@Index(['email'], { unique: true })
@Index(['status'])
@Index(['score'])
@Index(['createdAt'])
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Datos básicos
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  // Datos de enriquecimiento
  @Column({ nullable: true })
  companySize: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  timezone: string;

  @Column({ nullable: true })
  language: string;

  // Validación de email
  @Column({ default: false })
  isEmailValid: boolean;

  @Column({ nullable: true })
  emailValidationScore: number;

  @Column({ nullable: true })
  emailValidationDetails: string;

  // Scoring y priorización
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  score: number;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'text', nullable: true })
  scoringFactors: string; // JSON con factores de scoring

  // Estado y seguimiento
  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @Column({
    type: 'enum',
    enum: LeadSource,
    default: LeadSource.MANUAL,
  })
  source: LeadSource;

  @Column({ nullable: true })
  hubspotId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  // Auditoría
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  enrichedAt: Date;

  @Column({ nullable: true })
  validatedAt: Date;

  @Column({ nullable: true })
  lastContactedAt: Date;

  // Getters calculados
  get displayName(): string {
    return this.fullName || `${this.firstName || ''} ${this.lastName || ''}`.trim() || this.email;
  }

  get isHighPriority(): boolean {
    return this.priority >= 8 || this.score >= 80;
  }

  get isReadyForContact(): boolean {
    return this.status === LeadStatus.PRIORITIZED && this.isEmailValid;
  }
} 