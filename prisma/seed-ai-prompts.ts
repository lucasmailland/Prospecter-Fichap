import { PrismaClient, PromptCategory } from '@prisma/client';

const prisma = new PrismaClient();

const defaultPrompts = [
  {
    name: 'Email de Primer Contacto',
    description: 'Email inicial para contactar nuevos leads',
    category: 'EMAIL' as PromptCategory,
    prompt: `Asunto: {company} - Propuesta de colaboración

Hola {firstName},

Espero que este mensaje te encuentre bien. Me llamo [Tu nombre] y me pongo en contacto contigo desde {yourCompany}.

He estado investigando sobre {company} y me ha impresionado {specificDetail}. Creo que podríamos ayudarles a {valueProposition}.

¿Tendrías 15 minutos esta semana para una breve llamada? Me gustaría compartir contigo cómo hemos ayudado a empresas similares a {company} a {specificBenefit}.

Quedo atento a tu respuesta.

Saludos cordiales,
{yourName}
{yourTitle}
{yourCompany}`,
    variables: {
      firstName: 'Nombre del contacto',
      company: 'Empresa del lead',
      specificDetail: 'Detalle específico sobre la empresa',
      valueProposition: 'Propuesta de valor',
      specificBenefit: 'Beneficio específico',
      yourName: 'Tu nombre',
      yourTitle: 'Tu cargo',
      yourCompany: 'Tu empresa'
    },
    isPublic: true
  },
  {
    name: 'Email de Seguimiento',
    description: 'Email para hacer seguimiento después del primer contacto',
    category: 'FOLLOW_UP' as PromptCategory,
    prompt: `Asunto: Re: {company} - Seguimiento de nuestra propuesta

Hola {firstName},

Hace unos días te envié un mensaje sobre cómo podríamos ayudar a {company} con {solution}. 

Entiendo que puedes estar ocupado, pero quería asegurarme de que recibiste mi mensaje anterior. 

{additionalValue}

Si no es el momento adecuado, me gustaría saber cuándo sería mejor para ti. ¿Qué te parece si programamos una breve llamada para {timeframe}?

Quedo atento a tu respuesta.

Saludos,
{yourName}`,
    variables: {
      firstName: 'Nombre del contacto',
      company: 'Empresa del lead',
      solution: 'Solución propuesta',
      additionalValue: 'Valor adicional o case study',
      timeframe: 'Marco temporal sugerido',
      yourName: 'Tu nombre'
    },
    isPublic: true
  },
  {
    name: 'Mensaje de LinkedIn',
    description: 'Mensaje personalizado para LinkedIn',
    category: 'LINKEDIN' as PromptCategory,
    prompt: `Hola {firstName},

Vi tu perfil y me impresionó tu experiencia en {industry}. Trabajo en {yourCompany} ayudando a empresas como {company} a {valueProposition}.

Me gustaría conectar contigo y compartir algunas ideas que podrían ser relevantes para {company}.

¿Te interesaría una breve conversación?

Saludos,
{yourName}`,
    variables: {
      firstName: 'Nombre del contacto',
      industry: 'Industria del contacto',
      company: 'Empresa del lead',
      valueProposition: 'Propuesta de valor',
      yourCompany: 'Tu empresa',
      yourName: 'Tu nombre'
    },
    isPublic: true
  },
  {
    name: 'Análisis de Lead',
    description: 'Prompt para analizar la calidad de un lead',
    category: 'ANALYSIS' as PromptCategory,
    prompt: `Analiza este lead y proporciona un score de calidad del 1 al 100:

Información del lead:
- Nombre: {fullName}
- Empresa: {company}
- Cargo: {jobTitle}
- Industria: {industry}
- Tamaño empresa: {companySize}
- Ubicación: {location}
- Fuente: {source}
- Notas: {notes}

Evalúa:
1. Fit con el ICP (Ideal Customer Profile)
2. Autoridad para tomar decisiones
3. Necesidad aparente
4. Presupuesto potencial
5. Timing

Proporciona:
- Score total (1-100)
- Justificación del score
- Próximos pasos recomendados
- Riesgos y oportunidades`,
    variables: {
      fullName: 'Nombre completo',
      company: 'Empresa',
      jobTitle: 'Cargo',
      industry: 'Industria',
      companySize: 'Tamaño de empresa',
      location: 'Ubicación',
      source: 'Fuente del lead',
      notes: 'Notas adicionales'
    },
    isPublic: true
  },
  {
    name: 'Propuesta Comercial',
    description: 'Template para generar propuestas comerciales',
    category: 'PROPOSAL' as PromptCategory,
    prompt: `PROPUESTA COMERCIAL PARA {company}

Estimado/a {firstName},

Tras nuestra conversación, me complace presentarte esta propuesta personalizada para {company}.

SITUACIÓN ACTUAL:
{currentSituation}

OBJETIVOS IDENTIFICADOS:
{objectives}

NUESTRA SOLUCIÓN:
{proposedSolution}

BENEFICIOS ESPERADOS:
- {benefit1}
- {benefit2}
- {benefit3}

INVERSIÓN:
{investmentDetails}

PRÓXIMOS PASOS:
1. {step1}
2. {step2}
3. {step3}

Quedo a tu disposición para cualquier consulta.

Saludos cordiales,
{yourName}
{yourTitle}
{yourCompany}`,
    variables: {
      company: 'Empresa del cliente',
      firstName: 'Nombre del contacto',
      currentSituation: 'Situación actual del cliente',
      objectives: 'Objetivos del cliente',
      proposedSolution: 'Solución propuesta',
      benefit1: 'Beneficio 1',
      benefit2: 'Beneficio 2',
      benefit3: 'Beneficio 3',
      investmentDetails: 'Detalles de inversión',
      step1: 'Primer paso',
      step2: 'Segundo paso',
      step3: 'Tercer paso',
      yourName: 'Tu nombre',
      yourTitle: 'Tu cargo',
      yourCompany: 'Tu empresa'
    },
    isPublic: true
  },
  {
    name: 'Manejo de Objeciones - Precio',
    description: 'Respuesta para objeciones sobre precio',
    category: 'OBJECTION_HANDLING' as PromptCategory,
    prompt: `Entiendo perfectamente tu preocupación sobre el precio, {firstName}. Es una consideración importante y me alegra que la plantees.

Permíteme ponerte en perspectiva el valor que esto representa para {company}:

RETORNO DE INVERSIÓN:
{roiCalculation}

COMPARACIÓN CON ALTERNATIVAS:
{competitorComparison}

RIESGO DE NO ACTUAR:
{costOfInaction}

OPCIONES DE PAGO:
{paymentOptions}

¿Qué te parece si analizamos juntos los números específicos para {company}? Podríamos programar una sesión de 30 minutos para revisar el ROI proyectado.

¿Cuándo te vendría bien?`,
    variables: {
      firstName: 'Nombre del contacto',
      company: 'Empresa del cliente',
      roiCalculation: 'Cálculo de ROI',
      competitorComparison: 'Comparación con competidores',
      costOfInaction: 'Costo de no actuar',
      paymentOptions: 'Opciones de pago'
    },
    isPublic: true
  }
];

async function seedAIPrompts() {
  console.log('🌱 Seeding AI prompts...');

  try {
    // Buscar un usuario admin para asignar los prompts
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.');
      return;
    }

    // Crear los prompts
    for (const promptData of defaultPrompts) {
      const existingPrompt = await prisma.promptTemplate.findFirst({
        where: {
          name: promptData.name,
          userId: adminUser.id
        }
      });

      if (!existingPrompt) {
        await prisma.promptTemplate.create({
          data: {
            ...promptData,
            userId: adminUser.id
          }
        });
        console.log(`✅ Created prompt: ${promptData.name}`);
      } else {
        console.log(`⏭️  Prompt already exists: ${promptData.name}`);
      }
    }

    console.log('🎉 AI prompts seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding AI prompts:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedAIPrompts()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seedAIPrompts; 