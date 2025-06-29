import { Injectable } from '@nestjs/common';
import { CreateProspectDto } from '../../presentation/dto/create-prospect.dto';
import { UpdateProspectDto } from '../../presentation/dto/update-prospect.dto';

@Injectable()
export class ProspectsService {
  create(createProspectDto: CreateProspectDto) {
    return {
      id: 1,
      ...createProspectDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  findAll() {
    return [
      {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '+1234567890',
        company: 'Tech Corp',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  findOne(id: number) {
    return {
      id,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '+1234567890',
      company: 'Tech Corp',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  update(id: number, updateProspectDto: UpdateProspectDto) {
    return {
      id,
      ...updateProspectDto,
      updatedAt: new Date(),
    };
  }

  remove(id: number) {
    return { message: `Prospecto ${id} eliminado exitosamente` };
  }
} 