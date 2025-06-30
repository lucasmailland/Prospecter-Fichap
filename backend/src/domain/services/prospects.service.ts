import { Injectable } from '@nestjs/common';
import { CreateProspectDto } from '../../presentation/dto/create-prospect.dto';
import { UpdateProspectDto } from '../../presentation/dto/update-prospect.dto';
import { Prospect } from '../types/prospect.types';

@Injectable()
export class ProspectsService {
  private prospects: Prospect[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1 (555) 123-4567',
      company: 'TechCorp Inc.',
      status: 'qualified',
      score: 92,
      firstName: 'Sarah',
      lastName: 'Johnson',
      fullName: 'Sarah Johnson',
      jobTitle: 'VP Marketing',
      priority: 1,
      isEmailValid: true,
      isHighPriority: true,
      isReadyForContact: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@innovate.io',
      phone: '+1 (555) 987-6543',
      company: 'Innovate Solutions',
      status: 'qualified',
      score: 87,
      firstName: 'Mike',
      lastName: 'Chen',
      fullName: 'Mike Chen',
      jobTitle: 'CTO',
      priority: 1,
      isEmailValid: true,
      isHighPriority: true,
      isReadyForContact: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Anna Rodriguez',
      email: 'anna.rodriguez@startup.co',
      phone: '+1 (555) 456-7890',
      company: 'Startup.co',
      status: 'potential',
      score: 76,
      firstName: 'Anna',
      lastName: 'Rodriguez',
      fullName: 'Anna Rodriguez',
      jobTitle: 'Founder',
      priority: 2,
      isEmailValid: true,
      isHighPriority: false,
      isReadyForContact: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'John Doe',
      email: 'john.doe@enterprise.com',
      phone: '+1 (555) 321-0987',
      company: 'Enterprise Corp',
      status: 'cold',
      score: 45,
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      jobTitle: 'Director',
      priority: 3,
      isEmailValid: true,
      isHighPriority: false,
      isReadyForContact: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Lisa Wang',
      email: 'lisa.wang@growth.co',
      phone: '+1 (555) 654-3210',
      company: 'Growth Co',
      status: 'qualified',
      score: 89,
      firstName: 'Lisa',
      lastName: 'Wang',
      fullName: 'Lisa Wang',
      jobTitle: 'Growth Manager',
      priority: 1,
      isEmailValid: true,
      isHighPriority: true,
      isReadyForContact: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '6',
      name: 'Carlos Mendez',
      email: 'carlos.mendez@fintech.com',
      company: 'Fintech Solutions',
      status: 'hot',
      score: 82,
      firstName: 'Carlos',
      lastName: 'Mendez',
      fullName: 'Carlos Mendez',
      jobTitle: 'Product Manager',
      priority: 1,
      isEmailValid: true,
      isHighPriority: true,
      isReadyForContact: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '7',
      name: 'Maria Gonzalez',
      email: 'maria.gonzalez@consulting.com',
      company: 'Consulting Plus',
      status: 'warm',
      score: 68,
      firstName: 'Maria',
      lastName: 'Gonzalez',
      fullName: 'Maria Gonzalez',
      jobTitle: 'Senior Consultant',
      priority: 2,
      isEmailValid: true,
      isHighPriority: false,
      isReadyForContact: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  create(createProspectDto: any): Prospect {
    const newProspect: Prospect = {
      id: Date.now().toString(),
      name: createProspectDto.name,
      email: createProspectDto.email,
      phone: createProspectDto.phone,
      company: createProspectDto.company,
      status: createProspectDto.status || 'cold',
      score: Math.floor(Math.random() * 100), // Score aleatorio por ahora
      firstName: createProspectDto.name.split(' ')[0],
      lastName: createProspectDto.name.split(' ').slice(1).join(' '),
      fullName: createProspectDto.name,
      jobTitle: 'N/A',
      priority: 3,
      isEmailValid: true,
      isHighPriority: false,
      isReadyForContact: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.prospects.push(newProspect);
    return newProspect;
  }

  findAll(): Prospect[] {
    return this.prospects;
  }

  findOne(id: number): Prospect {
    const prospect = this.prospects.find(p => p.id === id.toString());
    if (!prospect) {
      throw new Error(`Prospect with ID ${id} not found`);
    }
    return prospect;
  }

  update(id: number, updateProspectDto: any): Prospect {
    const index = this.prospects.findIndex(p => p.id === id.toString());
    if (index === -1) {
      throw new Error(`Prospect with ID ${id} not found`);
    }

    const updatedProspect = {
      ...this.prospects[index],
      ...updateProspectDto,
      updatedAt: new Date().toISOString(),
    };

    this.prospects[index] = updatedProspect;
    return updatedProspect;
  }

  remove(id: number): { message: string } {
    const index = this.prospects.findIndex(p => p.id === id.toString());
    if (index === -1) {
      throw new Error(`Prospect with ID ${id} not found`);
    }

    this.prospects.splice(index, 1);
    return { message: `Prospect with ID ${id} has been deleted` };
  }
} 