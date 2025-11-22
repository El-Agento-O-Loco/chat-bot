import { useState, useCallback } from 'react';
import type { Task } from '../types';
import { TaskService } from '../services/taskService';

/**
 * Custom hook for managing tasks/action items
 */
export function useTasks(initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  /**
   * Attempts to extract and add a task from message text
   */
  const extractTask = useCallback((messageText: string, assignedTo: string) => {
    const newTask = TaskService.extractTask(messageText, assignedTo);
    if (newTask) {
      setTasks(prev => [...prev, newTask]);
    }
    return newTask;
  }, []);

  /**
   * Toggles task completion status
   */
  const toggleTask = useCallback((taskId: number) => {
    setTasks(prev => TaskService.toggleTask(prev, taskId));
  }, []);

  /**
   * Deletes a task
   */
  const deleteTask = useCallback((taskId: number) => {
    setTasks(prev => TaskService.deleteTask(prev, taskId));
  }, []);

  /**
   * Clears all tasks
   */
  const clearAllTasks = useCallback(() => {
    setTasks([]);
  }, []);

  return {
    tasks,
    extractTask,
    toggleTask,
    deleteTask,
    clearAllTasks
  };
}
