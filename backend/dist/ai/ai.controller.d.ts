import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generateContent(data: {
        prompt: string;
    }): Promise<{
        message: string;
        prompt: string;
    }>;
    analyzeText(data: {
        text: string;
    }): Promise<{
        message: string;
        text: string;
    }>;
}
