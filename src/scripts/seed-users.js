const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creando usuarios de prueba...');

  // Hash de contraseñas usando variables de entorno o generando securas
  const adminPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'TempAdmin' + Math.random().toString(36).substring(2, 15), 12);
  const demoPassword = await bcrypt.hash(process.env.SEED_DEMO_PASSWORD || 'TempDemo' + Math.random().toString(36).substring(2, 15), 12);
  const testPassword = await bcrypt.hash(process.env.SEED_TEST_PASSWORD || 'TempTest' + Math.random().toString(36).substring(2, 15), 12);

  // Crear usuarios de prueba
  const users = [
    {
      name: 'Admin User',
      email: 'admin@prospecter.com',
      password: adminPassword,
      role: 'admin',
      company: 'Prospecter Inc.',
      position: 'Administrador'
    },
    {
      name: 'Demo User',
      email: 'demo@prospecter.com',
      password: demoPassword,
      role: 'user',
      company: 'Demo Corp',
      position: 'Sales Manager'
    },
    {
      name: 'Test User',
      email: 'test@prospecter.com',
      password: testPassword,
      role: 'user',
      company: 'Test Inc.',
      position: 'Lead Researcher'
    }
  ];

  for (const userData of users) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`✅ Usuario ${userData.email} ya existe`);
        continue;
      }

      // Crear usuario
      const user = await prisma.user.create({
        data: userData
      });

      console.log(`✅ Usuario creado: ${user.name} (${user.email})`);
    } catch (error) {
      console.error(`❌ Error creando usuario ${userData.email}:`, error.message);
    }
  }

  console.log('🎉 ¡Usuarios de prueba creados!');
  console.log('\n📋 Credenciales para probar:');
  console.log('Admin: admin@prospecter.com / [Ver variable SEED_ADMIN_PASSWORD]');
  console.log('Demo: demo@prospecter.com / [Ver variable SEED_DEMO_PASSWORD]');
  console.log('Test: test@prospecter.com / [Ver variable SEED_TEST_PASSWORD]');
  console.log('\n⚠️  IMPORTANTE: Configurar variables de entorno para contraseñas específicas.');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 