import type { Message, User } from '../types';
import { generateId } from '../utils';

/**
 * Message Service - Handles message creation and formatting
 */
export class MessageService {
  /**
   * Creates a new message object
   * @param user - The user sending the message
   * @param text - The message text
   * @returns A new Message object
   */
  static createMessage(user: User, text: string): Message {
    return {
      id: generateId(),
      user,
      text,
      timestamp: this.getCurrentTime()
    };
  }

  /**
   * Gets current time formatted for display
   * @returns Time string in HH:MM format
   */
  private static getCurrentTime(): string {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
