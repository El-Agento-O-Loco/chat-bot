import { useState } from 'react';
import { useAppContext } from './context/AppContext';
import { useChat } from './hooks/useChat';
import { useKnowledgeGraph } from './hooks/useKnowledgeGraph';
import { useTasks } from './hooks/useTasks';
import Chat from './components/Chat';
import KnowledgeGraph from './components/KnowledgeGraph';
import ActionItems from './components/ActionItems';
import { USERS, AI_AGENT } from './constants';

/**
 * Main App Component - Orchestrates the three-column layout and manages data flow
 *
 * Architecture:
 * - Uses custom hooks for business logic (useChat, useKnowledgeGraph, useTasks)
 * - Context for shared state (activeUser)
 * - Services for pure business logic
 * - Components for presentation
 */
export default function CommunityPulse() {
  const { activeUser } = useAppContext();
  const [inputText, setInputText] = useState("");

  // Initialize with default messages
  const { messages, sendMessage } = useChat({
    initialMessages: [
      { id: 1, user: USERS[0], text: "Hey team, how is the Optimization looking for the new model?", timestamp: "10:00 AM" },
      { id: 2, user: AI_AGENT, text: "Optimization detected. Tracking topic frequency.", timestamp: "10:01 AM" }
    ],
    onMessageSent: (message) => {
      // Update knowledge graph when message is sent
      updateGraph(message.text);
      // Extract tasks from message
      extractTask(message.text, message.user.name);
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
  const { tasks, extractTask, toggleTask, deleteTask, clearAllTasks } = useTasks();

  /**
   * Handles sending a message
   */
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    sendMessage(activeUser, inputText);
    setInputText("");
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-cyan-500 selection:text-white">
      <Chat
        messages={messages}
        inputText={inputText}
        onInputChange={setInputText}
        onSendMessage={handleSendMessage}
      />
      <KnowledgeGraph
        nodes={nodes}
        links={links}
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
