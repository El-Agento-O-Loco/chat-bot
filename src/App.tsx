import { useState } from 'react';
import type { Message, User, GraphNode, GraphLink, Task } from './types';
import { USERS, AI_AGENT } from './constants';
import { extractKeywords, detectActionItems } from './utils';
import { useGraphSimulation } from './hooks/useGraphSimulation';
import Chat from './components/Chat';
import KnowledgeGraph from './components/KnowledgeGraph';
import ActionItems from './components/ActionItems';

export default function CommunityPulse() {
  // --- STATE ---
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, user: USERS[0], text: "Hey team, how is the Optimization looking for the new model?", timestamp: "10:00 AM" },
    { id: 2, user: AI_AGENT, text: "Optimization detected. Tracking topic frequency.", timestamp: "10:01 AM" }
  ]);
  const [activeUser, setActiveUser] = useState<User>(USERS[0]);
  const [inputText, setInputText] = useState("");
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([{ id: "Optimization", size: 40, x: 200, y: 200 }]);
  const [graphLinks, setGraphLinks] = useState<GraphLink[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // --- GRAPH SIMULATION ENGINE ---
  useGraphSimulation(setGraphNodes);

  // --- CORE LOGIC HANDLER ---
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newUserMsg: Message = {
      id: Date.now(),
      user: activeUser,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 1. Update Chat
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputText("");

    // 2. Update Knowledge Graph
    const foundKeywords = extractKeywords(newUserMsg.text);
    if (foundKeywords.length > 0) {
      setGraphNodes(prev => {
        const newNodes = [...prev];
        foundKeywords.forEach(kw => {
          const existing = newNodes.find(n => n.id === kw);
          if (existing) {
            existing.size += 15; // Grow node
          } else {
            // Spawn new node near center
            newNodes.push({ id: kw, size: 30, x: 200 + Math.random() * 50, y: 200 + Math.random() * 50 });
          }
        });
        return newNodes;
      });

      // Create links between keywords found in same message
      if (foundKeywords.length > 1) {
        const newLinks: GraphLink[] = [];
        for (let i = 0; i < foundKeywords.length - 1; i++) {
          newLinks.push({ source: foundKeywords[i], target: foundKeywords[i + 1] });
        }
        setGraphLinks(prev => [...prev, ...newLinks]);
      }
    }

    // 3. Update Actions (Task Board)
    const actionText = detectActionItems(newUserMsg.text);
    if (actionText) {
      setTasks(prev => [...prev, { id: Date.now(), text: actionText, assignedTo: activeUser.name, completed: false }]);
    }

    // 4. AI "Omni" Behavior Logic
    handleAIResponse(newUserMsg.text);
  };

  const handleAIResponse = (lastText: string) => {
    let responseText: string | null = null;
    const lowerText = lastText.toLowerCase();

    // Condition A: Direct Mention
    if (lowerText.includes("@omni")) {
      responseText = `I'm here, ${activeUser.name}. I've logged that interaction in the graph.`;
    }
    // Condition B: Confidence Threshold (Specific Keywords trigger help)
    else if (lowerText.includes("deployment") || lowerText.includes("error")) {
      responseText = "I detected a discussion about Deployment. Checking pipeline status... All systems green.";
    }
    // Condition C: Random Health Check (1 in 10 chance)
    else if (Math.random() > 0.9) {
      responseText = "Quick health check: We haven't heard from the UX team on this thread recently. Is the design spec finalized?";
    }

    if (responseText) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          user: AI_AGENT,
          text: responseText as string,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1500); // Simulated typing delay
    }
  };

  // --- RENDER HELPERS ---
  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-cyan-500 selection:text-white">
      <Chat
        messages={messages}
        activeUser={activeUser}
        inputText={inputText}
        onUserChange={setActiveUser}
        onInputChange={setInputText}
        onSendMessage={handleSendMessage}
      />
      <KnowledgeGraph
        nodes={graphNodes}
        links={graphLinks}
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
