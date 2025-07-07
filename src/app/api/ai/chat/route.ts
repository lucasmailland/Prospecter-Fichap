import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { OpenAIService } from '@/services/openai.service';

const openaiService = OpenAIService.getInstance();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, message, title, context } = body;

    if (!message) {
      return NextResponse.json({ 
        error: 'Message is required' 
      }, { status: 400 });
    }

    let finalConversationId = conversationId;

    // Create new conversation if needed
    if (!conversationId) {
      if (!title) {
        return NextResponse.json({ 
          error: 'Title is required for new conversations' 
        }, { status: 400 });
      }

      const conversation = await openaiService.createConversation(
        session.user.id, 
        title, 
        context
      );
      finalConversationId = conversation.id;
    }

    const result = await openaiService.sendMessage(
      session.user.id, 
      finalConversationId, 
      message
    );

    return NextResponse.json({
      success: true,
      data: {
        conversationId: finalConversationId,
        message: result.message,
        tokensUsed: result.tokensUsed,
        cost: result.cost
      }
    });

  } catch (error) {
// console.error('Error in AI chat:', error);
    
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