import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { theme } from './theme';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatflowId = '60f1e766-b99e-48e2-8022-a43630b4a540';
  const flowiseURL = 'https://api.siglerai.com';
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Add welcome message on first load
    setMessages([{ role: 'bot', content: '👋 Welcome to the SiglerAI demo. How can I help you?' }]);
  }, []);

  useEffect(() => {
    // Auto scroll to bottom
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
      setMessages((prev) => [...prev, { role: 'bot', content: '❌ Sorry, something went wrong.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-4 font-inter">
      <div className="text-blue-600 font-bold text-xl mb-2">Sigler AI Chat Demo</div>

      <div className="w-full max-w-md bg-gray-50 rounded-lg shadow-md p-4 mb-4 h-96 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[80%] text-sm whitespace-pre-wrap ${
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
          <div className="mb-2 flex justify-start">
            <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm flex gap-1 animate-pulse">
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full max-w-md flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}


