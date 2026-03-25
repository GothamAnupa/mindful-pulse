# Pulse — Emotionally Intelligent To-Do App

## Concept & Vision

**Pulse** isn't just a task manager — it's a mindful productivity companion that acknowledges you are not a machine. Some days you have the energy to move mountains; other days, just getting out of bed is an achievement. Pulse reads the room (your room), adapts its interface to match your energy state, and gently guides you toward what matters — without the guilt trips.

The app feels like a calm friend who checks in on you, celebrates your wins, and never judges when you're struggling. It uses AI not to be fancy, but to genuinely reduce your cognitive load by deciding *when* you should do *what*, based on your energy, the time of day, and the nature of the task.

---

## Design Language

### Aesthetic Direction
**Warm minimalism meets soft futurism** — think a cozy Scandinavian workspace with subtle digital flourishes. Clean but not sterile. Spacious but not empty. The interface breathes. Soft gradients, rounded shapes, and gentle shadows create a sense of safety and calm.

### Color Palette
The app has **3 mood states** that shift the entire palette:

**High Energy (Flow State)**
- Primary: `#6366F1` (Indigo — focus, ambition)
- Secondary: `#F59E0B` (Amber — energy, warmth)
- Background: `#F8FAFC` (Cool white)
- Surface: `#FFFFFF`
- Text: `#1E293B`

**Medium Energy (Steady)**
- Primary: `#8B5CF6` (Violet — balanced, creative)
- Secondary: `#06B6D4` (Cyan — calm clarity)
- Background: `#F1F5F9`
- Surface: `#FFFFFF`
- Text: `#334155`

**Low Energy (Gentle)**
- Primary: `#EC4899` (Pink — compassion, self-care)
- Secondary: `#10B981` (Emerald — growth, gentleness)
- Background: `#FDF4FF` (Warm blush)
- Surface: `#FFF1F8`
- Text: `#4B5563`

**Universal**
- Success: `#10B981`
- Warning: `#F59E0B`
- Error: `#EF4444`
- Muted: `#94A3B8`

### Typography
- **Headings**: `Outfit` (600, 700) — friendly geometric sans-serif with personality
- **Body**: `DM Sans` (400, 500) — highly readable, warm, modern
- **Monospace** (for timers/counts): `JetBrains Mono`

### Spatial System
- Base unit: 4px
- Component padding: 16px (md), 24px (lg)
- Section spacing: 32px, 48px
- Border radius: 12px (cards), 8px (buttons), 24px (pills)
- Max content width: 800px (centered)

### Motion Philosophy
- **State transitions**: 300ms ease-out (smooth, not jarring)
- **Micro-interactions**: 150ms ease-in-out (snappy but soft)
- **Enter animations**: fade + translateY(8px), staggered 50ms
- **Theme transitions**: 500ms ease-in-out (the whole app shifts mood)
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (material-inspired but softer)

### Visual Assets
- **Icons**: Phosphor Icons (regular weight) — friendly, consistent, extensive
- **Illustrations**: Abstract blob shapes as decorative elements (CSS-generated)
- **Empty states**: Simple line illustrations with encouraging microcopy
- **Decorative**: Soft gradient blobs in corners, subtle grain texture overlay

---

## Layout & Structure

### Overall Architecture
Single-page application with a **dashboard-centric** layout. No navigation drawer — everything lives on one canvas that breathes with your mood.

```
┌─────────────────────────────────────────────────────────┐
│  Header: Greeting + Energy Indicator + Settings         │
├─────────────────────────────────────────────────────────┤
│  Energy Check-in Banner (when prompted)                 │
├────────────────────────┬────────────────────────────────┤
│                        │                                │
│   Today's Focus        │    Daily Shloka Card           │
│   (AI-recommended      │    (Spiritual wisdom)          │
│    tasks for now)      │                                │
│                        │    Weekly Insights            │
├────────────────────────┤                                │
│                        │    Quick Stats                 │
│   Task Pipeline       │                                │
│   (All tasks grouped  │    Mood Chatbot (floating)     │
│    by energy level)   │                                │
│                        │                                │
├────────────────────────┴────────────────────────────────┤
│  Quick Add Bar (always visible, docked at bottom)      │
└─────────────────────────────────────────────────────────┘
```

### Visual Pacing
1. **Header zone**: Minimal, atmospheric — greeting changes based on time, energy indicator pulses gently
2. **Focus zone**: Large, commanding — this is where the AI tells you "start here"
3. **Pipeline zone**: Organized, scannable — tasks organized by energy level, not just time
4. **Sidebar zone**: Daily inspiration (shlokas), insights, and quick stats
5. **Input zone**: Accessible but not intrusive — slides up on focus
6. **Chatbot zone**: Floating companion button for emotional support

---

## Features & Interactions

### 1. Energy Check-in System

**The Heart of Pulse**

Every morning (and optionally throughout the day), Pulse gently asks: *"How are you feeling?"*

**Check-in UI**: A modal with 5 emoji-based options, each with a label:
- 🔥 **Energized** — "Ready to tackle anything"
- 💪 **Focused** — "Got some good work in me"
- 🌊 **Steady** — "Moving at a comfortable pace"
- 🌙 **Tired** — "Need to take it easy"
- 😔 **Struggling** — "Be gentle with me today"

**Behavior**:
- Check-in appears on app open (can be snoozed for 30 min)
- Reminder at 2pm if no afternoon check-in
- Responses influence task recommendations, UI mood, and encouragement style
- History tracked to learn patterns (future: predict optimal work windows)

**Transition**: When energy changes, the entire app palette morphs over 500ms. A subtle ripple effect emanates from the check-in selection.

### 2. Daily Shloka

**Spiritual Wisdom for the Day**

A beautifully designed card that displays a daily verse from ancient Indian scriptures.

**Features**:
- 30+ curated shlokas from Bhagavad Gita, Upanishads, Rig Veda, and other scriptures
- Each shloka includes:
  - Original verse in Sanskrit
  - Transliteration
  - English meaning
  - Source reference
- "Show Meaning" toggle to reveal deeper understanding
- "Get Another" button to discover new shlokas
- Copy to clipboard functionality
- Daily rotation based on day of year

**Visual Design**:
- Warm orange/amber gradient background
- Decorative quote marks
- Serif font for Sanskrit text
- Smooth expand/collapse animations

### 3. Mindful Companion Chatbot

**Your Emotional Support Friend**

A compassionate chatbot that asks about your day and responds with appropriate support.

**Conversation Flow**:
1. Opens with a warm greeting ("Namaste! How was your day?")
2. Presents quick mood reply buttons:
   - Amazing 🌟
   - Good 🙂
   - Okay 🪷
   - Tough 🌧️
   - Struggling 💙
3. Detects mood from free-text input
4. Responds with:
   - Empathetic acknowledgment
   - 4 contextual suggestions based on mood
   - An affirming message

**Mood-Based Responses**:

| Mood | Response Style | Suggestions Focus |
|------|---------------|------------------|
| Amazing | Enthusiastic, encouraging | Taking on challenges, spreading positivity |
| Good | Warm, supportive | Maintaining momentum, planning ahead |
| Okay | Gentle, validating | Small wins, self-patience |
| Tough | Compassionate, grounding | Rest, gratitude, reaching out |
| Struggling | Deeply empathetic, safe | Breathing, self-care, hope |

**UI Design**:
- Floating chat button (purple gradient, bottom-right)
- Slide-up chat panel with gradient header
- Message bubbles (user: right, bot: left)
- Quick reply buttons
- Typing indicator animation

### 4. Smart Task Input

**Quick Add Bar**
- Always visible at bottom of screen
- Text input with placeholder: "What do you need to do? (I'll help you break it down)"
- Submit with Enter or button
- **AI Breakdown**: When a complex task is entered, Pulse analyzes it and:
  - Asks "Want me to break this down?" with a preview of subtasks
  - User can accept, modify, or dismiss
  - Subtasks inherit priority based on order

**Task Properties**:
- Title (required)
- Energy level: High / Medium / Low (AI-suggested, user can override)
- Due date/time (optional)
- Category (Work, Personal, Health, Creative — color-coded pills)
- Recurrence (none, daily, weekly, custom)
- Notes (expandable)

**Input States**:
- Default: Subtle, inviting
- Focused: Expands, shows energy selector and category options
- Submitting: Button shows spinner
- Success: Task card animates into pipeline with a satisfying "plop"

### 5. AI-Powered Task Pipeline

**Task Organization by Energy**

Tasks are grouped into three columns (or scrollable sections on mobile):

| 🔥 High Energy | 🌊 Medium Energy | 🌙 Low Energy |
|----------------|------------------|---------------|
| Deep work      | Administrative   | Quick wins    |
| Creative blocks| Emails/meetings  | Tidying       |
| Learning       | Reviewing        | Light admin   |

**Drag-and-Drop**: Tasks can be dragged between energy columns if the user knows themselves better.

**Task Card Anatomy**:
```
┌────────────────────────────────────┐
│ ○  Write project proposal      🔥  │
│    Due: Tomorrow, 2pm             │
│    💼 Work                        │
│                                    │
│    ┌─────────────────────────────┐ │
│    │ Subtask 1 of 3 ✓          │ │
│    │ Subtask 2 of 3 ○          │ │
│    └─────────────────────────────┘ │
└────────────────────────────────────┘
```

**Interactions**:
- Click to expand/edit
- Checkbox to complete (satisfying animation, confetti on task completion)
- Swipe right to complete, swipe left to snooze
- Long press for context menu (edit, delete, reschedule)

### 6. Today's Focus — AI Recommendations

**The "What Should I Do Now?" Engine**

Based on:
- Current energy state
- Time of day (morning = high-energy tasks prioritized, afternoon = lighter)
- Upcoming deadlines
- Task dependencies
- Past completion patterns

Pulse surfaces **1-3 tasks** in the Focus section with reasoning:

```
┌─────────────────────────────────────────────┐
│  ✨ Start with this                         │
│  ─────────────────────────────────────────── │
│  Review Q3 report                           │
│  "You crushed the research yesterday,         │
│   finishing this report should feel          │
│   satisfying."                              │
│                                             │
│  ⏱ Est. 45 min                             │
│  [ Start Timer ]  [ Snooze ]                │
└─────────────────────────────────────────────┘
```

**Reasoning Display**: Each recommendation shows a one-sentence "why" — this transparency builds trust in the AI.

### 7. Focus Timer

**Pomodoro-Inspired, Energy-Aware**

- Preset durations based on energy: Low=15min, Medium=25min, High=45min
- Customizable
- Visual: Circular progress ring that matches current energy color
- Audio: Soft chime on completion (optional)
- Break suggestions between sessions

**States**:
- Idle: Shows recommended duration
- Running: Animated ring, pause option
- Paused: Dimmed, resume option
- Complete: Celebration animation, break suggestion

### 8. Completion Celebrations

**No Guilt, All Celebration**

When a task is completed:
- Checkbox animates (scale + color fill)
- Subtle confetti burst (CSS particles)
- Task card fades and slides out
- If it's a significant task: "🎉 You finished it! That took courage."
- If it's a small task: "✓ Nice and done."

The language adapts to the task's difficulty and the user's energy level — encouraging but never patronizing.

### 9. Weekly Insights

**Weekly Reflection** (shown on dashboard):

```
┌─────────────────────────────────────────────┐
│  This Week                                  │
│  ─────────────────────────────────────────  │
│  12 tasks completed ✓                       │
│  3 tasks carried forward →                  │
│  Best productivity: Tuesday morning         │
│  Average energy: Steady (🌊)               │
│                                             │
│  "You showed up even on the hard days.      │
│   That matters."                            │
└─────────────────────────────────────────────┘
```

### 10. Settings & Personalization

- **Check-in preferences**: Frequency, snooze duration
- **Notification style**: Encouraging, neutral, minimal
- **Timer preferences**: Default durations, sound on/off
- **Theme**: Auto (follows energy), Light, Warm Dark
- **Data**: Export, clear history

---

## Component Inventory

### DailyShloka
- **Default**: Card with shloka verse, source badge
- **Expanded**: Shows transliteration and English meaning
- **Loading**: Spinning refresh icon
- **Copied**: Checkmark confirmation

### MoodChatbot
- **Button**: Floating gradient circle with chat icon
- **Open**: Slide-up panel with gradient header
- **Messages**: Bot (left, white), User (right, gradient)
- **Suggestions**: Clickable pill buttons
- **Affirmation**: Gradient background box with italic text

### EnergySelector
- **Default**: Row of 5 emoji buttons with labels
- **Hover**: Scale up 1.1x, subtle glow in energy color
- **Selected**: Filled background in energy color, checkmark appears
- **Disabled**: Reduced opacity (during loading)

### TaskCard
- **Default**: White surface, subtle shadow, energy pill colored
- **Hover**: Lift shadow, slight scale
- **Expanded**: Height animates to reveal subtasks/notes
- **Completing**: Checkbox fills, strikethrough animates, card fades
- **Dragging**: Elevated shadow, slight rotation, opacity 0.9
- **Dropped**: Settling animation with bounce

### QuickAddBar
- **Default**: Compact, 48px height, subtle border
- **Focused**: Expands to 120px, shows additional options
- **Processing**: Shows skeleton preview of AI breakdown
- **Error**: Red border, shake animation, error message below

### FocusTimer
- **Idle**: Circular ring (empty), duration displayed in center
- **Running**: Ring fills with color, time counts down, pulse animation
- **Paused**: Ring frozen, "Paused" label, dimmed colors
- **Complete**: Ring full, celebration burst, "Break time?" prompt

### Modal (Check-in, Settings, etc.)
- **Entering**: Backdrop fades in, modal scales from 0.95 with fade
- **Active**: Centered, backdrop click to close
- **Exiting**: Reverse of entering, 200ms

### Toast Notifications
- **Info**: Neutral background, icon left-aligned
- **Success**: Green tint, checkmark
- **Warning**: Amber tint, alert icon
- Position: Bottom-center, stacked if multiple
- Auto-dismiss: 4 seconds (can be snoozed)

### EmptyState
- **No tasks**: Illustration of a calm workspace, "Your plate is clear. Add something or just breathe."
- **No high-energy tasks**: "Nothing demanding right now. Perfect for administrative wins."
- **All complete**: Celebration illustration, "You did it. Rest easy."

---

## Technical Approach

### Stack
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS + CSS custom properties for theme switching
- **State**: Zustand (lightweight, perfect for this scale)
- **Storage**: localStorage for MVP (IndexedDB for future offline sync)
- **Icons**: Phosphor React
- **Animations**: Framer Motion (spring physics, easy orchestration)
- **AI Simulation**: For MVP, AI features will be simulated with smart heuristics (no external API needed). Framework is in place for OpenAI integration later.

### Architecture

```
src/
├── components/
│   ├── DailyShloka.tsx
│   ├── MoodChatbot.tsx
│   ├── EnergySelector.tsx
│   ├── TaskCard.tsx
│   ├── TaskPipeline.tsx
│   ├── QuickAddBar.tsx
│   ├── FocusSection.tsx
│   ├── FocusTimer.tsx
│   ├── WeeklyInsights.tsx
│   ├── Modal.tsx
│   └── Toast.tsx
├── data/
│   └── shlokas.ts
├── hooks/
│   ├── useEnergyState.ts
│   ├── useTasks.ts
│   ├── useTimer.ts
│   └── useRecommendations.ts
├── stores/
│   ├── energyStore.ts
│   ├── taskStore.ts
│   └── settingsStore.ts
├── utils/
│   ├── aiSimulation.ts
│   ├── taskBreakdown.ts
│   └── energyMapping.ts
├── types/
│   └── index.ts
├── App.tsx
├── index.css
└── main.tsx
```

### Data Model

```typescript
interface Task {
  id: string;
  title: string;
  energyLevel: 'high' | 'medium' | 'low';
  category: 'work' | 'personal' | 'health' | 'creative';
  dueDate?: Date;
  recurrence: 'none' | 'daily' | 'weekly' | 'custom';
  notes?: string;
  subtasks: Subtask[];
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  snoozedUntil?: Date;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface EnergyState {
  level: 'energized' | 'focused' | 'steady' | 'tired' | 'struggling';
  timestamp: Date;
  note?: string;
}

interface Shloka {
  verse: string;
  transliteration: string;
  meaning: string;
  source: string;
}

interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  text: string;
  suggestions?: string[];
}
```

---

## Quality Checklist

- [x] All buttons have working handlers
- [x] All forms validate and submit correctly
- [x] Energy state changes entire app theme
- [x] Tasks persist in localStorage
- [x] Timer works accurately
- [x] Animations are smooth (60fps)
- [x] Mobile layout is usable
- [x] Empty states have encouraging copy
- [x] No console errors
- [x] Realistic sample data on first load
- [x] Daily shloka rotates correctly
- [x] Mood chatbot responds to all mood types
- [x] Copy to clipboard works for shlokas
