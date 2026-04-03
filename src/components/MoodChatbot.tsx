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

    const lowerText = text.toLowerCase();
    const mood = detectMood(text);
    setDetectedMood(mood);

    setTimeout(() => {
      let responseText: string;
      let newSuggestions: string[];

      if (lowerText.includes('motivation') || lowerText.includes('quote') || lowerText.includes('inspire') || lowerText.includes('motivated')) {
        const quotes = [
          "You have the right to work, but never to its fruits. - Bhagavad Gita",
          "The mind is everything. What you think you become. - Buddha",
          "Be the change you wish to see in the world. - Gandhi",
          "Success is not final, failure is not fatal. - Churchill",
          "The only way to do great work is to love what you do. - Jobs",
          "Every expert was once a beginner. - Roosevelt",
          "Your only limit is your mind. - Unknown",
          "Dream big, start small, act now. - Unknown"
        ];
        responseText = `Here's some motivation for you: ✨\n\n"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
        newSuggestions = ["More motivation please", "I need help", "Thank you"];
      }
      else if (lowerText.includes('thank') || lowerText.includes('thanks')) {
        responseText = "You're welcome! 🙏 I'm always here for you. Remember, every day is a fresh start!";
        newSuggestions = ["How are you?", "I need motivation", "Goodbye"];
      }
      else if (lowerText.includes('goodbye') || lowerText.includes('bye') || lowerText.includes('close')) {
        responseText = "Take care! 🌸 Remember, you are capable of amazing things. Come back anytime you need support!";
        newSuggestions = [];
      }
      else if (lowerText.includes('how are you') || lowerText.includes('how do you do')) {
        responseText = "I'm here and ready to support you! 💜 How are you feeling right now?";
        newSuggestions = ["Feeling great!", "Not so good", "Just okay"];
      }
      else if (lowerText.includes('help') || lowerText.includes('need') || lowerText.includes('want')) {
        responseText = "I'm here to help! 💪 What would you like to talk about or need support with?";
        newSuggestions = ["I need motivation", "Tell me something positive", "I'm feeling down"];
      }
      else if (lowerText.includes('feeling') || lowerText.includes('emotion')) {
        responseText = "It's great that you're checking in with yourself! 💙 How are you really feeling?";
        newSuggestions = ["I'm feeling good", "Not great honestly", "Just okay"];
      }
      else {
        const response = moodResponses[mood];
        responseText = response.greeting;
        newSuggestions = response.suggestions;
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: responseText,
        suggestions: newSuggestions
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
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: suggestion
    };
    setMessages(prev => [...prev, userMessage]);

    const lowerSuggestion = suggestion.toLowerCase();
    let responseText: string;
    let newSuggestions: string[];

    if (lowerSuggestion.includes('challenge') || lowerSuggestion.includes('task')) {
      responseText = "That's the spirit! 🌟 Break it into small steps and tackle one at a time. You've got this!";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('share') || lowerSuggestion.includes('positivit') || lowerSuggestion.includes('someone')) {
      responseText = "What a beautiful thought! 💫 Sharing positivity can brighten someone's day - including your own!";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('bigger') || lowerSuggestion.includes('goals')) {
      responseText = "I love your ambition! 🚀 Dream big, but remember to celebrate small wins along the way!";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('kind') || lowerSuggestion.includes('yourself')) {
      responseText = "Self-care is so important! 🛀 You deserve kindness, especially from yourself. Take that moment!";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('focus') || lowerSuggestion.includes('important')) {
      responseText = "Focus creates progress! 🎯 One task at a time - you've built the foundation, now complete it!";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('walk') || lowerSuggestion.includes('energy')) {
      responseText = "Movement creates momentum! 👟 A short walk can reset your mind and boost creativity!";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('connect') || lowerSuggestion.includes('friend')) {
      responseText = "Social connections fuel the soul! 🤝 Reach out - you might brighten their day too!";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('plan') || lowerSuggestion.includes('fun')) {
      responseText = "Planning fun is half the fun! 🎉 Looking forward to something boosts your mood instantly!";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('small') || lowerSuggestion.includes('one')) {
      responseText = "Starting is the hardest part! 💪 Small steps lead to big changes. You're on your way!";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('breath') || lowerSuggestion.includes('reset')) {
      responseText = "Deep breaths bring peace! 🌬️ You control your thoughts, not the other way around!";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('listen') || lowerSuggestion.includes('music')) {
      responseText = "Music heals the heart! 🎵 Let your favorite song lift your spirits right now!";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('patient') || lowerSuggestion.includes('yourself')) {
      responseText = "Being patient with yourself is true wisdom! 🌸 You are doing the best you can!";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('rest') || lowerSuggestion.includes('permission')) {
      responseText = "Rest is productive! 😴 Sometimes the bravest thing you can do is pause and breathe.";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('gratitude')) {
      responseText = "Gratitude shifts your perspective! 🙏 Starting a gratitude list can change your whole day!";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('reach')) {
      responseText = "You don't have to carry this alone! 🤝 Connection is the key to strength. Reach out!";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('gentle') || lowerSuggestion.includes('nurturing') || lowerSuggestion.includes('nurture')) {
      responseText = "Be gentle with yourself! 🧘 Treat yourself like you'd treat a dear friend - with kindness.";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('deep breath') || lowerSuggestion.includes('safe')) {
      responseText = "You are safe right now! 🌸 Take a moment - one breath at a time. You're stronger than you know.";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('small') || lowerSuggestion.includes('do')) {
      responseText = "Even tiny steps matter! 👣 You showed up today, and that's enough. Be proud!";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('help') || lowerSuggestion.includes('strength') || lowerSuggestion.includes('weakness')) {
      responseText = "Asking for help is incredible strength! 💪 Vulnerability is not weakness - it's courage!";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('get through') || lowerSuggestion.includes('moment')) {
      responseText = "Surviving this moment is enough! ⏳ You don't need to solve everything right now. Just breathe.";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('tell me more') || lowerSuggestion.includes('feeling')) {
      responseText = "I understand. 💙 Would you like to share more, or would some motivation help?";
      newSuggestions = ["Tell me more", "I need motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('need something else') || lowerSuggestion.includes('else')) {
      const mood = detectedMood || 'okay';
      const moreOptions = {
        great: "What would you like to talk about? 🌟",
        good: "What can I help you with? 😊",
        okay: "What do you need right now? 🪷",
        bad: "I'm here for you. 🌧️ What would help?",
        struggling: "Take your time. 💙 What do you need?"
      };
      responseText = moreOptions[mood];
      newSuggestions = ["I need motivation", "Tell me about myself", "Goodbye"];
    }
    else if (lowerSuggestion.includes('thank')) {
      responseText = "You're so welcome! 🙏 Remember, I'm always here whenever you need support. Take care!";
      newSuggestions = ["How are you?", "I need motivation", "Goodbye"];
    }
    else if (lowerSuggestion.includes('more motivation') || lowerSuggestion.includes('more quote') || (lowerSuggestion.includes('need') && lowerSuggestion.includes('motivation'))) {
      const moreQuotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Believe you can and you're halfway there. - Theodore Roosevelt",
        "It does not matter how slowly you go as long as you do not stop. - Confucius",
        "Success is not final, failure is not fatal. - Winston Churchill",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt"
      ];
      responseText = `Here's another one: ✨\n\n"${moreQuotes[Math.floor(Math.random() * moreQuotes.length)]}"`;
      newSuggestions = ["One more please", "I need help with something", "Thank you"];
    }
    else if (lowerSuggestion.includes('one more') || lowerSuggestion.includes('another')) {
      const finalQuotes = [
        "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
        "The secret of getting ahead is getting started. - Mark Twain",
        "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
        "You have the power to create your own journey. - Unknown",
        "Every moment is a fresh beginning. - T.S. Eliot"
      ];
      responseText = `Here's your last dose of inspiration: 💫\n\n"${finalQuotes[Math.floor(Math.random() * finalQuotes.length)]}"`;
      newSuggestions = ["I'm feeling better now", "Thank you", "Goodbye"];
    }
    else if (lowerSuggestion.includes('positive') || lowerSuggestion.includes('something good') || lowerSuggestion.includes('good news')) {
      responseText = "Here's something positive: 🌟 You're here, you're trying, and that's already more than enough. Every small step counts!";
      newSuggestions = ["Tell me more", "I need more motivation", "Thank you"];
    }
    else if (lowerSuggestion.includes('down') || lowerSuggestion.includes('sad') || lowerSuggestion.includes('low')) {
      const supportiveResponses = [
        "I'm sorry you're feeling this way. 💙 Remember, this feeling is temporary. You've gotten through hard days before, and you'll get through this too.",
        "It's okay to feel down sometimes. 🌧️ Be gentle with yourself - you're doing the best you can with what you have right now.",
        "I hear you. 💜 You don't have to pretend to be okay. Let yourself feel, and know that better days are coming."
      ];
      responseText = supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
      newSuggestions = ["Tell me more", "I need motivation", "Just needed to talk"];
    }
    else if (lowerSuggestion.includes('better') || lowerSuggestion.includes('good now') || lowerSuggestion.includes('better now')) {
      responseText = "That's wonderful to hear! 🌟 I'm so glad you're feeling better. Remember, I'm always here whenever you need me!";
      newSuggestions = ["Thanks!", "Let's chat more", "Goodbye"];
    }
    else if (lowerSuggestion.includes('need something') || lowerSuggestion.includes('help me') || lowerSuggestion.includes('can you help')) {
      const mood = detectedMood || 'okay';
      const helpResponses = {
        great: "That's the spirit! 🌟 What would you like to achieve? Let's make it happen!",
        good: "Great! 😊 What can I help you with today?",
        okay: "Of course! 🪷 What's on your mind? I'm here to help.",
        bad: "I'm here for you. 🌧️ Tell me what you need, and let's work through it together.",
        struggling: "Take your time. 💙 There's no rush. What do you need?"
      };
      responseText = helpResponses[mood];
      newSuggestions = ["I need motivation", "Tell me something", "Thank you"];
    }
    else if (lowerSuggestion.includes('just needed') || lowerSuggestion.includes('just talk') || lowerSuggestion.includes('talk')) {
      responseText = "I'm always here to chat! 💜 Sometimes just talking helps. What's on your mind?";
      newSuggestions = ["Tell me about your day", "I need motivation", "Nothing, thanks"];
    }
    else if (lowerSuggestion.includes('day') || lowerSuggestion.includes('today')) {
      const dayResponses = [
        "Every day is a fresh start! 🌅 What made today special for you?",
        "Today is a gift - that's why we call it the present! 🎁 What was the best part of your day?",
        "Days may repeat, but each one offers something new. ✨ What made you smile today?"
      ];
      responseText = dayResponses[Math.floor(Math.random() * dayResponses.length)];
      newSuggestions = ["Tell me more", "I need motivation", "Good"];
    }
    else {
      const mood = detectedMood || 'okay';
      const defaultResponses: Record<MoodType, string> = {
        great: "That's great to hear! 🌟 Anything else you'd like to share?",
        good: "Good to know! 😊 What's on your mind?",
        okay: "I hear you. 🪷 What would be helpful right now?",
        bad: "I understand. 🌧️ Take your time, I'm here.",
        struggling: "I'm here for you. 💙 No pressure at all."
      };
      responseText = defaultResponses[mood];
      newSuggestions = ["I need motivation", "Tell me more", "Thank you"];
    }

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: responseText,
        suggestions: newSuggestions
      };
      setMessages(prev => [...prev, botMessage]);
    }, 800);
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
