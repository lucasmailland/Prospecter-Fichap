import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { OpenAIService } from '@/services/openai.service';
import { PromptCategory } from '@prisma/client';

const openaiService = OpenAIService.getInstance();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, prompt, variables, isPublic } = body;

    if (!name || !category || !prompt) {
      return NextResponse.json({ 
        error: 'Name, category, and prompt are required' 
      }, { status: 400 });
    }

    // Validate category
    if (!Object.values(PromptCategory).includes(category)) {
      return NextResponse.json({ 
        error: 'Invalid prompt category' 
      }, { status: 400 });
    }

    const template = await openaiService.createPromptTemplate(session.user.id, {
      name,
      description,
      category,
      prompt,
      variables,
      isPublic
    });

    return NextResponse.json({
      success: true,
      data: template
    });

  } catch (error) {
    console.error('Error creating prompt template:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as PromptCategory | null;

    const templates = await openaiService.getPromptTemplates(
      session.user.id, 
      category || undefined
    );

    return NextResponse.json({
      success: true,
      data: templates
    });

  } catch (error) {
    console.error('Error getting prompt templates:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 