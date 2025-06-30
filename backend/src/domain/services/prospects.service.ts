import { Injectable } from '@nestjs/common';
import { CreateProspectDto } from '../../presentation/dto/create-prospect.dto';
import { UpdateProspectDto } from '../../presentation/dto/update-prospect.dto';
import { Prospect } from '../types/prospect.types';

// Helper function to generate secure sample data
const generateSampleData = () => {
  const timestamp = Date.now();
  const sampleDomains = ['sample-corp.local', 'demo-company.local', 'test-enterprise.local'];
  
  return {
    generateEmail: (index: number) => `sample_user_${index}_${timestamp}@${sampleDomains[index % sampleDomains.length]}`,
    generateCompany: (index: number) => `Sample Company ${index + 1}`,
    getCurrentTimestamp: () => new Date().toISOString()
  };
};

@Injectable()
export class ProspectsService {
  private prospects: Prospect[] = (() => {
    const { generateEmail, generateCompany, getCurrentTimestamp } = generateSampleData();
    
    return [
      {
        id: '1',
        name: 'Sample User A',
        email: generateEmail(0),
        phone: '+1 (555) 000-0001',
        company: generateCompany(0),
        status: 'qualified',
        score: 92,
        firstName: 'Sample',
        lastName: 'User A',
        fullName: 'Sample User A',
        jobTitle: 'VP Marketing',
        priority: 1,
        isEmailValid: true,
        isHighPriority: true,
        isReadyForContact: true,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      },
      {
        id: '2',
        name: 'Sample User B',
        email: generateEmail(1),
        phone: '+1 (555) 000-0002',
        company: generateCompany(1),
        status: 'qualified',
        score: 87,
        firstName: 'Sample',
        lastName: 'User B',
        fullName: 'Sample User B',
        jobTitle: 'CTO',
        priority: 1,
        isEmailValid: true,
        isHighPriority: true,
        isReadyForContact: true,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      },
      {
        id: '3',
        name: 'Sample User C',
        email: generateEmail(2),
        phone: '+1 (555) 000-0003',
        company: generateCompany(2),
        status: 'potential',
        score: 76,
        firstName: 'Sample',
        lastName: 'User C',
        fullName: 'Sample User C',
        jobTitle: 'Founder',
        priority: 2,
        isEmailValid: true,
        isHighPriority: false,
        isReadyForContact: true,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      },
      {
        id: '4',
        name: 'Sample User D',
        email: generateEmail(0),
        phone: '+1 (555) 000-0004',
        company: generateCompany(0),
        status: 'cold',
        score: 45,
        firstName: 'Sample',
        lastName: 'User D',
        fullName: 'Sample User D',
        jobTitle: 'Director',
        priority: 3,
        isEmailValid: true,
        isHighPriority: false,
        isReadyForContact: false,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      },
      {
        id: '5',
        name: 'Sample User E',
        email: generateEmail(1),
        phone: '+1 (555) 000-0005',
        company: generateCompany(1),
        status: 'qualified',
        score: 89,
        firstName: 'Sample',
        lastName: 'User E',
        fullName: 'Sample User E',
        jobTitle: 'Growth Manager',
        priority: 1,
        isEmailValid: true,
        isHighPriority: true,
        isReadyForContact: true,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      },
      {
        id: '6',
        name: 'Sample User F',
        email: generateEmail(2),
        company: generateCompany(2),
        status: 'hot',
        score: 82,
        firstName: 'Sample',
        lastName: 'User F',
        fullName: 'Sample User F',
        jobTitle: 'Product Manager',
        priority: 1,
        isEmailValid: true,
        isHighPriority: true,
        isReadyForContact: true,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      },
      {
        id: '7',
        name: 'Sample User G',
        email: generateEmail(0),
        company: generateCompany(0),
        status: 'warm',
        score: 68,
        firstName: 'Sample',
        lastName: 'User G',
        fullName: 'Sample User G',
        jobTitle: 'Senior Consultant',
        priority: 2,
        isEmailValid: true,
        isHighPriority: false,
        isReadyForContact: true,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      },
    ];
  })();

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