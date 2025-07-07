import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const API_KEYS = [
  // OpenAI
  'OPENAI_API_KEY', 'OPENAI_MODEL', 'OPENAI_TEMPERATURE', 'OPENAI_MAX_TOKENS', 'OPENAI_IS_ACTIVE',
  // HubSpot
  'HUBSPOT_API_KEY', 'HUBSPOT_ENV', 'HUBSPOT_ACCOUNT_NAME',
  // Clearbit
  'CLEARBIT_API_KEY', 'CLEARBIT_NAME',
  // Hunter.io
  'HUNTERIO_API_KEY', 'HUNTERIO_NAME',
  // MailboxLayer
  'MAILBOXLAYER_API_KEY', 'MAILBOXLAYER_NAME',
];

function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN';
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const configs = await prisma.systemConfiguration.findMany({
    where: { key: { in: API_KEYS } },
    select: { key: true, value: true, type: true, description: true, category: true, isEncrypted: true },
  });
  // Para campos encriptados, no exponer el valor pero indicar si está configurado
  const safeConfigs = configs.map(cfg => {
    if (cfg.isEncrypted) {
      return { 
        ...cfg, 
        value: '', 
        hasValue: cfg.value && cfg.value.length > 0 
      };
    }
    return cfg;
  });
  return NextResponse.json({ success: true, configs: safeConfigs });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await request.json();
  const updates = Array.isArray(body) ? body : [body];
  for (const update of updates) {
    if (!API_KEYS.includes(update.key)) continue;
    await prisma.systemConfiguration.update({
      where: { key: update.key },
      data: { value: update.value, updatedAt: new Date() },
    });
  }
  return NextResponse.json({ success: true });
} 