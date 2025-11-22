import { useEffect } from 'react';
import type { GraphNode } from '../types';

export function useGraphSimulation(
  setNodes: React.Dispatch<React.SetStateAction<GraphNode[]>>
) {
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prevNodes => {
        return prevNodes.map(node => {
          // Slight organic movement
          let dx = (Math.random() - 0.5) * 0.8;
          let dy = (Math.random() - 0.5) * 0.8;

          // Center gravity (pull to middle)
          dx += (200 - node.x) * 0.005;
          dy += (200 - node.y) * 0.005;

          // Repulsion (push away from others)
          prevNodes.forEach(other => {
            if (node.id !== other.id) {
              const dist = Math.hypot(node.x - other.x, node.y - other.y);
              if (dist < 80) {
                dx += (node.x - other.x) / dist * 2;
                dy += (node.y - other.y) / dist * 2;
              }
            }
          });

          return { ...node, x: node.x + dx, y: node.y + dy };
        });
      });
    }, 50);
    return () => clearInterval(interval);
  }, [setNodes]);
}
