import { useState, useCallback } from 'react';
import type { Task } from '../types';
import { TaskService } from '../services/taskService';
import { generateId } from '../utils';

/**
 * Custom hook for managing tasks/action items
 * Now with AI-powered extraction support
 */
export function useTasks(initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  /**
   * Attempts to extract and add a task from message text (regex fallback)
   */
  const extractTask = useCallback((messageText: string, assignedTo: string) => {
    const newTask = TaskService.extractTask(messageText, assignedTo);
    if (newTask) {
      setTasks(prev => [...prev, newTask]);
    }
    return newTask;
  }, []);

  /**
   * Add tasks from AI extraction (array of task strings)
   */
  const addAITasks = useCallback((taskTexts: string[], assignedTo: string) => {
    console.log('addAITasks called with:', { taskTexts, assignedTo });

    const newTasks: Task[] = taskTexts.map(text => ({
      id: generateId(),
      text,
      assignedTo,
      completed: false
    }));

    console.log('Created task objects:', newTasks);

    if (newTasks.length > 0) {
      setTasks(prev => {
        console.log('Previous tasks:', prev);
        const updated = [...prev, ...newTasks];
        console.log('Updated tasks:', updated);
        return updated;
      });
    }

    return newTasks;
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
    addAITasks,
    toggleTask,
    deleteTask,
    clearAllTasks
  };
}
