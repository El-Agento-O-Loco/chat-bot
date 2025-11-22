import type { User, Message, GraphNode } from '../types';
import { chatCompletion, type ChatMessage } from './apiService';

export interface AIResponse {
  shouldRespond: boolean;
  text: string;
  keywords?: string[];
}

export class AIService {
  /**
   * Get AI response + extract keywords for graph
   */
  static async getResponse(
    messageText: string,
    activeUser: User,
    conversationHistory: Message[] = []
  ): Promise<AIResponse> {
    try {
      const recentMessages = conversationHistory.slice(-5);
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: `You are Omni, an AI assistant helping a development team.

Your role:
- Provide helpful technical insights (1-2 sentences max)
- Be concise and professional
- Focus on actionable information

After your response, on a new line, list 2-5 relevant technical keywords from the conversation.
Format: KEYWORDS: keyword1, keyword2, keyword3`
        },
        ...recentMessages.map(msg => ({
          role: (msg.user.id === 'ai' ? 'assistant' : 'user') as 'user' | 'assistant',
          content: `${msg.user.name}: ${msg.text}`
        })),
        {
          role: 'user',
          content: messageText
        }
      ];

      const responseText = await chatCompletion(messages);

      // Extract keywords from response
      const keywords: string[] = [];
      const keywordMatch = responseText.match(/KEYWORDS:\s*(.+)/i);
      let cleanResponse = responseText;

      if (keywordMatch) {
        const keywordStr = keywordMatch[1];
        keywords.push(...keywordStr.split(',').map(k => k.trim()).filter(k => k));
        cleanResponse = responseText.replace(/KEYWORDS:.*$/im, '').trim();
      }

      return {
        shouldRespond: true,
        text: cleanResponse,
        keywords: keywords.length > 0 ? keywords : undefined
      };
    } catch (error) {
      console.error('AI Response Error:', error);
      return {
        shouldRespond: true,
        text: `I'm here to help, ${activeUser.name}. I'm currently experiencing connection issues, but I'm tracking this conversation.`
      };
    }
  }

  static async analyzeKnowledgeGraph(nodes: GraphNode[]): Promise<string> {
    if (nodes.length === 0) return "";
    try {
      const nodesList = nodes.map(n => `${n.id} (importance: ${n.size})`).join(", ");
      const analysisMessages: ChatMessage[] = [
        {
          role: 'system',
          content: 'You are analyzing a knowledge graph of team discussion topics. Provide ONE brief insight or suggestion (1 sentence max).'
        },
        {
          role: 'user',
          content: `Topics discussed: ${nodesList}\n\nWhat's one important insight or potential issue to highlight?`
        }
      ];
      return await chatCompletion(analysisMessages);
    } catch (error) {
      console.error('Graph Analysis Error:', error);
      return "";
    }
  }

  static async extractTasks(messageText: string, userName: string): Promise<string[]> {
    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: `Extract action items from the message. Return ONLY a JSON array of task strings, or empty array if none.
Example: ["deploy API to production", "update documentation"]
Be strict - only extract clear, actionable tasks.`
        },
        {
          role: 'user',
          content: `Message from ${userName}: "${messageText}"`
        }
      ];

      const response = await chatCompletion(messages);
      console.log('AI Task Extraction Response:', response);

      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }
      const jsonMatch = cleanedResponse.match(/\[.*\]/s);
      if (jsonMatch) {
        cleanedResponse = jsonMatch[0];
      }

      const tasks = JSON.parse(cleanedResponse);
      console.log('Parsed tasks:', tasks);
      return Array.isArray(tasks) ? tasks : [];
    } catch (parseError) {
      console.error('Failed to parse AI task response:', parseError);
      return [];
    }
  }

  static getTypingDelay(): number {
    return 1500;
  }
}
