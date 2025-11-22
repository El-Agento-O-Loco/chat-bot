import { useState } from 'react';
import { useAppContext } from './hooks/useAppContext';
import { useChat } from './hooks/useChat';
import { useKnowledgeGraph } from './hooks/useKnowledgeGraph';
import { useTasks } from './hooks/useTasks';
import { useAIFeatures } from './hooks/useAIFeatures';
import Chat from './components/Chat';
import KnowledgeGraph from './components/KnowledgeGraph';
import ActionItems from './components/ActionItems';
import { USERS, AI_AGENT } from './constants';
import { detectActionItems } from './utils';

/**
 * Main App Component - Now with full AI integration!
 *
 * AI Features:
 * - Real AI chat responses via backend API
 * - AI-powered knowledge graph insights
 * - Smart task extraction using AI
 * - Context analysis and suggestions
 */
export default function CommunityPulse() {
  const { activeUser } = useAppContext();
  const [inputText, setInputText] = useState("");

  // AI Features hook
  const {
    graphInsight,
    isAnalyzing,
    analyzeGraph,
    extractTasks: extractAITasks
  } = useAIFeatures();

  // Initialize with default messages
  const { messages, sendMessage, isAIThinking } = useChat({
    initialMessages: [
      { id: 1, user: USERS[0], text: "Hey team, how is the Optimization looking for the new model?", timestamp: "10:00 AM" },
      { id: 2, user: AI_AGENT, text: "Optimization detected. Tracking topic frequency.", timestamp: "10:01 AM" }
    ],
    onMessageSent: async (message) => {
      // Update knowledge graph when message is sent
      updateGraph(message.text);

      // Try AI task extraction first
      try {
        const aiTasks = await extractAITasks(message.text, message.user.name);
        if (aiTasks.length > 0) {
          addAITasks(aiTasks, message.user.name);
        } else {
          // Fallback to regex-based extraction
          const regexTask = detectActionItems(message.text);
          if (regexTask) {
            extractTask(message.text, message.user.name);
          }
        }
      } catch {
        // Fallback to regex if AI fails
        const regexTask = detectActionItems(message.text);
        if (regexTask) {
          extractTask(message.text, message.user.name);
        }
      }
    }
  });

  // Initialize graph with default node
  const { nodes, links, updateGraph } = useKnowledgeGraph({
    id: "Optimization",
    size: 40,
    x: 200,
    y: 200
  });

  // Initialize task management
  const { tasks, extractTask, addAITasks, toggleTask, deleteTask, clearAllTasks } = useTasks();

  /**
   * Handles sending a message
   */
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    await sendMessage(activeUser, inputText);
    setInputText("");
  };

  /**
   * Request AI analysis of the knowledge graph
   */
  const handleRequestAnalysis = async () => {
    await analyzeGraph(nodes, messages);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-cyan-500 selection:text-white">
      <Chat
        messages={messages}
        inputText={inputText}
        isAIThinking={isAIThinking}
        onInputChange={setInputText}
        onSendMessage={handleSendMessage}
      />
      <KnowledgeGraph
        nodes={nodes}
        links={links}
        graphInsight={graphInsight}
        isAnalyzing={isAnalyzing}
        onRequestAnalysis={handleRequestAnalysis}
      />
      <ActionItems
        tasks={tasks}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
        onClearAll={clearAllTasks}
      />
    </div>
  );
}
