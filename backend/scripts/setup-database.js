const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Cargar variables de entorno
require('dotenv').config();

async function setupDatabase() {
  console.log('🗄️  Configurando base de datos...');

  // Conectar a PostgreSQL
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: 'postgres', // Conectar a la base de datos por defecto
  });

  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL');

    // Crear base de datos si no existe
    const dbName = process.env.DATABASE_NAME || 'prospecter_fichap';
    const checkDbQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1
    `;
    
    const dbExists = await client.query(checkDbQuery, [dbName]);
    
    if (dbExists.rows.length === 0) {
      console.log(`📝 Creando base de datos: ${dbName}`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Base de datos ${dbName} creada`);
    } else {
      console.log(`✅ Base de datos ${dbName} ya existe`);
    }

    await client.end();

    // Conectar a la nueva base de datos
    const dbClient = new Client({
      host: process.env.DATABASE_HOST || 'localhost',
      port: process.env.DATABASE_PORT || 5432,
      user: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: dbName,
    });

    await dbClient.connect();
    console.log(`✅ Conectado a ${dbName}`);

    // Crear tabla de usuarios
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
        is_blocked BOOLEAN DEFAULT FALSE,
        is_email_verified BOOLEAN DEFAULT FALSE,
        email_verification_token VARCHAR(255),
        password_reset_token VARCHAR(255),
        password_reset_expires TIMESTAMP,
        last_login TIMESTAMP,
        last_password_change TIMESTAMP,
        failed_login_attempts INTEGER DEFAULT 0,
        blocked_until TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );

      -- Crear índices
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
      CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
    `;

    await dbClient.query(createUsersTable);
    console.log('✅ Tabla users creada');

    // Crear tabla de leads si no existe
    const createLeadsTable = `
      CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        company VARCHAR(255),
        position VARCHAR(255),
        phone VARCHAR(50),
        linkedin_url VARCHAR(500),
        website VARCHAR(500),
        industry VARCHAR(100),
        location VARCHAR(255),
        score INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'new',
        enriched_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
      CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
      CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    `;

    await dbClient.query(createLeadsTable);
    console.log('✅ Tabla leads creada');

    // Crear tabla de logs de enriquecimiento
    const createEnrichmentLogsTable = `
      CREATE TABLE IF NOT EXISTS enrichment_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        lead_id UUID REFERENCES leads(id),
        provider VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL,
        data JSONB,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_enrichment_logs_lead_id ON enrichment_logs(lead_id);
      CREATE INDEX IF NOT EXISTS idx_enrichment_logs_provider ON enrichment_logs(provider);
      CREATE INDEX IF NOT EXISTS idx_enrichment_logs_status ON enrichment_logs(status);
    `;

    await dbClient.query(createEnrichmentLogsTable);
    console.log('✅ Tabla enrichment_logs creada');

    // Crear usuario administrador por defecto
    // Generar contraseña segura aleatoria
    const randomPassword = crypto.randomBytes(16).toString('hex');
    const adminPassword = await bcrypt.hash(randomPassword, 12);
    
    const createAdminUser = `
      INSERT INTO users (name, email, password, role, is_email_verified, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
    `;

    const result = await dbClient.query(createAdminUser, [
      'Administrator',
      'admin@prospecter-fichap.com',
      adminPassword,
      'admin',
      true,
      true
    ]);

    if (result.rowCount > 0) {
      console.log('✅ Usuario administrador creado');
      console.log('📧 Email: admin@prospecter-fichap.com');
      console.log(`🔑 Password: ${randomPassword}`);
      console.log('⚠️  IMPORTANTE: Guarda esta contraseña, se genera una vez');
      console.log('⚠️  CAMBIAR la contraseña después del primer login');
    } else {
      console.log('✅ Usuario administrador ya existe');
    }

    await dbClient.end();
    console.log('🎉 Configuración de base de datos completada');

  } catch (error) {
    console.error('❌ Error configurando base de datos:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 