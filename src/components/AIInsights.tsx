import { Brain, Sparkles, X } from 'lucide-react';

interface AIInsightsProps {
  graphInsight?: string;
  contextSummary?: string;
  isAnalyzing?: boolean;
  onRequestAnalysis?: () => void;
  onClose?: () => void;
}

/**
 * AI Insights Component - Shows AI-powered analysis and suggestions
 */
export default function AIInsights({
  graphInsight,
  contextSummary,
  isAnalyzing = false,
  onRequestAnalysis,
  onClose
}: AIInsightsProps) {
  const hasInsights = graphInsight || contextSummary;

  if (!hasInsights && !isAnalyzing) {
    // Show prompt to analyze
    return (
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={onRequestAnalysis}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">AI Analysis</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 right-4 left-4 z-10 max-w-md mx-auto">
      <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-semibold text-purple-300">AI Insights</h3>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>Analyzing conversation and topics...</span>
          </div>
        )}

        {/* Insights */}
        {!isAnalyzing && (
          <div className="space-y-3">
            {graphInsight && (
              <div className="bg-slate-900/50 rounded-lg p-3 border border-purple-500/20">
                <div className="text-xs text-purple-400 font-medium mb-1">Graph Analysis</div>
                <p className="text-sm text-slate-300 leading-relaxed">{graphInsight}</p>
              </div>
            )}

            {contextSummary && (
              <div className="bg-slate-900/50 rounded-lg p-3 border border-cyan-500/20">
                <div className="text-xs text-cyan-400 font-medium mb-1">Context Summary</div>
                <p className="text-sm text-slate-300 leading-relaxed">{contextSummary}</p>
              </div>
            )}

            {onRequestAnalysis && (
              <button
                onClick={onRequestAnalysis}
                className="w-full text-xs text-purple-400 hover:text-purple-300 transition-colors pt-2 border-t border-slate-700"
              >
                Refresh Analysis
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
