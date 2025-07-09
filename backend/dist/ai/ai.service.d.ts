export declare class AiService {
    generateContent(prompt: string): Promise<{
        message: string;
        prompt: string;
    }>;
    analyzeText(text: string): Promise<{
        message: string;
        text: string;
    }>;
}
