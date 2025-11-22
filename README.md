# DevStream Chat - Intelligent Team Communication

A modern React application demonstrating best-practice architecture with three intelligent features: AI-powered chat, dynamic knowledge graph visualization, and automatic action item extraction.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Vite](https://img.shields.io/badge/Vite-7-646CFF) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC)

---

## ✨ Features

### 💬 Intelligent Chat
- Multi-user conversation simulation
- AI agent with context-aware responses
- @mention detection
- Auto-scroll to latest messages

### 🕸️ Dynamic Knowledge Graph
- Real-time topic extraction from messages
- Physics-based node positioning
- Visual relationship mapping
- Animated nodes with glow effects

### ✅ Action Item Extraction
- Automatic task detection using regex patterns
- Task assignment to message senders
- Completion tracking
- One-click task management

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:5173
```

---

## 📁 Project Structure

```
src/
├── 📱 main.tsx                    # Entry point with providers
├── 🎨 App.tsx                     # Main orchestrator
│
├── 📦 components/                 # UI Components
│   ├── Chat.tsx                   # Chat interface
│   ├── KnowledgeGraph.tsx         # Graph visualization
│   ├── ActionItems.tsx            # Task list
│   └── ErrorBoundary.tsx          # Error handling
│
├── 🪝 hooks/                      # Custom React Hooks
│   ├── useChat.ts                 # Chat state management
│   ├── useKnowledgeGraph.ts       # Graph state + physics
│   ├── useTasks.ts                # Task management
│   └── useAppContext.ts           # Context consumer
│
├── 🔧 services/                   # Business Logic
│   ├── aiService.ts               # AI response logic
│   ├── graphService.ts            # Graph operations
│   ├── messageService.ts          # Message creation
│   └── taskService.ts             # Task operations
│
├── 🌍 context/                    # Global State
│   ├── AppContext.ts              # Context definition
│   └── AppProvider.tsx            # Context provider
│
├── 📝 types.ts                    # TypeScript interfaces
├── 🔢 constants.ts                # Shared constants
└── 🛠️ utils.ts                    # Utility functions
```

---

## 🏗️ Architecture

This application follows a **layered architecture** with clear separation of concerns:

```
Entry & Providers (main.tsx)
         ↓
Orchestration (App.tsx)
         ↓
Custom Hooks (useChat, useKnowledgeGraph, useTasks)
         ↓
Services (Pure business logic)
         ↓
Components (Pure presentation)
```

### Key Principles

✅ **Separation of Concerns** - Each layer has a single responsibility
✅ **Testability** - Pure functions and isolated hooks
✅ **Reusability** - Components accept props, hooks are generic
✅ **Type Safety** - TypeScript interfaces for all data
✅ **Error Handling** - Error boundaries catch runtime errors
✅ **Performance** - Optimized with useCallback and proper dependencies

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Detailed architecture explanation with diagrams |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Visual guide to file structure and patterns |
| [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) | Complete guide to application behavior |

---

## 🎯 How It Works

### Sending a Message

```
User types → Chat component → App.tsx → useChat hook
                                            ↓
                        MessageService creates message
                                            ↓
                     AIService checks if AI responds
                                            ↓
                  onMessageSent callback triggers:
                     • updateGraph() → Extract topics
                     • extractTask() → Detect actions
                                            ↓
                     Components re-render with new data
```

### Knowledge Graph Updates

1. Extract keywords from message text
2. Grow existing nodes or spawn new ones
3. Link keywords found together
4. Physics simulation runs continuously (20 FPS):
   - Center gravity pulls nodes to middle
   - Node repulsion prevents overlaps
   - Organic jitter adds life

### Action Item Detection

Scans messages for patterns:
- "I will ___"
- "We need to ___"
- "Don't forget to ___"
- "Please ___"
- "Action item: ___"

Automatically creates tasks assigned to message sender.

---

## 🧪 Testing

```bash
# Type checking
npm run build

# Linting
npm run lint
```

### Recommended Test Structure

```typescript
// Services (Unit Tests)
test('AIService detects @omni mention', () => {
  const result = AIService.getResponse("@omni help", mockUser);
  expect(result.shouldRespond).toBe(true);
});

// Hooks (Integration Tests)
test('useChat sends message', () => {
  const { result } = renderHook(() => useChat());
  act(() => result.current.sendMessage(user, "hello"));
  expect(result.current.messages).toHaveLength(1);
});

// Components (Component Tests)
test('Chat renders messages', () => {
  render(<Chat messages={mockMessages} ... />);
  expect(screen.getByText("Hello")).toBeInTheDocument();
});
```

---

## 🎨 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework with latest features |
| **TypeScript 5.9** | Type safety and IntelliSense |
| **Vite 7** | Fast build tool and dev server |
| **Tailwind CSS 3.4** | Utility-first styling |
| **Lucide React** | Beautiful icon set |

---

## 🎓 Learning Resources

### For This Codebase
1. Start with `types.ts` to understand data structures
2. Read `services/` to see business logic
3. Read `hooks/` to see state management
4. Read `components/` to see UI rendering
5. Read `App.tsx` to see how it all connects

### General React Patterns
- [React Documentation](https://react.dev)
- [Custom Hooks Guide](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [TypeScript + React](https://react-typescript-cheatsheet.netlify.app/)

---

## 🚀 Best Practices Demonstrated

### Architecture
✅ Container/Presenter pattern
✅ Service layer for business logic
✅ Custom hooks for stateful logic
✅ Context API for global state
✅ Error boundaries for error handling

### Code Quality
✅ TypeScript for type safety
✅ ESLint for code standards
✅ JSDoc comments on all functions
✅ Consistent naming conventions
✅ Immutable state updates

### Performance
✅ useCallback for stable references
✅ Proper useEffect dependencies
✅ Physics throttled to 20 FPS
✅ Minimal re-renders

### Maintainability
✅ Clear folder structure
✅ Single responsibility per file
✅ Comprehensive documentation
✅ Easy to extend

---

## 📈 Future Enhancements

### Features
- [ ] Real-time collaboration via WebSockets
- [ ] Persistent storage (localStorage/database)
- [ ] Export graph as PNG/SVG
- [ ] Task priorities and deadlines
- [ ] Search and filter messages
- [ ] User authentication

### Technical
- [ ] Unit tests (Jest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Storybook for component docs
- [ ] Performance monitoring
- [ ] Web Workers for physics
- [ ] Virtual scrolling for large lists

---

## 🤝 Contributing

This codebase follows strict architectural patterns. When adding features:

1. ✅ Add types first (`types.ts`)
2. ✅ Add business logic to services
3. ✅ Create custom hooks if state is needed
4. ✅ Build presentational components
5. ✅ Wire together in App.tsx
6. ✅ Add tests

---

## 📝 License

MIT

---

## 🎯 Summary

This is a **production-ready React application** demonstrating:

- 🏗️ Clean architecture with separation of concerns
- 🧪 Testable code with pure functions
- 📝 Type-safe with TypeScript
- 🎨 Modern UI with Tailwind CSS
- 🚀 Fast development with Vite
- 📚 Comprehensive documentation

**Perfect for**:
- Learning modern React patterns
- Understanding clean architecture
- Building scalable applications
- Team onboarding reference

---

**Built with ❤️ using React, TypeScript, and best practices**
