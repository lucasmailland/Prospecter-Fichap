const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();

// Helper function to get secure database configuration
function getSecureDatabaseConfig() {
  const config = {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT) || null,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  };

  // Validate all required environment variables
  const requiredVars = ['DATABASE_HOST', 'DATABASE_PORT', 'DATABASE_USER', 'DATABASE_PASSWORD', 'DATABASE_NAME'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ ERROR: Missing required environment variables for secure database connection:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('💡 Please set these variables in your .env file:');
    console.error('   DATABASE_HOST=your_db_host');
    console.error('   DATABASE_PORT=5432');
    console.error('   DATABASE_USER=your_db_user');
    console.error('   DATABASE_PASSWORD=your_secure_password');
    console.error('   DATABASE_NAME=your_database_name');
    process.exit(1);
  }

  return config;
}

async function createAdminUser() {
  console.log('👤 Creando usuario administrador...');

  // Get secure database configuration
  const dbConfig = getSecureDatabaseConfig();

  const client = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
  });

  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos');

    // Get admin email from environment or use secure default
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@prospecter-fichap.com';

    // Hash de la contraseña
    // Generar contraseña segura aleatoria
    const randomPassword = crypto.randomBytes(16).toString('hex');
    const adminPassword = await bcrypt.hash(randomPassword, 12);
    
    // Verificar si el usuario ya existe
    const checkUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [adminEmail]
    );

    if (checkUser.rows.length > 0) {
      console.log('⚠️  El usuario administrador ya existe');
      return;
    }

    // Crear usuario administrador
    const createAdminQuery = `
      INSERT INTO users (name, email, password, role, is_email_verified, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, role
    `;

    const result = await client.query(createAdminQuery, [
      'Administrator',
      adminEmail,
      adminPassword,
      'admin',
      true,
      true
    ]);

    const admin = result.rows[0];
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('📋 Detalles del usuario:');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Nombre: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Rol: ${admin.role}`);
    console.log('🔑 Credenciales de acceso:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${randomPassword}`);
    console.log('');
    console.log('⚠️  IMPORTANTE: Guarda esta contraseña, se genera solo una vez');
    console.log('⚠️  CAMBIAR la contraseña después del primer inicio de sesión');

    await client.end();

  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createAdminUser();
}

module.exports = { createAdminUser }; 