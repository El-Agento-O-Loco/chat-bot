import { useState, useEffect, useCallback } from 'react';
import type { GraphNode, GraphLink } from '../types';
import { GraphService } from '../services/graphService';

/**
 * Custom hook for managing knowledge graph state and physics simulation
 */
export function useKnowledgeGraph(initialNode?: GraphNode) {
  const [nodes, setNodes] = useState<GraphNode[]>(
    initialNode ? [initialNode] : []
  );
  const [links, setLinks] = useState<GraphLink[]>([]);

  // Physics simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prevNodes =>
        prevNodes.map(node => GraphService.simulateNodePhysics(node, prevNodes))
      );
    }, 50); // Run at ~20 FPS

    return () => clearInterval(interval);
  }, []);

  /**
   * Updates the graph based on new message content
   */
  const updateGraph = useCallback((messageText: string) => {
    // Update nodes
    setNodes(prevNodes => GraphService.updateNodes(messageText, prevNodes));

    // Create new links
    const newLinks = GraphService.createLinks(messageText);
    if (newLinks.length > 0) {
      setLinks(prevLinks => [...prevLinks, ...newLinks]);
    }
  }, []);

  /**
   * Adds a keyword directly to the graph (for AI-generated keywords)
   */
  const addKeyword = useCallback((keyword: string) => {
    setNodes(prevNodes => {
      const updatedNodes = GraphService.addKeywordDirectly(keyword, prevNodes);
      
      // Create links for the new keyword if it was actually added
      const isNewNode = !prevNodes.find(n => n.id.toLowerCase() === keyword.trim().toLowerCase());
      if (isNewNode) {
        setLinks(prevLinks => {
          const newLinks = GraphService.createLinksForKeyword(keyword.trim(), updatedNodes, prevLinks);
          return [...prevLinks, ...newLinks];
        });
      }
      
      return updatedNodes;
    });
  }, []);

  /**
   * Generate additional random connections between nodes
   */
  const enrichConnections = useCallback(() => {
    setLinks(prevLinks => {
      const newLinks = GraphService.generateRandomConnections(nodes, prevLinks, 0.3);
      return [...prevLinks, ...newLinks];
    });
  }, [nodes]);

  return { nodes, links, updateGraph, addKeyword, enrichConnections };
}
