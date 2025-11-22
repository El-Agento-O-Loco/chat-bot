import { CheckCircle, Trash2, Cpu, Loader2 } from 'lucide-react';
import type { Task } from '../types';

interface ActionItemsProps {
  tasks: Task[];
  isExtracting?: boolean;
  onToggleTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onClearAll: () => void;
}

export default function ActionItems({
  tasks,
  isExtracting = false,
  onToggleTask,
  onDeleteTask,
  onClearAll
}: ActionItemsProps) {
  return (
    <div className="md:w-1/3 h-screen flex flex-col bg-slate-900/50">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-2">
          {isExtracting ? (
            <Loader2 className="text-emerald-400 w-5 h-5 animate-spin" />
          ) : (
            <Cpu className="text-emerald-400 w-5 h-5" />
          )}
          <h2 className="font-semibold text-lg">Action Extraction</h2>
          {isExtracting && (
            <span className="text-xs text-emerald-400 animate-pulse">Extracting...</span>
          )}
        </div>
        <button
          onClick={onClearAll}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Tasks Board */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {tasks.length === 0 && (
          <div className="text-center mt-20 opacity-30">
            <div className="w-16 h-16 border-2 border-dashed border-slate-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-sm font-mono">No actions detected.</p>
            <p className="text-xs text-slate-500 mt-2">Try typing: "I will update the docs"</p>
          </div>
        )}

        {tasks.map(task => (
          <div
            key={task.id}
            className={`group relative p-4 rounded-xl border transition-all duration-300 ${task.completed
              ? 'bg-slate-900/50 border-slate-800 opacity-50'
              : 'bg-slate-800 border-slate-700 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/10'
              }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggleTask(task.id)}
                className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.completed
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'border-slate-500 text-transparent hover:border-emerald-400'
                  }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
              </button>

              <div className="flex-1">
                <p className={`text-sm font-medium transition-all ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                  {task.text}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-400 border border-slate-600">
                    Owner: {task.assignedTo}
                  </span>
                  <span className="text-[10px] text-slate-600">Auto-extracted</span>
                </div>
              </div>

              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
