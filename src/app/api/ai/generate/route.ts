import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { OpenAIService } from '@/services/openai.service';
import { GenerationType } from '@prisma/client';

const openaiService = OpenAIService.getInstance();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      type, 
      input, 
      leadId, 
      promptTemplateId, 
      customPrompt, 
      variables 
    } = body;

    if (!type || !input) {
      return NextResponse.json({ 
        error: 'Type and input are required' 
      }, { status: 400 });
    }

    // Validate generation type
    if (!Object.values(GenerationType).includes(type)) {
      return NextResponse.json({ 
        error: 'Invalid generation type' 
      }, { status: 400 });
    }

    const result = await openaiService.generateContent(session.user.id, {
      type,
      input,
      leadId,
      promptTemplateId,
      customPrompt,
      variables
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
// console.error('Error generating content:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: error.message 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 