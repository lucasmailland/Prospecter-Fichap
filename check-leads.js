const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkLeads() {
  try {
    console.log('🔍 Verificando leads en la base de datos...');
    
    // Verificar si la tabla Lead existe y tiene datos
    try {
      const leads = await prisma.lead.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      console.log(`\n📊 Total de leads encontrados: ${leads.length}`);
      
      if (leads.length === 0) {
        console.log('❌ No hay leads en la base de datos');
        console.log('💡 La tabla Lead existe pero está vacía');
        console.log('🔧 Puedes crear leads desde la interfaz web o importarlos');
      } else {
        console.log('\n🎯 Leads existentes (últimos 10):');
        leads.forEach((lead, index) => {
          const displayName = lead.firstName && lead.lastName 
            ? `${lead.firstName} ${lead.lastName}`
            : lead.fullName || 'Sin nombre';
          
          console.log(`${index + 1}. ${displayName}`);
          console.log(`   📧 Email: ${lead.email || 'Sin email'}`);
          console.log(`   🏢 Empresa: ${lead.company || 'Sin empresa'}`);
          console.log(`   💼 Cargo: ${lead.jobTitle || 'Sin cargo'}`);
          console.log(`   📊 Score: ${lead.score || 0}`);
          console.log(`   📈 Estado: ${lead.status}`);
          console.log(`   👤 Usuario: ${lead.user.firstName} ${lead.user.lastName} (${lead.user.email})`);
          console.log(`   📅 Creado: ${lead.createdAt.toLocaleDateString('es-ES')}`);
          console.log('');
        });
      }
    } catch (error) {
      if (error.code === 'P2021') {
        console.log('❌ La tabla Lead no existe en la base de datos');
        console.log('🔧 Necesitamos ejecutar las migraciones');
      } else {
        throw error;
      }
    }

    // Verificar otras tablas relacionadas
    console.log('\n🔍 Verificando otras tablas relacionadas...');
    
    try {
      const enrichmentLogs = await prisma.enrichmentLog.count();
      console.log(`📝 EnrichmentLogs: ${enrichmentLogs}`);
    } catch (error) {
      console.log('❌ Tabla EnrichmentLog no encontrada');
    }

    try {
      const hubspotContacts = await prisma.hubSpotContact.count();
      console.log(`🔗 HubSpot Contacts: ${hubspotContacts}`);
    } catch (error) {
      console.log('❌ Tabla HubSpotContact no encontrada');
    }

    try {
      const aiGenerations = await prisma.aIGeneration.count();
      console.log(`🤖 AI Generations: ${aiGenerations}`);
    } catch (error) {
      console.log('❌ Tabla AIGeneration no encontrada');
    }

    // Verificar el esquema actual
    console.log('\n📋 Verificando esquema de base de datos...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    console.log('📊 Tablas existentes:');
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });

    // Sugerencias para crear leads
    if (leads.length === 0) {
      console.log('\n💡 Para crear leads de ejemplo, puedes:');
      console.log('   1. Ir a http://localhost:3000/leads');
      console.log('   2. Hacer clic en "Nuevo Lead"');
      console.log('   3. O importar desde HubSpot si tienes configurado');
    }

  } catch (error) {
    console.error('❌ Error verificando leads:', error);
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Verificar que la base de datos esté funcionando');
    console.log('   2. Ejecutar: npx prisma db push');
    console.log('   3. Verificar las variables de entorno');
  } finally {
    await prisma.$disconnect();
  }
}

checkLeads(); 