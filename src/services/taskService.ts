import type { Task } from '../types';
import { detectActionItems, generateId } from '../utils';

/**
 * Task Service - Handles task/action item operations
 */
export class TaskService {
  /**
   * Attempts to extract an action item from message text
   * @param messageText - The message text to analyze
   * @param assignedTo - The user to assign the task to
   * @returns A new Task object if action item detected, null otherwise
   */
  static extractTask(messageText: string, assignedTo: string): Task | null {
    const actionText = detectActionItems(messageText);

    if (!actionText) {
      return null;
    }

    return {
      id: generateId(),
      text: actionText,
      assignedTo,
      completed: false
    };
  }

  /**
   * Toggles task completion status
   * @param tasks - Current tasks array
   * @param taskId - ID of task to toggle
   * @returns Updated tasks array
   */
  static toggleTask(tasks: Task[], taskId: number): Task[] {
    return tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
  }

  /**
   * Removes a task from the list
   * @param tasks - Current tasks array
   * @param taskId - ID of task to remove
   * @returns Updated tasks array
   */
  static deleteTask(tasks: Task[], taskId: number): Task[] {
    return tasks.filter(task => task.id !== taskId);
  }
}
