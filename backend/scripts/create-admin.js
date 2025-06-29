const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdminUser() {
  console.log('👤 Creando usuario administrador...');

  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'prospecter_fichap',
  });

  try {
    await client.connect();
    console.log('✅ Conectado a la base de datos');

    // Hash de la contraseña
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    // Verificar si el usuario ya existe
    const checkUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@prospecter-fichap.com']
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
      'admin@prospecter-fichap.com',
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
    console.log('   Email: admin@prospecter-fichap.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión');

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