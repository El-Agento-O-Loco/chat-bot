import { useState, useCallback } from 'react';
import type { Message, GraphNode } from '../types';
import { AIService } from '../services/aiService';

/**
 * Custom hook for AI-powered features
 * Provides graph insights, context analysis, and smart task extraction
 */
export function useAIFeatures() {
  const [graphInsight, setGraphInsight] = useState<string>("");
  const [contextSummary, setContextSummary] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * Analyze knowledge graph and get AI insights
   */
  const analyzeGraph = useCallback(async (nodes: GraphNode[], messages: Message[]) => {
    if (nodes.length === 0) return;

    setIsAnalyzing(true);
    try {
      const insight = await AIService.analyzeKnowledgeGraph(nodes, messages);
      setGraphInsight(insight);
    } catch (error) {
      console.error('Graph Analysis Error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Analyze conversation context
   */
  const analyzeContext = useCallback(async (messages: Message[]) => {
    if (messages.length < 3) return;

    setIsAnalyzing(true);
    try {
      const summary = await AIService.analyzeContext(messages);
      setContextSummary(summary);
    } catch (error) {
      console.error('Context Analysis Error:', error);
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
    setContextSummary("");
  }, []);

  return {
    graphInsight,
    contextSummary,
    isAnalyzing,
    analyzeGraph,
    analyzeContext,
    extractTasks,
    clearInsights
  };
}
