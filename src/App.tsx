import { useState, useEffect } from 'react';
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
  const [isExtractingTasks, setIsExtractingTasks] = useState(false);
  const [isProcessingKeywords, setIsProcessingKeywords] = useState(false);

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
      // Update knowledge graph from message text (hardcoded keywords)
      updateGraph(message.text);

      // If AI provided keywords, add them directly to graph
      if (message.keywords) {
        console.log('Adding AI keywords to graph:', message.keywords);
        message.keywords.forEach(keyword => addKeyword(keyword));
        
        // Hide loading overlay after AI responds with keywords
        setTimeout(() => setIsProcessingKeywords(false), 300);
      }

      // Try AI task extraction first
      setIsExtractingTasks(true);
      try {
        console.log('Attempting AI task extraction for:', message.text);
        const aiTasks = await extractAITasks(message.text, message.user.name);
        console.log('AI extracted tasks:', aiTasks);

        if (aiTasks.length > 0) {
          console.log('Adding AI tasks:', aiTasks);
          const addedTasks = addAITasks(aiTasks, message.user.name);
          console.log('Tasks added:', addedTasks);
        } else {
          // Fallback to regex-based extraction
          console.log('No AI tasks, trying regex...');
          const regexTask = detectActionItems(message.text);
          if (regexTask) {
            console.log('Regex found task:', regexTask);
            extractTask(message.text, message.user.name);
          }
        }
      } catch (error) {
        // Fallback to regex if AI fails
        console.error('AI task extraction failed:', error);
        const regexTask = detectActionItems(message.text);
        if (regexTask) {
          console.log('Regex fallback found task:', regexTask);
          extractTask(message.text, message.user.name);
        }
      } finally {
        setIsExtractingTasks(false);
      }
    }
  });

  // Initialize graph with default node
  const { nodes, links, updateGraph, addKeyword, enrichConnections } = useKnowledgeGraph({
    id: "Optimization",
    size: 40,
    x: 200,
    y: 200
  });

  // Periodically enrich connections between nodes
  useEffect(() => {
    const interval = setInterval(() => {
      if (nodes.length > 2) {
        enrichConnections();
      }
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, [nodes.length, enrichConnections]);

  // Initialize task management
  const { tasks, extractTask, addAITasks, toggleTask, deleteTask, clearAllTasks } = useTasks();

  /**
   * Handles sending a message
   */
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    setInputText("");
    
    // Show loading overlay immediately
    setIsProcessingKeywords(true);
    
    await sendMessage(activeUser, inputText);

    // Scroll to top on mobile after sending message (bandaid fix)
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Request AI analysis of the knowledge graph
   */
  const handleRequestAnalysis = async () => {
    await analyzeGraph(nodes);
  };

  return (
    <div className="flex flex-col md:flex-row bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-cyan-500 selection:text-white">
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
        isProcessingKeywords={isProcessingKeywords}
        onRequestAnalysis={handleRequestAnalysis}
      />
      <ActionItems
        tasks={tasks}
        isExtracting={isExtractingTasks}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
        onClearAll={clearAllTasks}
      />
    </div>
  );
}
