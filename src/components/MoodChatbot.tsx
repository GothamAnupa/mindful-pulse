import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatCircle, X, PaperPlaneRight, Sparkle, Heart, Sun, Moon, CloudRain } from '@phosphor-icons/react';

interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
  suggestions?: string[];
}

type MoodType = 'great' | 'good' | 'okay' | 'bad' | 'struggling';

const moodResponses: Record<MoodType, { greeting: string; suggestions: string[]; affirmation: string }> = {
  great: {
    greeting: "That's wonderful! 🌟 Your energy is contagious. Let's make the most of this beautiful day!",
    suggestions: [
      "Take on that challenging task you've been avoiding",
      "Share your positivity with someone who needs it",
      "Set bigger goals - you're capable of more than you think",
      "Do something kind for yourself today"
    ],
    affirmation: "Your enthusiasm today is a gift. Use it wisely and spread those good vibes!"
  },
  good: {
    greeting: "Good to hear! 🙂 You've got steady energy flowing. Let's keep this momentum going.",
    suggestions: [
      "Focus on completing one important task",
      "Take a short walk to maintain your energy",
      "Connect with a friend or colleague",
      "Plan something fun for later today"
    ],
    affirmation: "Steady and reliable - that's a powerful combination. You've got this!"
  },
  okay: {
    greeting: "That's perfectly fine. 🪷 Not every day needs to be extraordinary. Sometimes 'okay' is enough.",
    suggestions: [
      "Start with just one small task",
      "Take a few deep breaths and reset",
      "Listen to something that lifts your spirits",
      "Be patient with yourself today"
    ],
    affirmation: "Every moment is a new beginning. You're doing better than you know."
  },
  bad: {
    greeting: "I'm sorry to hear that. 🌧️ Difficult days happen, but they don't define you. Let's take it one step at a time.",
    suggestions: [
      "Give yourself permission to rest",
      "Write down three things you're grateful for",
      "Reach out to someone you trust",
      "Do something gentle and nurturing for yourself"
    ],
    affirmation: "This feeling is temporary. Like clouds passing, this too shall pass. You are stronger than you think."
  },
  struggling: {
    greeting: "I hear you, and I see you. 💙 Some days are really hard, and that's okay. You don't have to be okay right now.",
    suggestions: [
      "Take a deep breath - you're safe right now",
      "Is there something small you can do for yourself?",
      "Remember: asking for help is strength, not weakness",
      "Sometimes just getting through the moment is enough"
    ],
    affirmation: "You are not alone. Even on the darkest days, there is always hope. Be gentle with yourself."
  }
};

export function MoodChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState<'greeting' | 'mood' | 'response'>('greeting');
  const [detectedMood, setDetectedMood] = useState<MoodType | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'bot',
        text: "Namaste! 🙏 I'm your mindfulness companion. How was your day today?"
      }]);
      setCurrentStep('mood');
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectMood = (text: string): MoodType => {
    const lowerText = text.toLowerCase();
    
    const greatKeywords = ['amazing', 'great', 'fantastic', 'wonderful', 'excellent', 'awesome', 'best', 'love', 'happy', 'joy', 'excited', 'energized', 'productive'];
    const goodKeywords = ['good', 'nice', 'fine', 'okay', 'alright', 'better', 'pretty good', 'pretty well', 'decent'];
    const okayKeywords = ['okay', 'ok', 'normal', 'usual', 'so-so', 'meh', 'nothing special', 'ordinary'];
    const badKeywords = ['bad', 'tough', 'hard', 'difficult', 'rough', 'not great', 'not good', 'awful', 'terrible', 'stress', 'worried', 'anxious'];
    const strugglingKeywords = ['struggling', 'depressed', 'sad', 'down', 'overwhelmed', 'exhausted', 'burned out', 'broken', 'cry', 'crying', 'hopeless', 'lost'];

    for (const keyword of strugglingKeywords) {
      if (lowerText.includes(keyword)) return 'struggling';
    }
    for (const keyword of badKeywords) {
      if (lowerText.includes(keyword)) return 'bad';
    }
    for (const keyword of okayKeywords) {
      if (lowerText.includes(keyword)) return 'okay';
    }
    for (const keyword of goodKeywords) {
      if (lowerText.includes(keyword)) return 'good';
    }
    for (const keyword of greatKeywords) {
      if (lowerText.includes(keyword)) return 'great';
    }
    
    return 'okay';
  };

  const handleUserMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: text.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const mood = detectMood(text);
    setDetectedMood(mood);

    setTimeout(() => {
      const response = moodResponses[mood];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: response.greeting,
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setCurrentStep('response');
    }, 800);
  };

  const handleQuickReply = (mood: MoodType) => {
    const responses: Record<MoodType, string> = {
      great: "It's been great! Feeling amazing today!",
      good: "It's been pretty good actually.",
      okay: "It's been okay, nothing special.",
      bad: "It's been tough, honestly.",
      struggling: "I'm really struggling today."
    };
    handleUserMessage(responses[mood]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleUserMessage(`I'd like to: ${suggestion}`);
  };

  const getMoodIcon = (mood: MoodType) => {
    switch (mood) {
      case 'great': return <Sun size={20} weight="fill" className="text-yellow-500" />;
      case 'good': return <CloudRain size={20} weight="fill" className="text-blue-400" />;
      case 'okay': return <Moon size={20} weight="fill" className="text-gray-400" />;
      case 'bad': return <CloudRain size={20} weight="fill" className="text-gray-500" />;
      case 'struggling': return <Heart size={20} weight="fill" className="text-pink-400" />;
    }
  };

  const MoodButton = ({ mood, label }: { mood: MoodType; label: string }) => (
    <button
      onClick={() => handleQuickReply(mood)}
      className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:border-purple-200 transition-all flex items-center gap-2"
    >
      {getMoodIcon(mood)}
      {label}
    </button>
  );

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 md:right-8 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg flex items-center justify-center z-50"
      >
        <ChatCircle size={28} weight="fill" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-32 right-4 md:right-8 w-[calc(100vw-2rem)] md:w-96 max-h-[70vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkle size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Mindful Companion</h3>
                  <p className="text-xs text-white/80">Always here to listen</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[85%] rounded-2xl px-4 py-3
                      ${message.type === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md'
                        : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                      }
                    `}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </motion.div>
              ))}

              {currentStep === 'mood' && detectedMood === null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 justify-start"
                >
                  <MoodButton mood="great" label="Amazing 🌟" />
                  <MoodButton mood="good" label="Good 🙂" />
                  <MoodButton mood="okay" label="Okay 🪷" />
                  <MoodButton mood="bad" label="Tough 🌧️" />
                  <MoodButton mood="struggling" label="Struggling 💙" />
                </motion.div>
              )}

              {messages.length > 1 && messages[messages.length - 1].suggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <p className="text-xs text-gray-500 font-medium">Here are some suggestions for you:</p>
                  <div className="space-y-1">
                    {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 hover:bg-purple-50 hover:border-purple-200 transition-all"
                      >
                        • {suggestion}
                      </button>
                    ))}
                  </div>
                  
                  {detectedMood && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                      <p className="text-xs text-gray-600 italic">
                        💭 {moodResponses[detectedMood].affirmation}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUserMessage(inputValue);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Share how you're feeling..."
                  className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!inputValue.trim()}
                  className={`
                    p-2 rounded-full transition-all
                    ${inputValue.trim()
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                    }
                  `}
                >
                  <PaperPlaneRight size={20} weight="fill" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
