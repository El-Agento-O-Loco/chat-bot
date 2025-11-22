import type { GraphNode, GraphLink } from '../types';
import { extractKeywords } from '../utils';

/**
 * Graph Service - Manages knowledge graph operations
 */
export class GraphService {
  /**
   * Updates graph nodes based on message content
   * @param messageText - The message text to extract keywords from
   * @param existingNodes - Current graph nodes
   * @returns Updated array of graph nodes
   */
  static updateNodes(messageText: string, existingNodes: GraphNode[]): GraphNode[] {
    const foundKeywords = extractKeywords(messageText);
    if (foundKeywords.length === 0) {
      return existingNodes;
    }

    const newNodes = [...existingNodes];
    foundKeywords.forEach(keyword => {
      const existing = newNodes.find(n => n.id === keyword);
      if (existing) {
        // Grow existing node
        existing.size += 15;
      } else {
        // Spawn new node near center with random offset
        newNodes.push({
          id: keyword,
          size: 30,
          x: 200 + Math.random() * 50,
          y: 200 + Math.random() * 50
        });
      }
    });

    return newNodes;
  }

  /**
   * Add a keyword directly to the graph (for AI-generated keywords)
   * @param keyword - The keyword to add
   * @param existingNodes - Current graph nodes
   * @returns Updated array of graph nodes
   */
  static addKeywordDirectly(keyword: string, existingNodes: GraphNode[]): GraphNode[] {
    if (!keyword || keyword.trim() === '') {
      return existingNodes;
    }

    const cleanKeyword = keyword.trim();
    const newNodes = [...existingNodes];
    const existing = newNodes.find(n => n.id.toLowerCase() === cleanKeyword.toLowerCase());

    if (existing) {
      // Grow existing node
      existing.size += 15;
    } else {
      // Spawn new node near center with random offset
      newNodes.push({
        id: cleanKeyword,
        size: 30,
        x: 200 + Math.random() * 50,
        y: 200 + Math.random() * 50
      });
    }

    return newNodes;
  }

  /**
   * Create random links for a new keyword to existing nodes
   * @param keyword - The keyword to connect
   * @param allNodes - All existing nodes
   * @param existingLinks - Current links (to avoid duplicates)
   * @returns Array of new links
   */
  static createLinksForKeyword(keyword: string, allNodes: GraphNode[], existingLinks: GraphLink[]): GraphLink[] {
    const newLinks: GraphLink[] = [];
    const otherNodes = allNodes.filter(n => n.id !== keyword);
    
    if (otherNodes.length === 0) return newLinks;

    // Connect to 1-3 random existing nodes
    const numConnections = Math.min(
      Math.floor(Math.random() * 3) + 1,
      otherNodes.length
    );

    // Shuffle and pick random nodes
    const shuffled = [...otherNodes].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numConnections; i++) {
      const targetNode = shuffled[i];
      
      // Check if link already exists (in either direction)
      const linkExists = existingLinks.some(link => 
        (link.source === keyword && link.target === targetNode.id) ||
        (link.source === targetNode.id && link.target === keyword)
      );

      if (!linkExists) {
        newLinks.push({
          source: keyword,
          target: targetNode.id
        });
      }
    }

    return newLinks;
  }

  /**
   * Generate additional random connections between existing nodes
   * @param allNodes - All nodes in the graph
   * @param existingLinks - Current links
   * @param density - Connection density (0-1), default 0.3
   * @returns Array of new links
   */
  static generateRandomConnections(allNodes: GraphNode[], existingLinks: GraphLink[], density: number = 0.3): GraphLink[] {
    const newLinks: GraphLink[] = [];
    
    for (let i = 0; i < allNodes.length; i++) {
      for (let j = i + 1; j < allNodes.length; j++) {
        const source = allNodes[i].id;
        const target = allNodes[j].id;

        // Check if link already exists
        const linkExists = existingLinks.some(link => 
          (link.source === source && link.target === target) ||
          (link.source === target && link.target === source)
        );

        // Create connection with probability = density
        if (!linkExists && Math.random() < density) {
          newLinks.push({ source, target });
        }
      }
    }

    return newLinks;
  }

  /**
   * Creates links between keywords found in the same message
   * @param messageText - The message text to extract keywords from
   * @returns Array of new graph links
   */
  static createLinks(messageText: string): GraphLink[] {
    const foundKeywords = extractKeywords(messageText);
    if (foundKeywords.length < 2) {
      return [];
    }

    const newLinks: GraphLink[] = [];
    for (let i = 0; i < foundKeywords.length - 1; i++) {
      newLinks.push({
        source: foundKeywords[i],
        target: foundKeywords[i + 1]
      });
    }

    return newLinks;
  }

  /**
   * Simulates physics for a single graph node
   * @param node - The node to update
   * @param allNodes - All nodes in the graph (for collision detection)
   * @returns Updated node with new position
   */
  static simulateNodePhysics(node: GraphNode, allNodes: GraphNode[]): GraphNode {
    // Slight organic movement
    let dx = (Math.random() - 0.5) * 0.8;
    let dy = (Math.random() - 0.5) * 0.8;

    // Center gravity (pull to middle)
    dx += (200 - node.x) * 0.005;
    dy += (200 - node.y) * 0.005;

    // Repulsion (push away from others)
    allNodes.forEach(other => {
      if (node.id !== other.id) {
        const dist = Math.hypot(node.x - other.x, node.y - other.y);
        if (dist < 80) {
          dx += (node.x - other.x) / dist * 2;
          dy += (node.y - other.y) / dist * 2;
        }
      }
    });

    return { ...node, x: node.x + dx, y: node.y + dy };
  }
}
