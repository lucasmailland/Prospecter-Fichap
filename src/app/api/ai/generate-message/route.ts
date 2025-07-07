import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { leadData, messageType, context } = await request.json();

    // Por ahora simularemos la respuesta de OpenAI con mensajes inteligentes
    // En producción aquí iría la integración real con OpenAI
    const generatedMessage = await generateMessage(leadData, messageType, context);

    return NextResponse.json({
      success: true,
      message: generatedMessage,
      messageType,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
// console.error('Error generating AI message:', error);
    return NextResponse.json(
      { success: false, error: 'Error al generar mensaje' },
      { status: 500 }
    );
  }
}

async function generateMessage(leadData: any, messageType: 'email' | 'whatsapp', context: any) {
  const { name, company, jobTitle, score } = leadData;
  const firstName = name.split(' ')[0];
  
  // Determinar el tono y estrategia basado en el score
  const isHotLead = score >= 80;
  const isWarmLead = score >= 60;
  
  if (messageType === 'email') {
    if (isHotLead) {
      return `Asunto: Propuesta estratégica para ${company} - Reunión ejecutiva

Hola ${firstName},

Espero que te encuentres muy bien. He estado analizando el perfil de ${company} y veo que están en un momento de crecimiento estratégico perfecto para implementar soluciones que maximicen su eficiencia operacional.

Como ${jobTitle}, seguramente estás buscando maneras de:
• Optimizar procesos y reducir costos operativos
• Mejorar la productividad de tu equipo
• Implementar tecnologías que generen ROI inmediato

Me gustaría proponerte una reunión ejecutiva de 30 minutos para mostrarte cómo hemos ayudado a empresas similares a ${company} a lograr resultados medibles en menos de 90 días.

¿Tienes disponibilidad esta semana para una llamada? Puedo adaptarme a tu agenda.

Saludos cordiales,
[Tu nombre]

P.D.: Te enviaré un caso de estudio específico de tu industria que creo que te resultará muy relevante.`;
    } else if (isWarmLead) {
      return `Asunto: Recursos valiosos para ${company} - Sin compromiso

Hola ${firstName},

Espero que estés teniendo una excelente semana. Quería compartir contigo algunos recursos que podrían ser de valor para ${company}, especialmente considerando tu rol como ${jobTitle}.

He preparado un análisis comparativo de las mejores prácticas en tu industria que incluye:
• Tendencias actuales del mercado
• Estrategias que están implementando empresas líderes
• Métricas clave que deberías estar monitoreando

¿Te interesaría recibir este reporte? Es completamente gratuito y no requiere ningún compromiso de tu parte.

Si te parece útil, podríamos agendar una breve llamada para discutir cómo estas tendencias podrían aplicarse específicamente a ${company}.

¡Que tengas un excelente día!

Saludos,
[Tu nombre]`;
    } else {
      return `Asunto: Contenido exclusivo para profesionales como tú

Hola ${firstName},

Espero que te encuentres muy bien. Como ${jobTitle} en ${company}, seguramente estás siempre buscando maneras de mantenerte actualizado en las últimas tendencias de la industria.

Quería invitarte a nuestro próximo webinar gratuito: "Estrategias Innovadoras para Líderes del Siglo XXI", donde cubriremos:

• Las 5 tendencias que están transformando la industria
• Herramientas prácticas para optimizar la gestión de equipos
• Casos de éxito reales y aplicables

El webinar es el próximo martes a las 11:00 AM y dura solo 45 minutos.

¿Te gustaría que te reserve un cupo? Es completamente gratuito.

Saludos cordiales,
[Tu nombre]`;
    }
  } else { // WhatsApp
    if (isHotLead) {
      return `Hola ${firstName}! 👋

Espero que tengas un excelente día. 

He estado revisando el perfil de ${company} y creo que tenemos una oportunidad muy interesante para discutir. 🚀

Como ${jobTitle}, seguramente estás buscando soluciones que generen impacto real en tus resultados.

¿Tendrías 15 minutos esta semana para una llamada rápida? Te puedo mostrar exactamente cómo hemos ayudado a empresas similares a lograr:

✅ 30% de reducción en costos operativos
✅ 45% de mejora en productividad
✅ ROI positivo en menos de 3 meses

¿Te parece si coordinamos para mañana o pasado? 📅

¡Saludos!`;
    } else if (isWarmLead) {
      return `Hola ${firstName}! 😊

¿Cómo has estado? Espero que muy bien.

Quería compartir contigo algo que creo que te va a interesar mucho. Acabamos de publicar un caso de estudio súper relevante para empresas como ${company}. 📊

Es sobre cómo una empresa similar logró:
• 25% de aumento en eficiencia
• Reducción significativa en tiempos de proceso
• Mejor experiencia para sus clientes

¿Te gustaría que te lo envíe? Es gratis y creo que como ${jobTitle} te va a dar ideas muy valiosas. 💡

Solo dime si te interesa y te lo mando al toque! 📱`;
    } else {
      return `Hola ${firstName}! 👋

¿Cómo va todo en ${company}?

Te escribo porque tenemos un webinar súper interesante la próxima semana que creo que te puede servir mucho. 🎯

Es sobre "Tendencias 2025 para Líderes" y van a estar algunos CEO's compartiendo sus estrategias más exitosas.

Como ${jobTitle}, seguro que te van a interesar los temas:
• Innovación en gestión de equipos
• Tecnologías que están marcando la diferencia
• Casos de éxito reales

¿Te animo a que te registres? Es gratis y son solo 45 minutos. 

Te mando el link si te interesa! 🔗

¡Saludos! 😊`;
    }
  }
} 