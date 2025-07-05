const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Verificando usuarios en la base de datos...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        role: true,
        accountLocked: true,
        createdAt: true,
        lastLogin: true
      }
    });

    console.log(`\n📊 Total de usuarios encontrados: ${users.length}`);
    
    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      console.log('💡 Necesitamos crear el usuario admin');
    } else {
      console.log('\n👥 Usuarios existentes:');
      users.forEach((user, index) => {
        const displayName = user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}`
          : user.name || 'Sin nombre';
        
        console.log(`${index + 1}. ${displayName}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🎭 Rol: ${user.role}`);
        console.log(`   🔒 Estado: ${user.accountLocked ? 'Bloqueado' : 'Activo'}`);
        console.log(`   📅 Creado: ${user.createdAt.toLocaleDateString('es-ES')}`);
        console.log(`   🕐 Último acceso: ${user.lastLogin ? user.lastLogin.toLocaleDateString('es-ES') : 'Nunca'}`);
        console.log('');
      });
    }

    // Verificar si existe el admin
    const adminUser = users.find(u => u.email === 'lucas@prospecter.com');
    if (!adminUser) {
      console.log('⚠️  No se encontró el usuario admin (lucas@prospecter.com)');
      console.log('🔧 Ejecuta: node create-sample-users.js');
    } else {
      console.log('✅ Usuario admin encontrado');
      console.log('🔑 Contraseña: Admin1234!');
    }

  } catch (error) {
    console.error('❌ Error verificando usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers(); 