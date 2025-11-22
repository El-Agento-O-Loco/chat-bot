# Application Architecture

## Overview

This is a **DevStream Chat Application** - an intelligent multi-column interface that combines real-time chat, dynamic knowledge graph visualization, and automated action item extraction. The application demonstrates best practices in React architecture with a clean separation of concerns.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                            main.tsx                              │
│  ┌────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ErrorBoundary│→ │ AppProvider │ → │    App     │              │
│  └────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                          App.tsx                                 │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │              Custom Hooks Layer                   │          │
│  │  ┌──────────┐  ┌────────────┐  ┌──────────┐    │          │
│  │  │ useChat  │  │useKnowledge│  │ useTasks │    │          │
│  │  │          │  │   Graph    │  │          │    │          │
│  │  └──────────┘  └────────────┘  └──────────┘    │          │
│  └──────────────────────────────────────────────────┘          │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────┐          │
│  │               Services Layer                      │          │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────┐     │          │
│  │  │AIService │  │GraphService│  │TaskService│    │          │
│  │  │MessageSvc│  │           │  │          │     │          │
│  │  └──────────┘  └───────────┘  └──────────┘     │          │
│  └──────────────────────────────────────────────────┘          │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────┐          │
│  │           Presentation Components                 │          │
│  │  ┌──────┐   ┌──────────┐   ┌─────────────┐     │          │
│  │  │ Chat │   │Knowledge │   │ ActionItems │     │          │
│  │  │      │   │  Graph   │   │             │     │          │
│  │  └──────┘   └──────────┘   └─────────────┘     │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer-by-Layer Explanation

### 1. **Entry Point** (`src/main.tsx`)

**Purpose**: Application bootstrap and provider setup

```tsx
<ErrorBoundary>    // Catches runtime errors
  <AppProvider>    // Provides global state
    <App />        // Main application
  </AppProvider>
</ErrorBoundary>
```

**Key Responsibilities**:
- Renders the root React component
- Wraps app with error boundary for graceful error handling
- Provides context to all child components

---

### 2. **Context Layer** (`src/context/`)

**Files**:
- `AppContext.ts` - Context definition
- `AppProvider.tsx` - Context provider component
- `src/hooks/useAppContext.ts` - Hook to consume context

**Purpose**: Manages global application state

**State Managed**:
- `activeUser` - Currently selected user (for chat simulation)
- `setActiveUser` - Function to change active user

**Why Context?** Avoids prop drilling - components deep in the tree can access `activeUser` without passing through intermediate components.

---

### 3. **Services Layer** (`src/services/`)

**Philosophy**: Pure functions that contain business logic. No React hooks, no side effects.

#### `aiService.ts`
- **Purpose**: AI agent behavior and response logic
- **Key Methods**:
  - `getResponse()` - Determines if/how AI should respond
  - `getTypingDelay()` - Returns natural typing delay

#### `graphService.ts`
- **Purpose**: Knowledge graph operations
- **Key Methods**:
  - `updateNodes()` - Adds/grows nodes based on keywords
  - `createLinks()` - Links keywords from same message
  - `simulateNodePhysics()` - Physics simulation for node positioning

#### `messageService.ts`
- **Purpose**: Message creation and formatting
- **Key Methods**:
  - `createMessage()` - Creates properly formatted message objects

#### `taskService.ts`
- **Purpose**: Task/action item operations
- **Key Methods**:
  - `extractTask()` - Extracts action items from text
  - `toggleTask()` - Toggles completion status
  - `deleteTask()` - Removes a task

**Why Services?**
- ✅ Testable in isolation (no React dependencies)
- ✅ Reusable across different components/hooks
- ✅ Easy to mock for testing
- ✅ Clear separation of business logic from UI

---

### 4. **Custom Hooks Layer** (`src/hooks/`)

**Philosophy**: Encapsulate stateful logic and side effects. Connect services to React state.

#### `useChat.ts`
- **Purpose**: Manages chat messages and AI responses
- **State**: Array of messages
- **Side Effects**: Auto-responds with AI after delay
- **Returns**: `{ messages, sendMessage }`

#### `useKnowledgeGraph.ts`
- **Purpose**: Manages graph state and physics simulation
- **State**: Nodes and links arrays
- **Side Effects**: 50ms interval for physics updates
- **Returns**: `{ nodes, links, updateGraph }`

#### `useTasks.ts`
- **Purpose**: Manages task list operations
- **State**: Array of tasks
- **Returns**: `{ tasks, extractTask, toggleTask, deleteTask, clearAllTasks }`

#### `useAppContext.ts`
- **Purpose**: Safe access to app context
- **Throws**: Error if used outside provider
- **Returns**: `{ activeUser, setActiveUser }`

**Why Custom Hooks?**
- ✅ Reusable stateful logic
- ✅ Keeps components clean and focused on UI
- ✅ Easy to test with React Testing Library
- ✅ Follows React's Hooks philosophy

---

### 5. **Components Layer** (`src/components/`)

**Philosophy**: Pure presentation. Minimal logic, maximum reusability.

#### `Chat.tsx`
- **Purpose**: Chat interface with message history
- **Props**: `messages`, `inputText`, `onInputChange`, `onSendMessage`
- **Features**:
  - Auto-scroll to latest message
  - User selection for simulation
  - Message bubbles with avatars

#### `KnowledgeGraph.tsx`
- **Purpose**: SVG visualization of topics
- **Props**: `nodes`, `links`
- **Features**:
  - Animated pulsing nodes
  - Connection lines between related topics
  - Glow effects

#### `ActionItems.tsx`
- **Purpose**: Task list with completion tracking
- **Props**: `tasks`, `onToggleTask`, `onDeleteTask`, `onClearAll`
- **Features**:
  - Checkbox for completion
  - Task metadata (owner, auto-extracted)
  - Delete on hover

#### `ErrorBoundary.tsx`
- **Purpose**: Catches JavaScript errors in component tree
- **Features**:
  - Shows friendly error message
  - Refresh button to recover
  - Expandable error details

**Why Separate Components?**
- ✅ Reusable across different pages/contexts
- ✅ Easy to test in isolation (Storybook-ready)
- ✅ Clear prop contracts
- ✅ Focused responsibilities

---

### 6. **Utilities Layer** (`src/utils.ts`, `src/constants.ts`, `src/types.ts`)

#### `types.ts`
- TypeScript interfaces for type safety
- `User`, `Message`, `GraphNode`, `GraphLink`, `Task`

#### `constants.ts`
- Shared constants
- `USERS` - Mock user data
- `AI_AGENT` - AI agent configuration
- `KEYWORDS` - Keywords for graph extraction

#### `utils.ts`
- Pure utility functions
- `generateId()` - Unique ID generation
- `extractKeywords()` - Finds keywords in text
- `detectActionItems()` - Regex-based action detection

---

## Data Flow

### Sending a Message

```
1. User types in <Chat> component
   ↓
2. Chat calls onSendMessage()
   ↓
3. App.tsx → sendMessage(activeUser, text)
   ↓
4. useChat hook:
   - Creates message via MessageService
   - Adds to messages array
   - Triggers onMessageSent callback
   - Checks AIService for response
   - Schedules AI reply if needed
   ↓
5. onMessageSent callback in App.tsx:
   - updateGraph(text) → useKnowledgeGraph
   - extractTask(text) → useTasks
   ↓
6. Components re-render with new data
```

### Knowledge Graph Update

```
1. updateGraph(messageText) called
   ↓
2. GraphService.updateNodes():
   - Extracts keywords from message
   - Finds existing nodes or creates new ones
   - Increases size of mentioned nodes
   ↓
3. GraphService.createLinks():
   - Links keywords found together
   ↓
4. Physics simulation (useEffect):
   - Every 50ms, applies forces to nodes
   - Center gravity + node repulsion
   - Nodes move organically
   ↓
5. <KnowledgeGraph> renders updated SVG
```

---

## Design Patterns Used

### 1. **Container/Presenter Pattern**
- **Container**: App.tsx (logic orchestration)
- **Presenters**: Chat, KnowledgeGraph, ActionItems (pure UI)

### 2. **Service Layer Pattern**
- Business logic isolated in service classes
- No React dependencies in services

### 3. **Custom Hooks Pattern**
- Reusable stateful logic
- Connect services to React state

### 4. **Context API Pattern**
- Global state without prop drilling
- Separate context definition from provider

### 5. **Error Boundary Pattern**
- Graceful error handling
- Prevents entire app crash

---

## Best Practices Demonstrated

✅ **Separation of Concerns**: Each layer has a single responsibility
✅ **Type Safety**: TypeScript interfaces for all data structures
✅ **Testability**: Pure functions and isolated hooks
✅ **Reusability**: Components accept props, hooks are generic
✅ **Error Handling**: Error boundaries catch runtime errors
✅ **Performance**: useCallback, proper dependency arrays
✅ **Code Organization**: Clear folder structure
✅ **Documentation**: JSDoc comments on all functions
✅ **Immutability**: State updates use spread operators
✅ **DRY Principle**: No duplicate logic

---

## Key Features

### 1. **Intelligent Chat**
- Multi-user simulation
- AI agent with conditional responses
- Auto-scroll to latest message

### 2. **Dynamic Knowledge Graph**
- Real-time topic extraction
- Physics-based node positioning
- Visual relationship mapping

### 3. **Action Item Extraction**
- Regex-based pattern matching
- Auto-assignment to message sender
- Completion tracking

---

## Testing Strategy

### Unit Tests (Recommended)
```typescript
// Services (pure functions)
test('AIService.getResponse mentions @omni', () => {
  const result = AIService.getResponse("@omni help", mockUser);
  expect(result.shouldRespond).toBe(true);
});

// Utilities
test('extractKeywords finds keywords', () => {
  const keywords = extractKeywords("Deployment on GPU");
  expect(keywords).toEqual(["Deployment", "GPU"]);
});
```

### Integration Tests
```typescript
// Hooks
test('useChat sends message and triggers AI', async () => {
  const { result } = renderHook(() => useChat());
  act(() => {
    result.current.sendMessage(mockUser, "@omni hello");
  });
  await waitFor(() => {
    expect(result.current.messages).toHaveLength(2); // User + AI
  });
});
```

### E2E Tests (Recommended with Playwright)
```typescript
test('full message flow', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[type="text"]', 'I will deploy tomorrow');
  await page.click('button[type="submit"]');
  await expect(page.locator('.task-item')).toContainText('deploy tomorrow');
});
```

---

## Performance Optimizations

1. **useCallback** - Prevents unnecessary re-renders
2. **Minimal re-renders** - State updates only affected components
3. **Physics throttling** - 50ms interval (20 FPS) for smooth animation
4. **Pure components** - Components don't trigger unnecessary renders

---

## Future Improvements

### Scalability
- [ ] Add React Query for server state management
- [ ] Implement virtual scrolling for large message lists
- [ ] Use Web Workers for physics calculations

### Features
- [ ] Real-time collaboration via WebSockets
- [ ] Persistent storage (localStorage/database)
- [ ] Export graph as PNG/SVG
- [ ] Task prioritization and deadlines

### Code Quality
- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Add E2E tests (Playwright)
- [ ] Add Storybook for component documentation
- [ ] Add performance monitoring (React DevTools Profiler)

---

## Folder Structure

```
src/
├── components/          # Presentational components
│   ├── Chat.tsx
│   ├── KnowledgeGraph.tsx
│   ├── ActionItems.tsx
│   └── ErrorBoundary.tsx
├── context/             # React Context
│   ├── AppContext.ts    # Context definition
│   └── AppProvider.tsx  # Provider component
├── hooks/               # Custom React hooks
│   ├── useChat.ts
│   ├── useKnowledgeGraph.ts
│   ├── useTasks.ts
│   └── useAppContext.ts
├── services/            # Business logic (pure functions)
│   ├── aiService.ts
│   ├── graphService.ts
│   ├── messageService.ts
│   └── taskService.ts
├── types.ts             # TypeScript interfaces
├── constants.ts         # Shared constants
├── utils.ts             # Utility functions
├── App.tsx              # Main orchestrator
└── main.tsx             # Entry point
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run type checking
npm run build

# Run linting
npm run lint
```

---

## Contributing

When adding features:
1. ✅ Add types first (`types.ts`)
2. ✅ Add business logic to services
3. ✅ Create custom hooks if state is needed
4. ✅ Build presentational components
5. ✅ Wire together in App.tsx
6. ✅ Add tests

---

**Built with**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
