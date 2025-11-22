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
 */
export function useChat(options: UseChatOptions = {}) {
  const { initialMessages = [], onMessageSent } = options;
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  /**
   * Sends a user message and triggers AI response if needed
   */
  const sendMessage = useCallback((user: User, text: string) => {
    const newMessage = MessageService.createMessage(user, text);
    setMessages(prev => [...prev, newMessage]);

    // Trigger callback if provided
    onMessageSent?.(newMessage);

    // Check if AI should respond
    const aiResponse = AIService.getResponse(text, user);
    if (aiResponse.shouldRespond) {
      setTimeout(() => {
        const aiMessage = MessageService.createMessage(AI_AGENT, aiResponse.text);
        setMessages(prev => [...prev, aiMessage]);
      }, AIService.getTypingDelay());
    }

    return newMessage;
  }, [onMessageSent]);

  return { messages, sendMessage };
}
