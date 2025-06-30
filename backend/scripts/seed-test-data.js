#!/usr/bin/env node

const { Pool } = require('pg');

// Configuración de la base de datos
const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 5432,
  database: process.env.DATABASE_NAME || 'prospecter_fichap',
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
});

const testLeads = [
  {
    email: 'sarah.johnson@techcorp.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    fullName: 'Sarah Johnson',
    company: 'TechCorp Inc.',
    jobTitle: 'VP Marketing',
    phone: '+1 (555) 123-4567',
    website: 'https://techcorp.com',
    linkedinUrl: 'https://linkedin.com/in/sarah-johnson',
    score: 92,
    priority: 1,
    status: 'qualified',
    isEmailValid: true,
    isHighPriority: true,
    isReadyForContact: true,
    source: 'LINKEDIN',
    notes: 'Muy interesada en soluciones de automatización'
  },
  {
    email: 'mike.chen@innovate.io',
    firstName: 'Mike',
    lastName: 'Chen',
    fullName: 'Mike Chen',
    company: 'Innovate Solutions',
    jobTitle: 'CTO',
    phone: '+1 (555) 987-6543',
    website: 'https://innovate.io',
    score: 87,
    priority: 1,
    status: 'qualified',
    isEmailValid: true,
    isHighPriority: true,
    isReadyForContact: true,
    source: 'WEBSITE'
  },
  {
    email: 'anna.rodriguez@startup.co',
    firstName: 'Anna',
    lastName: 'Rodriguez',
    fullName: 'Anna Rodriguez',
    company: 'Startup.co',
    jobTitle: 'Founder',
    phone: '+1 (555) 456-7890',
    score: 76,
    priority: 2,
    status: 'potential',
    isEmailValid: true,
    isHighPriority: false,
    isReadyForContact: true,
    source: 'IMPORT'
  },
  {
    email: 'john.doe@enterprise.com',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    company: 'Enterprise Corp',
    jobTitle: 'Director',
    phone: '+1 (555) 321-0987',
    score: 45,
    priority: 3,
    status: 'cold',
    isEmailValid: true,
    isHighPriority: false,
    isReadyForContact: false,
    source: 'COLD_EMAIL'
  },
  {
    email: 'lisa.wang@growth.co',
    firstName: 'Lisa',
    lastName: 'Wang',
    fullName: 'Lisa Wang',
    company: 'Growth Co',
    jobTitle: 'Growth Manager',
    phone: '+1 (555) 654-3210',
    score: 89,
    priority: 1,
    status: 'qualified',
    isEmailValid: true,
    isHighPriority: true,
    isReadyForContact: true,
    source: 'REFERRAL'
  },
  {
    email: 'carlos.mendez@fintech.com',
    firstName: 'Carlos',
    lastName: 'Mendez',
    fullName: 'Carlos Mendez',
    company: 'Fintech Solutions',
    jobTitle: 'Product Manager',
    score: 82,
    priority: 1,
    status: 'hot',
    isEmailValid: true,
    isHighPriority: true,
    isReadyForContact: true,
    source: 'EVENT'
  },
  {
    email: 'maria.gonzalez@consulting.com',
    firstName: 'Maria',
    lastName: 'Gonzalez',
    fullName: 'Maria Gonzalez',
    company: 'Consulting Plus',
    jobTitle: 'Senior Consultant',
    score: 68,
    priority: 2,
    status: 'warm',
    isEmailValid: true,
    isHighPriority: false,
    isReadyForContact: true,
    source: 'API'
  }
];

async function createLeadsTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS leads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      "firstName" VARCHAR(255),
      "lastName" VARCHAR(255),
      "fullName" VARCHAR(255),
      company VARCHAR(255),
      "jobTitle" VARCHAR(255),
      phone VARCHAR(50),
      website VARCHAR(255),
      "linkedinUrl" VARCHAR(255),
      "hubspotId" VARCHAR(255),
      notes TEXT,
      score INTEGER DEFAULT 0,
      priority INTEGER DEFAULT 3,
      status VARCHAR(50) DEFAULT 'cold',
      "isEmailValid" BOOLEAN DEFAULT false,
      "isHighPriority" BOOLEAN DEFAULT false,
      "isReadyForContact" BOOLEAN DEFAULT false,
      source VARCHAR(50),
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✅ Tabla leads creada o ya existe');
  } catch (error) {
    console.error('❌ Error creando tabla leads:', error.message);
    throw error;
  }
}

async function seedLeads() {
  const insertQuery = `
    INSERT INTO leads (
      email, "firstName", "lastName", "fullName", company, "jobTitle", 
      phone, website, "linkedinUrl", score, priority, status, 
      "isEmailValid", "isHighPriority", "isReadyForContact", source, notes
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
    ) ON CONFLICT (email) DO UPDATE SET
      "firstName" = EXCLUDED."firstName",
      "lastName" = EXCLUDED."lastName",
      "fullName" = EXCLUDED."fullName",
      company = EXCLUDED.company,
      "jobTitle" = EXCLUDED."jobTitle",
      phone = EXCLUDED.phone,
      website = EXCLUDED.website,
      "linkedinUrl" = EXCLUDED."linkedinUrl",
      score = EXCLUDED.score,
      priority = EXCLUDED.priority,
      status = EXCLUDED.status,
      "isEmailValid" = EXCLUDED."isEmailValid",
      "isHighPriority" = EXCLUDED."isHighPriority",
      "isReadyForContact" = EXCLUDED."isReadyForContact",
      source = EXCLUDED.source,
      notes = EXCLUDED.notes,
      "updatedAt" = CURRENT_TIMESTAMP;
  `;

  console.log('🌱 Insertando leads de prueba...');

  for (const lead of testLeads) {
    try {
      await pool.query(insertQuery, [
        lead.email,
        lead.firstName,
        lead.lastName,
        lead.fullName,
        lead.company,
        lead.jobTitle,
        lead.phone,
        lead.website,
        lead.linkedinUrl,
        lead.score,
        lead.priority,
        lead.status,
        lead.isEmailValid,
        lead.isHighPriority,
        lead.isReadyForContact,
        lead.source,
        lead.notes
      ]);
      console.log(`✅ Lead insertado: ${lead.fullName} (${lead.email})`);
    } catch (error) {
      console.error(`❌ Error insertando lead ${lead.email}:`, error.message);
    }
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando seeding de datos de prueba...');
    
    await createLeadsTable();
    await seedLeads();
    
    // Verificar los datos insertados
    const result = await pool.query('SELECT COUNT(*) as count FROM leads');
    console.log(`📊 Total de leads en la base de datos: ${result.rows[0].count}`);
    
    console.log('✅ Seeding completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  main();
} 