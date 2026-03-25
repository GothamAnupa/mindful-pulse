import type { TaskBreakdown, TaskEnergy, Category } from '../types';

const highEnergyKeywords = ['write', 'plan', 'create', 'build', 'design', 'develop', 'analyze', 'strategy', 'launch', 'review complex', 'negotiate', 'research deep'];
const mediumEnergyKeywords = ['email', 'call', 'schedule', 'organize', 'update', 'check', 'review', 'respond', 'coordinate', 'prepare'];
const lowEnergyKeywords = ['pay', 'confirm', 'reply', 'read', 'watch', 'listen', 'browse', 'simple', 'quick'];

const categoryKeywords: Record<Category, string[]> = {
  work: ['report', 'email', 'meeting', 'project', 'client', 'deadline', 'presentation', 'proposal', 'budget', 'review'],
  personal: ['grocery', 'bank', 'appointment', 'call', 'visit', 'home', 'car', 'insurance', 'planning'],
  health: ['exercise', 'workout', 'yoga', 'meditate', 'sleep', 'doctor', 'appointment', 'medication', 'therapy'],
  creative: ['sketch', 'draw', 'paint', 'write', 'create', 'music', 'photo', 'video', 'design', 'art']
};

export function analyzeTask(text: string): TaskBreakdown {
  const lowerText = text.toLowerCase();
  
  const suggestedEnergy = detectEnergyLevel(lowerText);
  const suggestedCategory = detectCategory(lowerText);
  const subtasks = generateSubtasks(text, lowerText);
  
  return {
    original: text,
    subtasks,
    suggestedEnergy,
    suggestedCategory
  };
}

function detectEnergyLevel(text: string): TaskEnergy {
  for (const keyword of highEnergyKeywords) {
    if (text.includes(keyword)) return 'high';
  }
  
  for (const keyword of mediumEnergyKeywords) {
    if (text.includes(keyword)) return 'medium';
  }
  
  for (const keyword of lowEnergyKeywords) {
    if (text.includes(keyword)) return 'low';
  }
  
  const words = text.split(/\s+/).length;
  if (words > 15) return 'high';
  if (words > 8) return 'medium';
  return 'low';
}

function detectCategory(text: string): Category {
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return category as Category;
      }
    }
  }
  return 'personal';
}

function generateSubtasks(text: string, lowerText: string): string[] {
  const subtasks: string[] = [];
  
  if (lowerText.includes(' and ')) {
    const parts = text.split(/\s+and\s+/i);
    return parts.map(p => p.trim()).filter(p => p.length > 0);
  }
  
  if (lowerText.includes(', then ')) {
    const parts = text.split(/,\s*then\s*/i);
    return parts.map(p => p.trim()).filter(p => p.length > 0);
  }
  
  if (lowerText.includes('plan') || lowerText.includes('prepare')) {
    subtasks.push('Research and gather information');
    subtasks.push('Outline the approach');
    subtasks.push('Execute the plan');
  }
  
  if (lowerText.includes('write') || lowerText.includes('draft')) {
    subtasks.push('Outline key points');
    subtasks.push('Write first draft');
    subtasks.push('Review and refine');
  }
  
  if (lowerText.includes('review')) {
    subtasks.push('Go through the material');
    subtasks.push('Take notes on key items');
    subtasks.push('Make decisions or summarize findings');
  }
  
  if (subtasks.length === 0) {
    const words = text.split(/\s+/);
    if (words.length > 10) {
      subtasks.push('Break down into steps');
      subtasks.push('Execute step 1');
      subtasks.push('Execute step 2');
    }
  }
  
  return subtasks;
}

export function getRecommendationReasoning(task: { title: string; energyLevel: TaskEnergy; dueDate?: Date }): string {
  const reasons = [
    "You're in a great flow state — let's keep it going.",
    "This aligns perfectly with your current energy.",
    "A quick win to build momentum.",
    "Perfect task for your energy right now.",
    "Knocking this out will free up mental space."
  ];
  
  if (task.dueDate) {
    const hoursUntilDue = (task.dueDate.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilDue < 2) {
      return "This is due soon — let's get it done.";
    }
    if (hoursUntilDue < 24) {
      return "Due tomorrow. Better to handle it now while you have energy.";
    }
  }
  
  const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
  return randomReason;
}

export function getEncouragementMessage(energyLevel: string): string {
  switch (energyLevel) {
    case 'energized':
      return "You're on fire today. What do you want to accomplish?";
    case 'focused':
      return "You've got good momentum. Let's make progress.";
    case 'steady':
      return "A comfortable pace today. Small steps still move you forward.";
    case 'tired':
      return "Rest is productive too. Just do what feels manageable.";
    case 'struggling':
      return "Be gentle with yourself. Just getting through today is enough.";
    default:
      return "Let's take it one task at a time.";
  }
}

export function getCompletionMessage(_taskTitle: string, isSubtask: boolean = false): string {
  if (isSubtask) {
    return "✓ Step done. Keep going.";
  }
  
  const messages = [
    "🎉 You did it! That took effort.",
    "✓ One down. How does that feel?",
    "✓ Done and dusted. Well done.",
    "Another task bites the dust. Nice work.",
    "✓ Complete! Your to-do list thanks you."
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}
