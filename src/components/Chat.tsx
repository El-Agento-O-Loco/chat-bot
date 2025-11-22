import { useRef, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import type { Message } from '../types';
import { USERS } from '../constants';
import { useAppContext } from '../hooks/useAppContext';

interface ChatProps {
  messages: Message[];
  inputText: string;
  isAIThinking?: boolean;
  onInputChange: (text: string) => void;
  onSendMessage: () => void;
}

/**
 * Chat Component - Displays message history and input interface
 */
export default function Chat({
  messages,
  inputText,
  isAIThinking = false,
  onInputChange,
  onSendMessage
}: ChatProps) {
  const { activeUser, setActiveUser } = useAppContext();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission and scroll behavior
      onSendMessage();
    }
  };

  return (
    <div className="md:w-1/3 h-screen border-r border-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-cyan-400 w-5 h-5" />
          <h2 className="font-semibold text-lg tracking-wide">Omni The Culture Keeper</h2>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-slate-400">Omni Active</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-950 to-slate-900">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.user.id === activeUser.id ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-center gap-2 mb-1 ${msg.user.id === activeUser.id ? 'flex-row-reverse' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${msg.user.color}`}>
                {msg.user.name.substring(0, 2)}
              </div>
              <span className="text-xs text-slate-500">{msg.user.name} • {msg.timestamp}</span>
            </div>
            <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-lg ${msg.user.id === 'ai'
              ? 'bg-slate-800 border border-cyan-900 text-cyan-100 rounded-tl-none'
              : msg.user.id === activeUser.id
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-slate-800 text-slate-200 rounded-bl-none'
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isAIThinking && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-700">
                Om
              </div>
              <span className="text-xs text-slate-500">Omni is thinking...</span>
            </div>
            <div className="px-4 py-2 rounded-2xl rounded-tl-none text-sm bg-slate-800 border border-cyan-900 text-cyan-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex-shrink-0">
        <div className="flex flex-col gap-3">
          {/* User Selection Controls */}
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Simulate as:</span>
            <div className="flex gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {USERS.map(u => (
                <button
                  key={u.id}
                  onClick={() => setActiveUser(u)}
                  className={`px-2 py-1 rounded transition-colors ${activeUser.id === u.id ? 'bg-slate-700 text-white' : 'hover:text-slate-300'}`}
                >
                  {u.name}
                </button>
              ))}
            </div>
          </div>

          {/* Input Field */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message or @Omni..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            <button
              onClick={onSendMessage}
              className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl transition-colors shadow-[0_0_15px_rgba(8,145,178,0.3)]"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
