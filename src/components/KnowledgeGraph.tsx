import { Activity } from 'lucide-react';
import type { GraphNode, GraphLink } from '../types';

interface KnowledgeGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
}

export default function KnowledgeGraph({ nodes, links }: KnowledgeGraphProps) {
  return (
    <div className="w-1/3 border-r border-slate-800 bg-slate-950 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/50 to-slate-950 z-0 pointer-events-none"></div>

      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900 z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="text-purple-400 w-5 h-5" />
          <h2 className="font-semibold text-lg">Topic Topology</h2>
        </div>
        <div className="text-xs text-slate-500 font-mono">{nodes.length} Nodes Active</div>
      </div>

      {/* SVG Graph Viz */}
      <div className="flex-1 relative z-0 cursor-crosshair">
        <svg className="w-full h-full">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Links */}
          {links.map((link, i) => {
            const source = nodes.find(n => n.id === link.source);
            const target = nodes.find(n => n.id === link.target);
            if (!source || !target) return null;
            return (
              <line
                key={i}
                x1={source.x} y1={source.y}
                x2={target.x} y2={target.y}
                stroke="#475569"
                strokeWidth="1"
                opacity="0.5"
              />
            )
          })}

          {/* Render Nodes */}
          {nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.x},${node.y})`}>
              {/* Pulse Effect */}
              <circle r={node.size / 2 + 5} fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="1">
                <animate attributeName="r" from={node.size / 2} to={node.size / 2 + 10} dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.8" to="0" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* Main Node */}
              <circle
                r={node.size / 2}
                fill="#0f172a"
                stroke="#22d3ee"
                strokeWidth="2"
                filter="url(#glow)"
              />
              <text
                dy={node.size / 2 + 15}
                textAnchor="middle"
                fill="#94a3b8"
                className="text-[10px] font-mono uppercase tracking-wider"
              >
                {node.id}
              </text>
            </g>
          ))}
        </svg>

        {/* Overlay Hints */}
        <div className="absolute bottom-4 left-4 pointer-events-none">
          <p className="text-[10px] text-slate-600 uppercase">Live Force Simulation</p>
          <p className="text-[10px] text-slate-700">Keywords: Optimization, Deployment, Budget, API...</p>
        </div>
      </div>
    </div>
  );
}
