import { Activity, Loader2 } from 'lucide-react';
import type { GraphNode, GraphLink } from '../types';
import AIInsights from './AIInsights';

interface KnowledgeGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
  graphInsight?: string;
  isAnalyzing?: boolean;
  isProcessingKeywords?: boolean;
  onRequestAnalysis?: () => void;
}

export default function KnowledgeGraph({
  nodes,
  links,
  graphInsight,
  isAnalyzing,
  isProcessingKeywords = false,
  onRequestAnalysis
}: KnowledgeGraphProps) {
  return (
    <div className="md:w-1/3 h-screen border-r border-slate-800 bg-slate-950 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/50 to-slate-950 z-0 pointer-events-none"></div>

      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900 z-10 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-2">
          {isProcessingKeywords ? (
            <Loader2 className="text-purple-400 w-5 h-5 animate-spin" />
          ) : (
            <Activity className="text-purple-400 w-5 h-5" />
          )}
          <h2 className="font-semibold text-lg">Topic Topology</h2>
          {isProcessingKeywords && (
            <span className="text-xs text-purple-400 animate-pulse">Processing keywords...</span>
          )}
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

        {/* Processing Keywords Loading Overlay */}
        {isProcessingKeywords && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-slate-800 border border-purple-500/50 rounded-xl p-6 shadow-2xl">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                <div className="text-sm text-purple-300 font-medium">Processing AI Keywords</div>
                <div className="text-xs text-slate-400">Adding nodes to graph...</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights Overlay */}
        <AIInsights
          graphInsight={graphInsight}
          isAnalyzing={isAnalyzing}
          onRequestAnalysis={onRequestAnalysis}
        />
      </div>
    </div>
  );
}
