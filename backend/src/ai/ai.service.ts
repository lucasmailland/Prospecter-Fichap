import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async generateContent(prompt: string) {
    // TODO: Implementar integración con OpenAI
    return { message: 'Contenido generado', prompt };
  }

  async analyzeText(text: string) {
    // TODO: Implementar análisis de texto
    return { message: 'Texto analizado', text };
  }
} 