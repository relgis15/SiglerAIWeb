import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { theme } from './theme';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const chatflowId = '60f1e766-b99e-48e2-8022-a43630b4a540';
  const flowiseURL = 'https://api.siglerai.com';

  useEffect(() => {
    setMessages([
      {
        role: 'bot',
        content: '👋 Welcome to the SiglerAI demo. How can I help you?'
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post(
        `${flowiseURL}/api/v1/prediction/${chatflowId}`,
        {
          question: input,
          chatId: 'sigler-demo-user-' + Date.now()
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const botMessage = { role: 'bot', content: res.data.text };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'bot', content: '❌ Something went wrong.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full h-full bg-transparent flex items-center justify-center p-4 font-inter">
      <div className="w-full max-w-sm h-[600px] bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-blue-600 text-white text-lg font-semibold px-4 py-3">
          Chat with SiglerAI
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50 text-sm">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-800 flex gap-1 animate-pulse">
                <span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 px-3 py-2 flex items-center gap-2 bg-white">
          <input
            className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
