import { useState, useCallback } from 'react';
import type { GraphNode } from '../types';
import { AIService } from '../services/aiService';

/**
 * Custom hook for AI-powered features
 * Provides graph insights, context analysis, and smart task extraction
 */
export function useAIFeatures() {
  const [graphInsight, setGraphInsight] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * Analyze knowledge graph and get AI insights
   */
  const analyzeGraph = useCallback(async (nodes: GraphNode[]) => {
    if (nodes.length === 0) return;

    setIsAnalyzing(true);
    try {
      const insight = await AIService.analyzeKnowledgeGraph(nodes);
      setGraphInsight(insight);
    } catch (error) {
      console.error('Graph Analysis Error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Extract tasks from message using AI
   */
  const extractTasks = useCallback(async (messageText: string, userName: string): Promise<string[]> => {
    try {
      return await AIService.extractTasks(messageText, userName);
    } catch (error) {
      console.error('Task Extraction Error:', error);
      return [];
    }
  }, []);

  /**
   * Clear insights
   */
  const clearInsights = useCallback(() => {
    setGraphInsight("");
  }, []);

  return {
    graphInsight,
    isAnalyzing,
    analyzeGraph,
    extractTasks,
    clearInsights
  };
}
