# PULSE - Quick Presentation Notes

## One-Line Pitch
> **"An emotionally intelligent to-do app that adapts to your mood, because you're not a machine."**

---

## Problem We Solved
Traditional to-do apps treat every day the same. We built one that adapts.

| Traditional Apps | Pulse |
|-----------------|-------|
| Same UI always | UI changes with your mood |
| Generic suggestions | Suggestions match your energy |
| Guilt-driven | Celebration-focused |
| No emotional awareness | Mood-aware chatbot |

---

## Tech Stack (30 seconds to explain)

```
React 18 + TypeScript    → Modern, type-safe UI
Vite                    → Lightning-fast builds
Tailwind CSS v4         → Utility-first styling
Zustand                 → Simple state management
Framer Motion           → Smooth animations
Phosphor Icons          → Friendly icons
```

---

## 6 Core Features

### 1. Energy Check-in
- 5 mood states: 🔥💪🌊🌙😔
- Changes entire app color scheme
- Updates task suggestions

### 2. Daily Shloka
- Sanskrit verse with meaning
- 30 verses from Bhagavad Gita, Upanishads, Vedas
- "Reveal Meaning" toggle

### 3. Mood Chatbot
- Opens with "Namaste! 🙏 How was your day?"
- Detects mood from text
- Responds with empathy + suggestions

### 4. AI Task Breakdown
- User: "Plan marketing campaign"
- App: Splits into subtasks automatically

### 5. Smart Recommendations
- Prioritizes tasks based on:
  - Current energy
  - Time of day
  - Deadlines

### 6. Focus Timer
- Energy-adaptive Pomodoro
- High energy = 45 min
- Low energy = 15 min

---

## Architecture (Show This Diagram)

```
┌─────────────────────────────────────────────┐
│                    App                       │
│  ┌─────────────┐    ┌─────────────────┐    │
│  │ Components  │ ←  │ Zustand Stores │    │
│  └─────────────┘    └─────────────────┘    │
│         ↓                  ↓                │
│  ┌─────────────┐    ┌─────────────────┐    │
│  │ Framer      │    │ localStorage    │    │
│  │ Motion      │    │ (Persistence)   │    │
│  └─────────────┘    └─────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## Code Example - The Magic Line

```typescript
// One line changes entire app theme!
useEffect(() => {
  document.body.className = `energy-${level}`;
}, [level]);
```

**Output**: When user selects "Struggling", entire app turns pink with gentle messages.

---

## Chatbot Logic (Simple but Effective)

```typescript
const detectMood = (text) => {
  if (text.includes('struggling')) return 'struggling';
  if (text.includes('bad')) return 'bad';
  if (text.includes('good')) return 'good';
  return 'okay';
};

// Response
const responses = {
  struggling: "I hear you. You're not alone. 💙",
  bad: "Difficult days happen. Take it step by step.",
  good: "Great! Keep that momentum going!",
};
```

---

## Key Statistics

| Metric | Value |
|--------|-------|
| Components | 14 |
| Shlokas | 30 |
| Mood States | 5 |
| Bundle Size | ~145KB gzipped |

---

## Future Vision

1. **OpenAI Integration** - Smarter task breakdown
2. **Mobile App** - React Native version
3. **Cloud Sync** - Access anywhere
4. **Team Features** - Collaborative tasks

---

## Answering "How is this different?"

> "Other apps manage tasks. Pulse understands humans. We have good days and bad days - Pulse adapts to both."

---

## Closing Quote

*"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"*
**Bhagavad Gita 2.47**
> "You have the right to work, but never to its fruits."

---

**Built with ❤️ using React + TypeScript + Ancient Wisdom**
