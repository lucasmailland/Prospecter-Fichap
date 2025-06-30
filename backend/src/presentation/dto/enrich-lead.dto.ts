import { IsEmail, IsOptional, IsString, IsEnum, IsArray, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeadSource } from '../../domain/entities/lead.entity';

export class CreateLeadDto {
  @ApiProperty({ description: 'Email del lead' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Nombre del lead' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Apellido del lead' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Nombre completo del lead' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Teléfono del lead' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Empresa del lead' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ description: 'Cargo del lead' })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional({ description: 'Sitio web' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'URL de LinkedIn' })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @ApiPropertyOptional({ description: 'ID de HubSpot' })
  @IsOptional()
  @IsString()
  hubspotId?: string;

  @ApiPropertyOptional({ description: 'Notas adicionales' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: LeadSource, description: 'Fuente del lead' })
  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;
}

export class EnrichLeadDto {
  @ApiProperty({ description: 'ID del lead a enriquecer' })
  @IsUUID()
  leadId: string;

  @ApiPropertyOptional({ description: 'Tipos de enriquecimiento a realizar', isArray: true })
  @IsOptional()
  @IsArray()
  enrichmentTypes?: string[];
}

export class BulkEnrichDto {
  @ApiProperty({ description: 'IDs de leads a enriquecer', isArray: true })
  @IsArray()
  @IsUUID('4', { each: true })
  leadIds: string[];

  @ApiPropertyOptional({ description: 'Tipos de enriquecimiento a realizar', isArray: true })
  @IsOptional()
  @IsArray()
  enrichmentTypes?: string[];
}

export class UpdateLeadDto {
  @ApiPropertyOptional({ description: 'Nombre del lead' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Apellido del lead' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Nombre completo del lead' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Teléfono del lead' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Empresa del lead' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ description: 'Cargo del lead' })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional({ description: 'Sitio web' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'URL de LinkedIn' })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @ApiPropertyOptional({ description: 'Notas adicionales' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class LeadResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  fullName?: string;

  @ApiPropertyOptional()
  company?: string;

  @ApiPropertyOptional()
  jobTitle?: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  priority: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  isEmailValid: boolean;

  @ApiProperty()
  isHighPriority: boolean;

  @ApiProperty()
  isReadyForContact: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 