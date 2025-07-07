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
    const { leadId, type, leadIds } = body;

    if (type === 'batch' && leadIds && Array.isArray(leadIds)) {
      // Batch analysis
      const results = await openaiService.batchAnalyzeLeads(session.user.id, leadIds);
      
      return NextResponse.json({
        success: true,
        data: results
      });
    } else if (leadId) {
      // Single lead analysis
      const sentiment = await openaiService.analyzeLeadSentiment(session.user.id, leadId);
      const scoring = await openaiService.generateLeadScore(session.user.id, leadId);
      
      return NextResponse.json({
        success: true,
        data: {
          sentiment,
          scoring
        }
      });
    } else {
      return NextResponse.json({ 
        error: 'leadId or leadIds array is required' 
      }, { status: 400 });
    }

  } catch (error) {
// console.error('Error analyzing lead:', error);
    
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