# Quick Start - AI Integration

## 🚀 Get Started in 3 Steps

### Step 1: Start the Backend

```bash
# In your backend directory
python backend.py
```

**Expected Output:**
```
Starting Bedrock proxy on http://localhost:8080
```

**Verify it's running:**
```bash
curl http://localhost:8080/v1/models
```

---

### Step 2: Start the Frontend

```bash
# In your project directory
npm run dev
```

**Expected Output:**
```
VITE v7.2.4  ready in 234 ms

➜  Local:   http://localhost:5173/
```

---

### Step 3: Try AI Features

Open http://localhost:5173 and try these:

#### 1. **AI Chat Response**
```
Type: "@omni what's the status?"
```
✅ AI responds with context-aware answer

#### 2. **AI Graph Analysis**
```
1. Send a few messages with keywords:
   - "We need to deploy the API"
   - "Budget approval needed"
   - "Optimization complete"

2. Click "AI Analysis" button in Knowledge Graph panel
```
✅ AI provides insights about topics

#### 3. **Smart Task Extraction**
```
Type: "I will deploy the API tomorrow and update documentation"
```
✅ AI extracts 2 tasks instead of 1

---

## ⚡ Quick Feature Overview

### Feature 1: Intelligent Chat 💬
- **Before:** Simple pattern matching
- **After:** Real AI with conversation context
- **Trigger:** @omni, "help", "error", "deployment", or "?"

### Feature 2: Graph Insights 🧠
- **Before:** Static visualization
- **After:** AI analyzes topics and suggests connections
- **Trigger:** Click "AI Analysis" button

### Feature 3: Smart Tasks ✅
- **Before:** Regex patterns (limited)
- **After:** AI understands intent (multiple tasks from one sentence)
- **Trigger:** Automatic on message send

---

## 🎯 Example Conversation

```
You (as Dev Lead):
"@omni we need to optimize the GPU deployment and update the budget"

Omni (AI Agent):
"GPU and deployment are connected in the graph. I recommend confirming budget approval before proceeding with optimization work to avoid resource allocation issues."

[Knowledge Graph automatically adds nodes: GPU, Deployment, Budget]
[AI extracts 2 tasks:
  1. "optimize the GPU deployment"
  2. "update the budget"]
```

---

## 🔍 Verify AI is Working

### Check Backend Connection
```bash
# Should return: {"object":"list","data":[...]}
curl http://localhost:8080/v1/models
```

### Check Frontend Console
```bash
# Open browser DevTools (F12)
# Look for:
✅ No CORS errors
✅ "AI Response:" logs when sending messages
```

### Visual Indicators
- **Thinking Dots:** Animated dots when AI is processing
- **AI Analysis Button:** Purple gradient button in graph
- **Insights Panel:** Floating panel with AI analysis

---

## 🐛 Common Issues

### Issue 1: "AI not responding"

**Symptom:** No response after @omni
**Fix:**
```bash
# Check backend is running
curl http://localhost:8080/v1/models

# Restart backend if needed
```

### Issue 2: "CORS errors"

**Symptom:** Console shows CORS policy errors
**Fix:** Backend already has CORS enabled. Clear browser cache.

### Issue 3: "Task extraction not working"

**Symptom:** No tasks created
**Note:** AI has fallback to regex. Check console for errors.

---

## 🎨 UI Features

### AI Thinking State
When AI is processing, you'll see:
- Animated bouncing dots
- "Omni is thinking..." message
- Chat input still active

### AI Insights Panel
In Knowledge Graph:
- Purple "AI Analysis" button appears
- Click to analyze topics
- Results show in floating panel
- "Refresh Analysis" to update

### Smart Features
- Auto-scroll on new messages
- Context-aware responses (remembers last 5 messages)
- Graceful fallbacks if API fails

---

## 📊 What AI Can Do

### ✅ Understands Context
```
User: "What about deployment?"
AI: [Remembers previous discussion about GPU and budget]
    "Deployment is connected to GPU optimization. Budget approval is pending."
```

### ✅ Analyzes Relationships
```
Graph has: [Budget, API, Deployment, GPU]
AI: "There's a dependency: API costs should be in Budget before Deployment."
```

### ✅ Extracts Complex Tasks
```
Message: "I will deploy by Friday, update docs, and notify stakeholders"
AI extracts:
  1. "deploy by Friday"
  2. "update docs"
  3. "notify stakeholders"
```

---

## 🚀 Advanced Tips

### Tip 1: Better Prompts
```
❌ "help"
✅ "@omni what's the status of GPU deployment?"
```

### Tip 2: Use Keywords
AI responds to: deployment, error, optimization, budget, API, GPU

### Tip 3: Context Matters
AI remembers last 5 messages. Build on previous discussion for better answers.

### Tip 4: Graph Analysis
Run analysis after 5+ messages for best insights.

---

## 📝 Quick Reference

| Action | Result |
|--------|--------|
| Type "@omni [question]" | AI responds with context |
| Click "AI Analysis" | AI analyzes graph topics |
| Send "I will [task]" | AI extracts tasks |
| Send 5+ messages | AI has enough context |

---

## 🎉 You're All Set!

Your app now has:
- ✅ Real AI chat (powered by Claude Sonnet 4.5)
- ✅ Graph insights (AI-analyzed topics)
- ✅ Smart task extraction (better than regex)
- ✅ Context awareness (remembers conversation)

**Enjoy your AI-powered team chat! 🚀**
