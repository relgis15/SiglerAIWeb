
import { useEffect, useRef, useState } from 'react';
import { Send, Bot, User, Sparkles, Settings, Moon, Sun } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [botName, setBotName] = useState('Sigler AI');
  const [primaryColor, setPrimaryColor] = useState('sigler-blue');
  const [accentColor, setAccentColor] = useState('light-gray');
  const messagesEndRef = useRef(null);
  const chatflowId = '60f1e766-b99e-48e2-8022-a43630b4a540';
  const flowiseURL = 'https://api.siglerai.com';

  // Customizable theme variables with solid and gradient options
  const colorSchemes = {
    'sigler-blue': 'from-blue-600 to-blue-600', // Your brand color - solid
    'blue-gradient': 'from-blue-500 to-indigo-600',
    'purple-gradient': 'from-purple-600 to-blue-600',
    'emerald-gradient': 'from-emerald-500 to-teal-600',
    'solid-slate': 'from-slate-700 to-slate-700',
    'solid-emerald': 'from-emerald-600 to-emerald-600',
    'solid-purple': 'from-purple-600 to-purple-600',
    'solid-red': 'from-red-600 to-red-600',
    'orange-gradient': 'from-orange-500 to-red-500',
    'pink-gradient': 'from-pink-500 to-rose-500',
    'teal-gradient': 'from-teal-500 to-cyan-500'
  };

  const accentSchemes = {
    'light-gray': 'from-gray-200 to-gray-200', // Neutral for bot messages
    'soft-blue': 'from-blue-100 to-blue-200',
    'warm-gray': 'from-gray-300 to-gray-300',
    'emerald-accent': 'from-emerald-400 to-cyan-400',
    'purple-accent': 'from-pink-500 to-purple-500',
    'orange-accent': 'from-yellow-400 to-orange-400',
    'violet-accent': 'from-violet-500 to-fuchsia-500',
    'solid-indigo': 'from-indigo-500 to-indigo-500',
    'solid-teal': 'from-teal-500 to-teal-500',
    'solid-amber': 'from-amber-500 to-amber-500'
  };

  const theme = {
    primary: isDark ? colorSchemes[primaryColor] : colorSchemes[primaryColor],
    accent: isDark ? accentSchemes[accentColor] : accentSchemes[accentColor],
    background: isDark ? 'from-slate-900 via-slate-800 to-slate-900' : 'from-gray-50 via-blue-50 to-gray-100',
    card: isDark ? 'bg-white/10 backdrop-blur-xl border-white/20' : 'bg-white/70 backdrop-blur-xl border-white/40',
    text: isDark ? 'text-white' : 'text-slate-800',
    textSecondary: isDark ? 'text-slate-300' : 'text-slate-600'
  };

  useEffect(() => {
    setMessages([
      {
        role: 'bot',
        content: '✨ Welcome to SiglerAI! I\'m your intelligent assistant ready to help you with anything you need. What would you like to explore today?',
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { 
      role: 'user', 
      content: input,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(
        `${flowiseURL}/api/v1/prediction/${chatflowId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: input,
            chatId: 'sigler-demo-user-' + Date.now()
          })
        }
      );
      
      const data = await res.json();
      const botMessage = { 
        role: 'bot', 
        content: data.text,
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { 
        role: 'bot', 
        content: '⚠️ I encountered an issue processing your request. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-1">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
      </div>
      <span className="text-xs opacity-70 ml-2">AI is typing...</span>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} flex items-center justify-center p-4 font-sans relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r ${theme.primary} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse`}></div>
        <div className={`absolute top-3/4 right-1/4 w-72 h-72 bg-gradient-to-r ${theme.accent} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse`} style={{animationDelay: '2s'}}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse`} style={{animationDelay: '4s'}}></div>
      </div>

      <div className={`w-full max-w-4xl h-[700px] ${theme.card} rounded-3xl shadow-2xl flex flex-col overflow-hidden border backdrop-blur-xl relative`}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${theme.primary} text-white px-6 py-4 shadow-lg relative overflow-hidden`}>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{botName}</h1>
                <p className="text-sm opacity-90">Powered by Advanced AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl backdrop-blur-sm transition-all duration-200 ${
                  showSettings ? 'bg-white/30 rotate-90' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className={`${theme.card} backdrop-blur-xl border-b border-white/20 px-6 py-4 animate-in slide-in-from-top-4 duration-300`}>
            <h3 className={`${theme.text} font-semibold mb-4 flex items-center`}>
              <Settings className="w-4 h-4 mr-2" />
              Customize Your Assistant
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bot Name */}
              <div>
                <label className={`${theme.textSecondary} text-sm font-medium block mb-2`}>
                  Assistant Name
                </label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg ${theme.card} ${theme.text} border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm`}
                  placeholder="Enter bot name..."
                />
              </div>

              {/* Primary Color Scheme */}
              <div>
                <label className={`${theme.textSecondary} text-sm font-medium block mb-2`}>
                  Primary Theme
                </label>
                <select
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg ${theme.card} ${theme.text} border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                >
                  <option value="sigler-blue">Sigler Blue (Brand)</option>
                  <option value="blue-gradient">Blue Gradient</option>
                  <option value="purple-gradient">Purple Gradient</option>
                  <option value="emerald-gradient">Emerald Gradient</option>
                  <option value="solid-slate">Solid Slate</option>
                  <option value="solid-emerald">Solid Emerald</option>
                  <option value="solid-purple">Solid Purple</option>
                  <option value="solid-red">Solid Red</option>
                  <option value="orange-gradient">Orange Gradient</option>
                  <option value="pink-gradient">Pink Gradient</option>
                  <option value="teal-gradient">Teal Gradient</option>
                </select>
              </div>

              {/* Accent Color Scheme */}
              <div>
                <label className={`${theme.textSecondary} text-sm font-medium block mb-2`}>
                  Accent Theme
                </label>
                <select
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg ${theme.card} ${theme.text} border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm`}
                >
                  <option value="pink-purple">Pink Purple</option>
                  <option value="emerald-cyan">Emerald Cyan</option>
                  <option value="yellow-orange">Yellow Orange</option>
                  <option value="violet-fuchsia">Violet Fuchsia</option>
                  <option value="blue-purple">Blue Purple</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsDark(!isDark)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${theme.card} border border-white/20 hover:bg-white/20 transition-all duration-200`}
                >
                  {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span className={`${theme.text} text-sm`}>
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </button>
              </div>
              
              <button
                onClick={() => setShowSettings(false)}
                className={`px-4 py-2 bg-gradient-to-r ${theme.primary} text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm`}
              >
                Apply Changes
              </button>
            </div>
          </div>
        )}

        {/* Messages area */}
        <div className={`flex-1 overflow-y-auto px-6 py-6 space-y-4 ${isDark ? 'bg-slate-900/50' : 'bg-white/30'} custom-scrollbar`}>
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''} animate-in slide-in-from-bottom-4 duration-500`}
              style={{animationDelay: `${i * 100}ms`}}
            >
              <div className={`flex-shrink-0 p-2 rounded-xl ${
                msg.role === 'user' 
                  ? `bg-gradient-to-r ${theme.primary} text-white shadow-lg` 
                  : `bg-gradient-to-r ${theme.accent} text-white shadow-lg`
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div className={`flex-1 ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm border ${
                  msg.role === 'user'
                    ? `bg-gradient-to-r ${theme.primary} text-white border-white/20 rounded-tr-md`
                    : `${theme.card} ${theme.text} border-white/20 rounded-tl-md`
                } hover:shadow-xl transition-all duration-200`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <div className={`text-xs mt-2 opacity-60 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    {msg.timestamp?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-3 animate-in slide-in-from-bottom-4 duration-300">
              <div className={`flex-shrink-0 p-2 rounded-xl bg-gradient-to-r ${theme.accent} text-white shadow-lg`}>
                <Bot className="w-5 h-5" />
              </div>
              <div className={`${theme.card} ${theme.textSecondary} px-4 py-3 rounded-2xl rounded-tl-md shadow-lg backdrop-blur-sm border border-white/20`}>
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className={`${theme.card} backdrop-blur-xl border-t border-white/20 px-6 py-4`}>
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                className={`w-full px-6 py-4 rounded-2xl ${theme.card} ${theme.text} placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-xl shadow-lg`}
                placeholder="Type your message here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              />
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className={`p-4 bg-gradient-to-r ${theme.primary} text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className={`flex justify-center mt-3 ${theme.textSecondary}`}>
            <p className="text-xs opacity-60">Press Enter to send • Shift+Enter for new line</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: animate-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}