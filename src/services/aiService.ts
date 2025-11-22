import type { User, Message, GraphNode } from '../types';
import { chatCompletion, type ChatMessage } from './apiService';

export interface AIResponse {
  shouldRespond: boolean;
  text: string;
}

/**
 * AI Service - Handles all AI-powered features using real backend
 */
export class AIService {
  /**
   * Get AI response for a chat message
   * @param messageText - The user's message
   * @param activeUser - The user who sent the message
   * @param conversationHistory - Recent messages for context
   * @returns AIResponse with decision and text
   */
  static async getResponse(
    messageText: string,
    activeUser: User,
    conversationHistory: Message[] = []
  ): Promise<AIResponse> {
    const lowerText = messageText.toLowerCase();

    // Check if AI should respond
    const shouldRespond =
      lowerText.includes("@omni") ||
      lowerText.includes("deployment") ||
      lowerText.includes("error") ||
      lowerText.includes("help") ||
      lowerText.includes("?");

    if (!shouldRespond) {
      return { shouldRespond: false, text: "" };
    }

    try {
      // Build conversation context (last 5 messages)
      const recentMessages = conversationHistory.slice(-5);
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: `You are Omni, an AI assistant helping a development team. You're observing a chat between team members: Dev Lead, Stakeholder, and Data Scientist.

Your role:
- Provide helpful technical insights
- Track project context and remind about important details
- Be concise and professional (1-2 sentences max)
- Don't apologize or be overly verbose
- Focus on actionable information

Current context:
- Team is discussing: ${this.extractTopics(recentMessages).join(", ")}
- Active user: ${activeUser.name}`
        },
        // Add recent conversation history
        ...recentMessages.map(msg => ({
          role: (msg.user.id === 'ai' ? 'assistant' : 'user') as 'user' | 'assistant',
          content: `${msg.user.name}: ${msg.text}`
        })),
        // Add current message
        {
          role: 'user',
          content: messageText
        }
      ];

      const responseText = await chatCompletion(messages);

      return {
        shouldRespond: true,
        text: responseText
      };
    } catch (error) {
      console.error('AI Response Error:', error);
      // Fallback to simple response
      return {
        shouldRespond: true,
        text: `I'm here to help, ${activeUser.name}. I'm currently experiencing connection issues, but I'm tracking this conversation.`
      };
    }
  }

  /**
   * Analyze knowledge graph and provide insights
   */
  static async analyzeKnowledgeGraph(
    nodes: GraphNode[],
    messages: Message[]
  ): Promise<string> {
    if (nodes.length === 0) return "";

    try {
      const nodesList = nodes.map(n => `${n.id} (importance: ${n.size})`).join(", ");
      const recentTopics = this.extractTopics(messages.slice(-10));

      const analysisMessages: ChatMessage[] = [
        {
          role: 'system',
          content: 'You are analyzing a knowledge graph of team discussion topics. Provide ONE brief insight or suggestion (1 sentence max).'
        },
        {
          role: 'user',
          content: `Topics discussed: ${nodesList}
Recent focus: ${recentTopics.join(", ")}

What's one important insight or potential issue to highlight?`
        }
      ];

      return await chatCompletion(analysisMessages);
    } catch (error) {
      console.error('Graph Analysis Error:', error);
      return "";
    }
  }

  /**
   * Extract tasks from message using AI (better than regex)
   */
  static async extractTasks(
    messageText: string,
    userName: string
  ): Promise<string[]> {
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

      // Try to parse JSON response
      try {
        const tasks = JSON.parse(response);
        return Array.isArray(tasks) ? tasks : [];
      } catch {
        // If not valid JSON, return empty array
        return [];
      }
    } catch (error) {
      console.error('Task Extraction Error:', error);
      return [];
    }
  }

  /**
   * Analyze conversation context and provide summary
   */
  static async analyzeContext(messages: Message[]): Promise<string> {
    if (messages.length < 3) return "";

    try {
      const recentMessages = messages.slice(-10);
      const conversationText = recentMessages
        .map(m => `${m.user.name}: ${m.text}`)
        .join("\n");

      const analysisMessages: ChatMessage[] = [
        {
          role: 'system',
          content: 'Analyze the conversation and provide ONE brief insight about team progress, blockers, or next steps (1 sentence).'
        },
        {
          role: 'user',
          content: conversationText
        }
      ];

      return await chatCompletion(analysisMessages);
    } catch (error) {
      console.error('Context Analysis Error:', error);
      return "";
    }
  }

  /**
   * Get typing delay (simulated)
   */
  static getTypingDelay(): number {
    return 1500; // 1.5 seconds
  }

  /**
   * Extract topics from messages (helper)
   */
  private static extractTopics(messages: Message[]): string[] {
    const keywords = new Set<string>();
    const topicWords = ["optimization", "deployment", "budget", "api", "latency",
                        "model", "gpu", "dataset", "stakeholder", "timeline",
                        "blocker", "security"];

    messages.forEach(msg => {
      const text = msg.text.toLowerCase();
      topicWords.forEach(word => {
        if (text.includes(word)) {
          keywords.add(word);
        }
      });
    });

    return Array.from(keywords);
  }
}
