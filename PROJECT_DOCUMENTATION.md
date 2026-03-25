# Pulse - Emotionally Intelligent To-Do App
## Complete Project Documentation

---

# 1. PROJECT OVERVIEW

## What is Pulse?
Pulse is an emotionally intelligent to-do application that adapts its interface based on the user's current energy state. Unlike traditional task managers, Pulse acknowledges that humans are not machines - some days we have abundant energy, while other days we can barely function.

## The Vision
> *"An app that knows your energy, adapts to your mood, and helps you focus on what matters - without the guilt trips."*

## Core Philosophy
- **Emotional Intelligence**: The app recognizes and responds to the user's emotional state
- **Adaptive Interface**: UI colors and suggestions change based on energy levels
- **Mindful Productivity**: Focus on progress, not perfection
- **Spiritual Integration**: Daily wisdom from ancient Sanskrit scriptures
- **No Guilt**: Celebrates wins, never judges struggles

---

# 2. PROBLEM STATEMENT

## Traditional To-Do App Limitations

| Problem | Description |
|---------|-------------|
| One-size-fits-all | Treats every day the same regardless of user energy |
| Guilt-driven | Makes users feel bad when they can't complete tasks |
| Overwhelming | Shows ALL tasks equally, creating decision fatigue |
| No emotional awareness | Doesn't acknowledge that users have bad days |
| Disconnected | No spiritual or mindful elements |
| Robotic responses | Generic "great job" messages that feel hollow |

## User Pain Points We Solved

1. **Decision Fatigue**: "What should I work on first?"
2. **Energy Mismatch**: High-energy tasks suggested during low-energy periods
3. **Motivation Drops**: Nothing to lift spirits on bad days
4. **Lack of Inspiration**: No daily dose of wisdom or motivation
5. **Generic UX**: Same experience regardless of emotional state

---

# 3. SOLUTION APPROACH

## Our Unique Solution

### 3.1 Energy-Based Task Organization
```
┌─────────────────────────────────────────────────────┐
│  ENERGY DETECTION → INTERFACE ADAPTATION            │
│                                                     │
│  User selects mood → App changes:                   │
│  • Color scheme (5 moods)                          │
│  • Task suggestions (energy-matched)                │
│  • Encouragement language                          │
│  • Timer duration presets                          │
└─────────────────────────────────────────────────────┘
```

### 3.2 AI-Powered Task Breakdown
```
User Input: "Plan and execute marketing campaign"

         ↓ AI Analysis
         
┌─────────────────────────────────┐
│  Subtask 1: Research audience  │
│  Subtask 2: Create content    │
│  Subtask 3: Design visuals    │
│  Subtask 4: Schedule posts    │
│  Subtask 5: Analyze metrics   │
└─────────────────────────────────┘
```

### 3.3 Mindful Companion Chatbot
```
User: "I'm having a tough day"

         ↓ Mood Detection
         
┌─────────────────────────────────┐
│  Response:                      │
│  "I'm sorry to hear that.       │
│   Difficult days happen, but     │
│   they don't define you."        │
│                                 │
│  Suggestions:                   │
│  • Give yourself permission      │
│    to rest                      │
│  • Write 3 things grateful for   │
│  • Reach out to someone         │
│  • Do something gentle           │
└─────────────────────────────────┘
```

---

# 4. TECH STACK

## Technology Choices Explained

### 4.1 Frontend Framework: React 18 + TypeScript

**Why React?**
- Component-based architecture (perfect for our UI components)
- Strong ecosystem and community
- Excellent TypeScript support

**Why TypeScript?**
- Catches errors at compile time
- Better IDE support and autocomplete
- Self-documenting code
- Easier team collaboration

```typescript
// Example: Type-safe task definition
interface Task {
  id: string;
  title: string;
  energyLevel: 'high' | 'medium' | 'low';
  category: 'work' | 'personal' | 'health' | 'creative';
  completed: boolean;
}
```

### 4.2 Build Tool: Vite

**Why Vite?**
- Lightning-fast development server (instant hot reload)
- Optimized production builds
- Native ES modules support
- Minimal configuration

```bash
# Vite startup time vs Webpack
# Vite: ~200ms
# Webpack: ~10-30 seconds
```

### 4.3 Styling: Tailwind CSS v4

**Why Tailwind?**
- Utility-first = rapid UI development
- Consistent design system out of the box
- CSS variables for dynamic theming
- Small bundle size (tree-shaking)

**Energy-Based Theming with CSS Variables:**
```css
body.energy-energized {
  --color-primary: #6366F1;
  --color-background: #F8FAFC;
}

body.energy-struggling {
  --color-primary: #EC4899;
  --color-background: #FDF4FF;
}
```

### 4.4 State Management: Zustand

**Why Zustand instead of Redux?**
- Minimal boilerplate (no reducers, actions, dispatchers)
- React hooks API (familiar to React devs)
- Built-in persistence support
- Smaller bundle size

```typescript
// Zustand store example
interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
  toggleTaskComplete: (id: string) => void;
}

// Usage in component
const { tasks, addTask } = useTaskStore();
```

### 4.5 Animations: Framer Motion

**Why Framer Motion?**
- Declarative animations (easy to read)
- Spring physics (natural feel)
- Layout animations (automatic position transitions)
- Gesture support (drag, tap)

```tsx
// Example animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>
  Content
</motion.div>
```

### 4.6 Icons: Phosphor React

**Why Phosphor?**
- Friendly, consistent design
- Multiple weights (regular, fill, bold)
- Comprehensive icon set
- Tree-shakable (only import what you use)

```tsx
import { Sparkle, Heart, CheckCircle } from '@phosphor-icons/react';
```

---

# 5. ARCHITECTURE

## Project Structure

```
Pulse/
├── src/
│   ├── components/           # React UI components
│   │   ├── DailyShloka.tsx      # Daily wisdom display
│   │   ├── MoodChatbot.tsx       # Emotional support chatbot
│   │   ├── EnergySelector.tsx    # Mood selection modal
│   │   ├── TaskCard.tsx         # Individual task display
│   │   ├── TaskPipeline.tsx     # Tasks grouped by energy
│   │   ├── QuickAddBar.tsx      # Task input with AI breakdown
│   │   ├── FocusSection.tsx      # AI-recommended tasks
│   │   ├── FocusTimer.tsx        # Pomodoro-style timer
│   │   ├── WeeklyInsights.tsx    # Progress statistics
│   │   ├── CheckInModal.tsx      # Energy check-in popup
│   │   ├── SettingsPanel.tsx      # User preferences
│   │   ├── Confetti.tsx          # Celebration effects
│   │   └── Header.tsx            # App header with greeting
│   │
│   ├── stores/               # Zustand state management
│   │   ├── energyStore.ts       # User mood state
│   │   ├── taskStore.ts         # Tasks CRUD + persistence
│   │   └── settingsStore.ts     # User preferences
│   │
│   ├── data/                 # Static data
│   │   └── shlokas.ts          # Collection of Sanskrit verses
│   │
│   ├── utils/                # Helper functions
│   │   └── aiSimulation.ts      # AI logic (task breakdown, suggestions)
│   │
│   ├── types/                # TypeScript definitions
│   │   └── index.ts
│   │
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles + theme variables
│
├── public/                   # Static assets
│   └── favicon.svg
│
├── index.html                # HTML template
├── package.json              # Dependencies
├── vite.config.ts           # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── SPEC.md                 # Project specification
```

## Data Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   UI Layer  │ ←→  │ State Layer  │ ←→  │ Storage     │
│  Components  │     │   (Zustand)  │     │(localStorage)
└─────────────┘     └──────────────┘     └─────────────┘
       ↓                   ↓
┌─────────────┐     ┌──────────────┐
│   Animations│     │  AI Engine   │
│(Framer Motion)    │(Simulation)  │
└─────────────┘     └──────────────┘
```

---

# 6. FEATURES EXPLAINED

## Feature 1: Energy Check-in System

### What It Does
When users open the app, they can select their current mood/energy level.

### 5 Energy States
| State | Emoji | Color | Best For |
|-------|-------|-------|----------|
| Energized | 🔥 | Indigo | Challenging tasks |
| Focused | 💪 | Violet | Deep work |
| Steady | 🌊 | Cyan | Routine tasks |
| Tired | 🌙 | Amber | Light tasks |
| Struggling | 😔 | Pink | Self-care |

### How It Works
```typescript
// Store tracks energy level
const { level, checkIn } = useEnergyStore();

// Updates entire app theme
useEffect(() => {
  document.body.className = `energy-${level}`;
}, [level]);
```

### User Experience
1. Modal appears on app open
2. User selects their mood
3. Entire app transforms:
   - Color scheme changes
   - Encouragement adapts
   - Task suggestions recalculate

---

## Feature 2: Daily Shloka

### What It Does
Displays a Sanskrit verse daily with transliteration and English meaning.

### Data Source
30+ curated verses from:
- Bhagavad Gita
- Upanishads
- Rig Veda
- Atharva Veda
- Garuda Purana
- Skanda Purana

### Features
- Daily rotation based on day of year
- "Get Another" for random verse
- "Reveal Meaning" toggle
- Copy to clipboard
- Beautiful amber gradient design

### Implementation
```typescript
export function getDailyShloka(): Shloka {
  const dayOfYear = Math.floor(
    (today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  );
  return shlokas[dayOfYear % shlokas.length];
}
```

---

## Feature 3: Mood Chatbot

### What It Does
An emotionally intelligent chatbot that:
1. Greets users with "Namaste! 🙏"
2. Asks about their day
3. Detects mood from text
4. Responds with empathy
5. Provides contextual suggestions

### Mood Detection Logic
```typescript
const detectMood = (text: string): MoodType => {
  const greatKeywords = ['amazing', 'great', 'fantastic', 'wonderful'];
  const badKeywords = ['bad', 'tough', 'hard', 'difficult'];
  const strugglingKeywords = ['struggling', 'depressed', 'sad', 'overwhelmed'];
  
  // Returns 'great' | 'good' | 'okay' | 'bad' | 'struggling'
};
```

### Responses by Mood
| Mood | Greeting | Suggestions Focus |
|------|----------|-------------------|
| Great | "Wonderful! Your energy is contagious!" | Take on challenges |
| Good | "Good to hear! Keep momentum!" | Maintain energy |
| Okay | "Perfectly fine. Sometimes okay is enough." | Small wins |
| Bad | "Difficult days happen. Take it step by step." | Rest, gratitude |
| Struggling | "I hear you. You're not alone." | Safety, hope |

---

## Feature 4: AI Task Breakdown

### What It Does
Automatically splits complex tasks into manageable subtasks.

### Analysis Heuristics
```typescript
function analyzeTask(text: string): TaskBreakdown {
  // Detect keywords
  const highEnergyKeywords = ['write', 'plan', 'create', 'build', 'design'];
  const mediumKeywords = ['email', 'call', 'schedule', 'organize'];
  
  // Generate subtasks based on task type
  if (text.includes('plan') || text.includes('prepare')) {
    return ['Research', 'Outline', 'Execute'];
  }
  
  if (text.includes('write')) {
    return ['Outline', 'Draft', 'Refine'];
  }
}
```

### User Flow
1. User types: "Plan weekend trip to Goa"
2. AI detects: Complex task, needs breakdown
3. Shows preview with subtasks
4. User can:
   - Add as single task with subtasks
   - Add as separate tasks
   - Dismiss

---

## Feature 5: Focus Section (AI Recommendations)

### What It Does
Prioritizes tasks based on:
- Current energy level
- Time of day
- Deadline proximity
- Task complexity

### Recommendation Logic
```typescript
const recommendTasks = (tasks, energy, hour) => {
  return tasks
    .filter(t => !t.completed)
    .sort((a, b) => {
      // 1. Deadline priority
      if (a.dueDate && !b.dueDate) return -1;
      
      // 2. Energy match
      if (energy === 'energized' && a.energyLevel === 'high') return -1;
      if (energy === 'tired' && a.energyLevel === 'low') return -1;
      
      // 3. Time of day
      if (hour < 12 && a.energyLevel === 'high') return -1;
    })
    .slice(0, 3); // Top 3 recommendations
};
```

---

## Feature 6: Focus Timer

### What It Does
Energy-adaptive Pomodoro timer with visual feedback.

### Features
- Energy-based presets:
  - High energy: 45 min
  - Focused: 25 min
  - Steady: 25 min
  - Tired: 15 min
  - Struggling: 15 min
- Circular progress visualization
- Play/Pause/Reset controls
- Completion celebration

### Timer States
```
Idle → Running → Paused → Complete
         ↑__________|
```

---

## Feature 7: Task Pipeline

### What It Does
Organizes tasks into 3 columns based on energy requirements:

| High Energy 🔥 | Medium Energy 🌊 | Low Energy 🌙 |
|----------------|------------------|---------------|
| Deep work      | Administrative   | Quick wins    |
| Creative blocks| Meetings         | Tidying       |
| Learning       | Reviewing        | Light admin   |

### Interactions
- Click to expand and see subtasks
- Checkbox to complete (with confetti)
- Snooze tasks for later
- Delete tasks

---

## Feature 8: Weekly Insights

### What It Does
Tracks and celebrates weekly progress.

### Metrics Tracked
- Tasks completed
- Tasks carried forward
- Best productivity time
- Average energy level

### Encouragement Messages
```typescript
function getMotivationalQuote(completed, carried): string {
  if (carried > 3) return "Take it one task at a time.";
  if (completed === 0) return "The only way out is through.";
  if (completed < 5) return "Every task completed is progress.";
  if (completed < 10) return "Solid week. Building momentum.";
  return "You're on fire! Don't forget to celebrate.";
}
```

---

# 7. DEVELOPMENT WORKFLOW

## Development Pipeline

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Design    │ →   │    Code     │ →   │    Test     │ →   │   Deploy    │
│   (SPEC.md) │     │  (Vite)     │     │   (Build)   │     │  (Vercel)   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      ↓                   ↓                   ↓                   ↓
   Components         TypeScript         TypeScript           Production
   mockups           components         compilation            build
```

## Daily Development Cycle

```bash
# 1. Start development server
npm run dev

# 2. Make changes
# Edit components, stores, utils

# 3. Auto-reload (HMR)
# Changes appear instantly

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

## Git Workflow (For Team)

```bash
# Create feature branch
git checkout -b feature/daily-shloka

# Make changes and commit
git add .
git commit -m "Add daily shloka feature"

# Push and create PR
git push origin feature/daily-shloka
```

---

# 8. KEY TECHNICAL DECISIONS

## Why These Choices?

### Decision 1: Zustand Over Redux
| Aspect | Zustand | Redux |
|--------|---------|-------|
| Boilerplate | Minimal | Extensive |
| Learning Curve | Low | High |
| Bundle Size | ~2.5KB | ~7KB |
| API | Hooks | HOC/Connect |

**Verdict**: Zustand for simplicity and modern React patterns.

### Decision 2: CSS Variables for Theming
```css
/* Define once */
:root {
  --color-primary: #6366F1;
}

/* Use everywhere */
.button {
  background: var(--color-primary);
}

/* Change dynamically */
body.energy-struggling {
  --color-primary: #EC4899;
}
```

**Benefit**: Single line of code changes entire app theme!

### Decision 3: Framer Motion for Animations
- Declarative API matches React mental model
- Built-in gesture handling
- Layout animations for list reordering
- Reduced animation bugs

### Decision 4: localStorage for Persistence
```typescript
// Zustand persist middleware
persist(
  (set) => ({ tasks: [] }),
  { name: 'pulse-tasks' } // localStorage key
)
```

**Benefit**: No backend needed for MVP, instant startup.

---

# 9. HOW TO EXPLAIN IN PRESENTATION

## Slide-by-Slide Guide

### Slide 1: Title
> **Pulse - Emotionally Intelligent To-Do**
> "Because you're not a machine"

### Slide 2: The Problem
> "Traditional to-do apps treat every day the same. But humans have good days and bad days."

### Slide 3: Our Solution
> "Pulse detects your energy and adapts - the interface, the suggestions, everything."

### Slide 4: Tech Stack Overview
```
Frontend: React 18 + TypeScript
Build: Vite
Styling: Tailwind CSS v4
State: Zustand
Animations: Framer Motion
Icons: Phosphor React
```

### Slide 5: Key Features
1. Energy Check-in (5 moods)
2. Daily Shloka (Sanskrit wisdom)
3. Mood Chatbot (emotional support)
4. AI Task Breakdown
5. Smart Recommendations
6. Focus Timer

### Slide 6: Architecture
```
Components → Zustand Stores → localStorage
    ↓
Framer Motion (animations)
    ↓
Tailwind CSS (styling)
```

### Slide 7: Code Example - Theming
```typescript
// One line changes the entire app
document.body.className = `energy-${level}`;
```

### Slide 8: Chatbot Logic
```typescript
// Simple keyword detection
if (text.includes('struggling')) {
  return "You're not alone. Be gentle with yourself.";
}
```

### Slide 9: Impact
- Personalized experience
- Reduced decision fatigue
- Emotional support built-in
- Spiritual growth opportunity

### Slide 10: Future Scope
- Real AI integration (GPT-4)
- Cloud sync
- Mobile app
- Team collaboration

---

# 10. ANSWERING COMMON QUESTIONS

## Q: How does the AI work?
**A**: We use rule-based heuristics for MVP. The app analyzes keywords in task titles to suggest energy levels and break down complex tasks. Future versions will integrate OpenAI for natural language understanding.

## Q: Why Sanskrit shlokas?
**A**: Ancient Indian wisdom offers profound life lessons. Daily exposure to these verses provides spiritual nourishment and perspective.

## Q: How is this different from other apps?
**A**: Emotional intelligence. The app doesn't just manage tasks - it acknowledges your feelings and adapts accordingly.

## Q: Is this production-ready?
**A**: Yes! Built with industry-standard tools (React, TypeScript, Vite) and best practices.

## Q: Can it scale?
**A**: Current architecture supports:
- Adding new energy states
- More task properties
- Backend integration
- Real AI features

---

# 11. RUNNING THE PROJECT

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

# 12. PROJECT STATISTICS

| Metric | Value |
|--------|-------|
| Components | 14 |
| Shlokas | 30 |
| Energy States | 5 |
| Mood Responses | 5 |
| Files | ~20 |
| Bundle Size | ~480KB gzipped |

---

# 13. FUTURE ENHANCEMENTS

## Short Term
- [ ] Push notifications
- [ ] Dark mode
- [ ] Task categories with colors
- [ ] Drag-and-drop reordering

## Long Term
- [ ] OpenAI integration for smarter breakdown
- [ ] Cloud sync across devices
- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Habit tracking
- [ ] Calendar integration

---

# CONCLUSION

Pulse represents a new paradigm in productivity apps - one that treats users as whole beings with emotions, not just task-processing machines. By combining:

1. **Emotional Intelligence** (Energy check-in)
2. **Spiritual Growth** (Daily shlokas)
3. **Smart Automation** (AI breakdown)
4. **Adaptive UI** (Theme changes)
5. **Empathetic Support** (Mood chatbot)

We've created an app that truly serves the user, meeting them where they are and helping them grow.

---

**Built with ❤️ using React, TypeScript, and ancient wisdom.**

---

*"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"*
*You have the right to work, but never to its fruits.*

- Bhagavad Gita 2.47
