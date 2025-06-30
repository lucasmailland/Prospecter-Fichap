import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProspectDto {
  @ApiProperty({ description: 'Nombre del prospecto' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email del prospecto' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Teléfono del prospecto', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Empresa del prospecto', required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ description: 'Estado del prospecto', required: false })
  @IsOptional()
  @IsString()
  status?: string;
} 