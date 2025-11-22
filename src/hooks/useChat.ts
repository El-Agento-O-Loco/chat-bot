import { useState, useCallback } from 'react';
import type { Message, User } from '../types';
import { MessageService } from '../services/messageService';
import { AIService } from '../services/aiService';
import { AI_AGENT } from '../constants';

interface UseChatOptions {
  initialMessages?: Message[];
  onMessageSent?: (message: Message) => void;
}

/**
 * Custom hook for managing chat state and message handling
 * Now with real AI integration!
 */
export function useChat(options: UseChatOptions = {}) {
  const { initialMessages = [], onMessageSent } = options;
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isAIThinking, setIsAIThinking] = useState(false);

  /**
   * Sends a user message and triggers AI response if needed
   */
  const sendMessage = useCallback(async (user: User, text: string) => {
    const newMessage = MessageService.createMessage(user, text);
    setMessages(prev => [...prev, newMessage]);

    // Trigger callback if provided
    onMessageSent?.(newMessage);

    // Check if AI should respond (async now)
    setIsAIThinking(true);
    try {
      const aiResponse = await AIService.getResponse(
        text,
        user,
        messages // Pass conversation history for context
      );

      if (aiResponse.shouldRespond) {
        // Simulate typing delay
        setTimeout(() => {
          const aiMessage = MessageService.createMessage(AI_AGENT, aiResponse.text);
          setMessages(prev => [...prev, aiMessage]);
          setIsAIThinking(false);

          // Add keywords to graph if present
          if (aiResponse.keywords && onMessageSent) {
            const aiMsg = { ...aiMessage, keywords: aiResponse.keywords };
            onMessageSent(aiMsg as any);
          }
        }, AIService.getTypingDelay());
      } else {
        setIsAIThinking(false);
      }
    } catch (error) {
      console.error('AI Response Error:', error);
      setIsAIThinking(false);
    }

    return newMessage;
  }, [messages, onMessageSent]);

  return { messages, sendMessage, isAIThinking };
}
