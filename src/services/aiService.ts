import type { User } from '../types';

export interface AIResponse {
  shouldRespond: boolean;
  text: string;
}

/**
 * AI Service - Handles AI agent behavior and response logic
 */
export class AIService {
  /**
   * Determines if and how the AI should respond to a message
   * @param messageText - The text of the user's message
   * @param activeUser - The user who sent the message
   * @returns AIResponse object with response decision and text
   */
  static getResponse(messageText: string, activeUser: User): AIResponse {
    const lowerText = messageText.toLowerCase();
    let responseText: string | null = null;

    // Condition A: Direct Mention (@omni)
    if (lowerText.includes("@omni")) {
      responseText = `I'm here, ${activeUser.name}. I've logged that interaction in the graph.`;
    }
    // Condition B: Confidence Threshold (Specific Keywords trigger help)
    else if (lowerText.includes("deployment") || lowerText.includes("error")) {
      responseText = "I detected a discussion about Deployment. Checking pipeline status... All systems green.";
    }
    // Condition C: Random Health Check (1 in 10 chance)
    else if (Math.random() > 0.9) {
      responseText = "Quick health check: We haven't heard from the UX team on this thread recently. Is the design spec finalized?";
    }

    return {
      shouldRespond: responseText !== null,
      text: responseText || ""
    };
  }

  /**
   * Get the typing delay before AI responds (simulates natural delay)
   */
  static getTypingDelay(): number {
    return 1500; // 1.5 seconds
  }
}
