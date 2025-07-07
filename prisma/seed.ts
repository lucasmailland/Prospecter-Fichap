// ========================================================================================
// PRISMA SEED SCRIPT - Datos de prueba para desarrollo
// ========================================================================================

import { PrismaClient, UserRole, LeadStatus, LeadSource, EnrichmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ========================================================================================
// DATOS DE PRUEBA
// ========================================================================================

// ========================================================================================
// FUNCIÓN PRINCIPAL
// ========================================================================================

async function main() {
  console.log('🌱 Iniciando seeding de la base de datos...');
  
  // Limpiar datos existentes
  console.log('🧹 Limpiando datos existentes...');
  await prisma.enrichmentLog.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();
  
  // Crear usuarios de prueba
  console.log('👥 Creando usuarios de prueba...');
  
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || `Admin${Math.random().toString(36).substring(2, 10)}!`;
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  
  const adminUser = await prisma.user.create({
    data: {
      name: 'Lucas Mailland',
      email: 'lucas@prospecter.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      linkedin: 'https://linkedin.com/in/lucasmailland',
      emailVerified: new Date(),
    }
  });

  const managerUser = await prisma.user.create({
    data: {
      name: 'María González',
      email: 'maria@prospecter.com',
      password: await bcrypt.hash(process.env.SEED_MANAGER_PASSWORD || `Manager${Math.random().toString(36).substring(2, 10)}!`, 12),
      role: UserRole.MANAGER,
      emailVerified: new Date(),
    }
  });

  const salesUser = await prisma.user.create({
    data: {
      name: 'Carlos Rodríguez',
      email: 'carlos@prospecter.com',
      password: await bcrypt.hash(process.env.SEED_USER_PASSWORD || `User${Math.random().toString(36).substring(2, 10)}!`, 12),
      role: UserRole.USER,
      emailVerified: new Date(),
    }
  });

  console.log('✅ Usuarios creados');

  // Crear leads de prueba realistas
  console.log('📋 Creando leads de prueba...');
  
  const leadsData = [
    {
      firstName: 'Ana',
      lastName: 'Martínez',
      fullName: 'Ana Martínez',
      email: 'ana.martinez@techcorp.com',
      phone: '+34 666 111 222',
      company: 'TechCorp Solutions',
      jobTitle: 'CTO',
      website: 'https://techcorp.com',
      linkedinUrl: 'https://linkedin.com/in/anamartinez',
      industry: 'Technology',
      location: 'Madrid, España',
      country: 'España',
      city: 'Madrid',
      companySize: '50-200',
      status: LeadStatus.VALIDATED,
      source: LeadSource.WEBSITE,
      score: 85,
      priority: 3,
      notes: 'Interesada en soluciones de automatización para su equipo de ventas.',
      userId: adminUser.id
    },
    {
      firstName: 'David',
      lastName: 'Thompson',
      fullName: 'David Thompson',
      email: 'david.thompson@innovatetech.io',
      phone: '+1 555 123 4567',
      company: 'InnovateTech',
      jobTitle: 'VP of Sales',
      website: 'https://innovatetech.io',
      linkedinUrl: 'https://linkedin.com/in/davidthompson',
      industry: 'SaaS',
      location: 'San Francisco, CA',
      country: 'Estados Unidos',
      city: 'San Francisco',
      companySize: '200-500',
      status: LeadStatus.CONTACTED,
      source: LeadSource.API,
      score: 92,
      priority: 4,
      notes: 'Reunión programada para próxima semana. Muy interesado en la demo.',
      userId: managerUser.id
    },
    {
      firstName: 'Sophie',
      lastName: 'Dubois',
      fullName: 'Sophie Dubois',
      email: 'sophie.dubois@digitalparis.fr',
      phone: '+33 1 45 67 89 12',
      company: 'Digital Paris',
      jobTitle: 'Marketing Director',
      website: 'https://digitalparis.fr',
      linkedinUrl: 'https://linkedin.com/in/sophiedubois',
      industry: 'Digital Marketing',
      location: 'París, Francia',
      country: 'Francia',
      city: 'París',
      companySize: '20-50',
      status: LeadStatus.ENRICHED,
      source: LeadSource.REFERRAL,
      score: 78,
      priority: 2,
      notes: 'Referida por cliente actual. Busca soluciones para lead generation.',
      userId: salesUser.id
    },
    {
      firstName: 'Michael',
      lastName: 'Schmidt',
      fullName: 'Michael Schmidt',
      email: 'michael.schmidt@germantech.de',
      phone: '+49 30 123 456 78',
      company: 'GermanTech GmbH',
      jobTitle: 'Head of Business Development',
      website: 'https://germantech.de',
      linkedinUrl: 'https://linkedin.com/in/michaelschmidt',
      industry: 'Manufacturing',
      location: 'Berlín, Alemania',
      country: 'Alemania',
      city: 'Berlín',
      companySize: '500-1000',
      status: LeadStatus.NEW,
      source: LeadSource.IMPORT,
      score: 65,
      priority: 2,
      notes: 'Lead importado de lista de LinkedIn. Pendiente de primer contacto.',
      userId: adminUser.id
    },
    {
      firstName: 'Elena',
      lastName: 'Rossi',
      fullName: 'Elena Rossi',
      email: 'elena.rossi@italiadigital.it',
      phone: '+39 02 1234 5678',
      company: 'Italia Digital',
      jobTitle: 'CEO',
      website: 'https://italiadigital.it',
      linkedinUrl: 'https://linkedin.com/in/elenarossi',
      industry: 'Consulting',
      location: 'Milán, Italia',
      country: 'Italia',
      city: 'Milán',
      companySize: '10-20',
      status: LeadStatus.VALIDATED,
      source: LeadSource.MANUAL,
      score: 88,
      priority: 4,
      notes: 'CEO de consultora digital. Muy buena prospección para cliente enterprise.',
      userId: managerUser.id
    },
    {
      firstName: 'James',
      lastName: 'Wilson',
      fullName: 'James Wilson',
      email: 'james.wilson@ukstartup.co.uk',
      phone: '+44 20 7946 0958',
      company: 'UK Startup Ltd',
      jobTitle: 'Co-founder',
      website: 'https://ukstartup.co.uk',
      linkedinUrl: 'https://linkedin.com/in/jameswilson',
      industry: 'FinTech',
      location: 'Londres, Reino Unido',
      country: 'Reino Unido',
      city: 'Londres',
      companySize: '5-10',
      status: LeadStatus.PRIORITIZED,
      source: LeadSource.WEBSITE,
      score: 72,
      priority: 3,
      notes: 'Startup en fase de crecimiento. Interesado en herramientas de ventas escalables.',
      userId: salesUser.id
    },
    {
      firstName: 'Hiroshi',
      lastName: 'Tanaka',
      fullName: 'Hiroshi Tanaka',
      email: 'hiroshi.tanaka@japantech.jp',
      phone: '+81 3 1234 5678',
      company: 'Japan Tech Solutions',
      jobTitle: 'Sales Manager',
      website: 'https://japantech.jp',
      linkedinUrl: 'https://linkedin.com/in/hiroshitanaka',
      industry: 'Technology',
      location: 'Tokio, Japón',
      country: 'Japón',
      city: 'Tokio',
      companySize: '100-500',
      status: LeadStatus.NEW,
      source: LeadSource.API,
      score: 69,
      priority: 2,
      notes: 'Mercado asiático interesante. Pendiente de análisis de viabilidad regional.',
      userId: adminUser.id
    },
    {
      firstName: 'Isabella',
      lastName: 'Silva',
      fullName: 'Isabella Silva',
      email: 'isabella.silva@brasiltech.com.br',
      phone: '+55 11 9876 5432',
      company: 'Brasil Tech',
      jobTitle: 'Diretora Comercial',
      website: 'https://brasiltech.com.br',
      linkedinUrl: 'https://linkedin.com/in/isabellasilva',
      industry: 'E-commerce',
      location: 'São Paulo, Brasil',
      country: 'Brasil',
      city: 'São Paulo',
      companySize: '50-100',
      status: LeadStatus.CONTACTED,
      source: LeadSource.REFERRAL,
      score: 81,
      priority: 3,
      notes: 'Contacto establecido por WhatsApp. Interesada en demo en portugués.',
      userId: managerUser.id
    }
  ];

  for (const leadData of leadsData) {
    await prisma.lead.create({
      data: {
        ...leadData,
        isEmailValid: true,
        emailValidationScore: Math.random() * 100,
        enrichedAt: new Date(),
        validatedAt: new Date()
      }
    });
  }

  console.log('✅ Leads creados');

  // Mostrar resumen
  const totalUsers = await prisma.user.count();
  const totalLeads = await prisma.lead.count();
  
  console.log('\n📊 Resumen del seeding:');
  console.log(`👥 Usuarios creados: ${totalUsers}`);
  console.log(`📋 Leads creados: ${totalLeads}`);
  console.log('\n🔐 Credenciales de acceso:');
  console.log('Admin: lucas@prospecter.com / [Ver variable SEED_ADMIN_PASSWORD]');
  console.log('Manager: maria@prospecter.com / [Ver variable SEED_MANAGER_PASSWORD]');
  console.log('User: carlos@prospecter.com / [Ver variable SEED_USER_PASSWORD]');
  console.log('\n⚠️  IMPORTANTE: Configurar variables de entorno para contraseñas específicas.');
  console.log('✨ Base de datos lista para usar!');
}

// ========================================================================================
// EJECUCIÓN
// ========================================================================================

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 