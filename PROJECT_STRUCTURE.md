# Project Structure - Visual Guide

## 🎯 Quick Overview

This is a **modular, best-practice React application** with clean separation of concerns.

---

## 📁 File Structure

```
src/
├── 📱 main.tsx                    # Entry point
├── 🎨 App.tsx                     # Main orchestrator
├── 🎨 index.css                   # Global styles
│
├── 📦 components/                 # UI Components (Presentational)
│   ├── Chat.tsx                   # Chat interface
│   ├── KnowledgeGraph.tsx         # Graph visualization
│   ├── ActionItems.tsx            # Task list
│   └── ErrorBoundary.tsx          # Error handling
│
├── 🪝 hooks/                      # Custom React Hooks (Stateful Logic)
│   ├── useChat.ts                 # Chat state management
│   ├── useKnowledgeGraph.ts       # Graph state + physics
│   ├── useTasks.ts                # Task management
│   └── useAppContext.ts           # Context consumer
│
├── 🔧 services/                   # Business Logic (Pure Functions)
│   ├── aiService.ts               # AI response logic
│   ├── graphService.ts            # Graph operations
│   ├── messageService.ts          # Message creation
│   └── taskService.ts             # Task operations
│
├── 🌍 context/                    # Global State Management
│   ├── AppContext.ts              # Context definition
│   └── AppProvider.tsx            # Context provider
│
├── 📝 types.ts                    # TypeScript interfaces
├── 🔢 constants.ts                # Shared constants
└── 🛠️ utils.ts                    # Utility functions
```

---

## 🏗️ Architecture Layers

### Layer 1: Entry & Providers
```
main.tsx
  └── ErrorBoundary
      └── AppProvider (Global State)
          └── App
```

### Layer 2: Orchestration
```
App.tsx (Main Logic Controller)
  ├── Uses: useChat, useKnowledgeGraph, useTasks hooks
  ├── Coordinates data flow between features
  └── Renders: Chat, KnowledgeGraph, ActionItems
```

### Layer 3: Features (Custom Hooks)
```
useChat
  ├── Manages: Message array state
  ├── Uses: MessageService, AIService
  └── Returns: messages, sendMessage()

useKnowledgeGraph
  ├── Manages: Nodes & links state
  ├── Uses: GraphService
  ├── Side effect: Physics simulation
  └── Returns: nodes, links, updateGraph()

useTasks
  ├── Manages: Tasks array state
  ├── Uses: TaskService
  └── Returns: tasks, extractTask(), toggleTask(), etc.
```

### Layer 4: Business Logic (Services)
```
AIService
  └── getResponse() → Determines AI behavior

GraphService
  ├── updateNodes() → Add/grow nodes
  ├── createLinks() → Connect nodes
  └── simulateNodePhysics() → Force simulation

MessageService
  └── createMessage() → Format messages

TaskService
  ├── extractTask() → Parse action items
  ├── toggleTask() → Update completion
  └── deleteTask() → Remove task
```

### Layer 5: Presentation (Components)
```
<Chat />
  └── Displays messages, handles input

<KnowledgeGraph />
  └── Renders SVG nodes and links

<ActionItems />
  └── Shows task list with checkboxes
```

---

## 🔄 Data Flow Example: Sending a Message

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User types "I will deploy the API tomorrow"             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. <Chat> calls onSendMessage()                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. App.tsx → sendMessage(activeUser, text)                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. useChat Hook                                             │
│    ├─ MessageService.createMessage() → New message object  │
│    ├─ Add message to state                                 │
│    ├─ Call onMessageSent callback                          │
│    └─ AIService.getResponse() → Check if AI responds       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. onMessageSent Callback in App.tsx                       │
│    ├─ updateGraph("I will deploy the API tomorrow")        │
│    │   ├─ GraphService.extractKeywords() → ["API"]         │
│    │   └─ GraphService.updateNodes() → Add/grow node       │
│    └─ extractTask("I will deploy the API tomorrow")        │
│        └─ TaskService.extractTask() → "deploy the API..."  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. React Re-renders                                         │
│    ├─ <Chat> shows new message                             │
│    ├─ <KnowledgeGraph> shows "API" node                    │
│    └─ <ActionItems> shows new task                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Responsibility Matrix

| Layer | Contains | Example | Responsibilities |
|-------|----------|---------|------------------|
| **Entry** | `main.tsx` | App bootstrap | Setup providers, error boundaries |
| **Context** | `context/` | `AppProvider` | Global state (activeUser) |
| **Orchestrator** | `App.tsx` | Main component | Wire hooks → components, coordinate features |
| **Hooks** | `hooks/` | `useChat` | State management, side effects |
| **Services** | `services/` | `AIService` | Pure business logic, no React |
| **Components** | `components/` | `<Chat />` | Pure presentation, minimal logic |
| **Utils** | `utils.ts`, `types.ts` | `generateId()` | Shared utilities, types |

---

## 🧪 Testing Strategy by Layer

### Services (Unit Tests)
```typescript
// ✅ Easy to test - Pure functions
test('AIService detects @omni mention', () => {
  const result = AIService.getResponse("@omni help", user);
  expect(result.shouldRespond).toBe(true);
});
```

### Hooks (Integration Tests)
```typescript
// ✅ Test with renderHook from React Testing Library
test('useChat sends message', () => {
  const { result } = renderHook(() => useChat());
  act(() => result.current.sendMessage(user, "hello"));
  expect(result.current.messages).toHaveLength(1);
});
```

### Components (Component Tests)
```typescript
// ✅ Test UI behavior
test('Chat renders messages', () => {
  render(<Chat messages={mockMessages} ... />);
  expect(screen.getByText("Hello")).toBeInTheDocument();
});
```

---

## 📊 Dependency Graph

```
main.tsx
  └── App.tsx
      ├── useAppContext (context)
      ├── useChat (hooks)
      │   ├── MessageService (services)
      │   └── AIService (services)
      ├── useKnowledgeGraph (hooks)
      │   └── GraphService (services)
      ├── useTasks (hooks)
      │   └── TaskService (services)
      ├── <Chat /> (components)
      ├── <KnowledgeGraph /> (components)
      └── <ActionItems /> (components)

Services depend on:
  ├── utils.ts
  ├── types.ts
  └── constants.ts

Components depend on:
  ├── types.ts
  ├── constants.ts
  └── hooks (for context)
```

---

## 🚀 Key Benefits of This Architecture

### ✅ **Separation of Concerns**
- Each file has ONE clear responsibility
- Easy to find where to make changes

### ✅ **Testability**
- Services are pure functions → easy unit tests
- Hooks can be tested with `renderHook`
- Components can be tested with React Testing Library

### ✅ **Reusability**
- Services can be used in any hook
- Hooks can be used in any component
- Components accept props → reusable anywhere

### ✅ **Type Safety**
- TypeScript interfaces in `types.ts`
- Compile-time error catching
- IntelliSense autocomplete

### ✅ **Maintainability**
- Clear folder structure
- JSDoc comments on all functions
- Consistent naming conventions

### ✅ **Scalability**
- Add new features without touching existing code
- Easy to add new services/hooks/components
- Can split into micro-frontends if needed

---

## 🎓 Learning Path for This Codebase

### Beginner (Start Here)
1. Read `types.ts` → Understand data structures
2. Read `constants.ts` → See mock data
3. Read `utils.ts` → Simple helper functions

### Intermediate
4. Read `services/` → Business logic
5. Read `components/` → UI components
6. Read `App.tsx` → How it all connects

### Advanced
7. Read `hooks/` → Custom hooks with state
8. Read `context/` → Global state management
9. Read `main.tsx` → Provider setup

---

## 📝 Adding a New Feature - Example

**Goal**: Add "Delete Message" functionality

### Step 1: Update Types
```typescript
// types.ts
interface Message {
  // ... existing fields
  deletedAt?: string; // Add optional field
}
```

### Step 2: Add Service
```typescript
// services/messageService.ts
export class MessageService {
  static deleteMessage(messageId: number): void {
    // Business logic here
  }
}
```

### Step 3: Update Hook
```typescript
// hooks/useChat.ts
export function useChat() {
  // ... existing code

  const deleteMessage = useCallback((id: number) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  return { messages, sendMessage, deleteMessage };
}
```

### Step 4: Update Component
```tsx
// components/Chat.tsx
<button onClick={() => onDeleteMessage(msg.id)}>
  <Trash2 />
</button>
```

### Step 5: Wire in App
```tsx
// App.tsx
const { messages, sendMessage, deleteMessage } = useChat();

<Chat
  messages={messages}
  onSendMessage={handleSendMessage}
  onDeleteMessage={deleteMessage}  // Add prop
/>
```

---

## 🎨 Component Styling

All components use **Tailwind CSS** utility classes:
- `bg-slate-950` → Dark background
- `text-cyan-400` → Accent color
- `rounded-xl` → Rounded corners
- `hover:bg-cyan-500` → Interactive states

**Benefits**:
- ✅ No CSS files to manage per component
- ✅ Consistent design system
- ✅ Small bundle size (unused classes purged)
- ✅ Responsive utilities built-in

---

## 🔍 Finding Things Quickly

**"Where is the AI response logic?"**
→ `services/aiService.ts` → `getResponse()`

**"How are messages stored?"**
→ `hooks/useChat.ts` → `messages` state

**"How do I change the user list?"**
→ `constants.ts` → `USERS` array

**"Where is the graph physics?"**
→ `services/graphService.ts` → `simulateNodePhysics()`

**"How do I add a new component?"**
→ Create in `components/`, add props interface, use in `App.tsx`

---

## 🎯 Summary

This architecture follows **SOLID principles** and **React best practices**:

- ✅ **S**ingle Responsibility - Each file has one job
- ✅ **O**pen/Closed - Easy to extend without modifying
- ✅ **L**iskov Substitution - Components are interchangeable
- ✅ **I**nterface Segregation - Props are minimal and focused
- ✅ **D**ependency Inversion - Depend on abstractions (hooks/services)

**Result**: Clean, maintainable, scalable React application! 🚀
