const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createSampleUsers() {
  try {
    console.log('🔄 Creando usuarios de ejemplo...');

    // Verificar si ya existen usuarios
    const existingUsers = await prisma.user.findMany();
    console.log(`📊 Usuarios existentes: ${existingUsers.length}`);

    // Crear usuarios de ejemplo
    const sampleUsers = [
      {
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos@prospecter.com',
        role: 'MANAGER',
        password: process.env.SAMPLE_MANAGER_PASSWORD || `Manager${Math.random().toString(36).substring(2, 10)}!`
      },
      {
        firstName: 'María',
        lastName: 'González',
        email: 'maria@prospecter.com',
        role: 'MANAGER',
        password: process.env.SAMPLE_MANAGER_PASSWORD || `Manager${Math.random().toString(36).substring(2, 10)}!`
      },
      {
        firstName: 'Ana',
        lastName: 'López',
        email: 'ana@prospecter.com',
        role: 'USER',
        password: process.env.SAMPLE_USER_PASSWORD || `User${Math.random().toString(36).substring(2, 10)}!`
      },
      {
        firstName: 'Pedro',
        lastName: 'Martínez',
        email: 'pedro@prospecter.com',
        role: 'USER',
        password: process.env.SAMPLE_USER_PASSWORD || `User${Math.random().toString(36).substring(2, 10)}!`
      }
    ];

    for (const userData of sampleUsers) {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`⚠️  Usuario ${userData.email} ya existe, actualizando...`);
        
        // Actualizar usuario existente
        await prisma.user.update({
          where: { email: userData.email },
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            name: `${userData.firstName} ${userData.lastName}`,
            role: userData.role,
            accountLocked: false,
            twoFactorEnabled: false
          }
        });
        console.log(`✅ Usuario ${userData.email} actualizado`);
      } else {
        // Crear nuevo usuario
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        
        await prisma.user.create({
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            password: hashedPassword,
            role: userData.role,
            accountLocked: false,
            twoFactorEnabled: false,
            createdAt: new Date(),
            lastLogin: null
          }
        });
        console.log(`✅ Usuario ${userData.email} creado con contraseña: ${userData.password}`);
      }
    }

    // Mostrar resumen final
    const finalUsers = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        accountLocked: true,
        createdAt: true
      }
    });

    console.log('\n📋 Resumen de usuarios:');
    finalUsers.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - ${user.role} - ${user.accountLocked ? 'Bloqueado' : 'Activo'}`);
    });

    console.log('\n🎉 Usuarios de ejemplo creados exitosamente!');
    console.log('\n🔑 Contraseñas configuradas:');
    console.log('- Administrador: [Ver variable SAMPLE_ADMIN_PASSWORD]');
    console.log('- Managers: [Ver variable SAMPLE_MANAGER_PASSWORD]');
    console.log('- Usuarios: [Ver variable SAMPLE_USER_PASSWORD]');
    console.log('\n⚠️  IMPORTANTE: Configurar variables de entorno para contraseñas específicas.');

  } catch (error) {
    console.error('❌ Error creando usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleUsers(); 