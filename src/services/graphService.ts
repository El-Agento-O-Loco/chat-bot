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
