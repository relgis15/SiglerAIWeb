
import { useState } from 'react';
import axios from 'axios';
import { theme } from './theme';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatflowId = '60f1e766-b99e-48e2-8022-a43630b4a540';
  const flowiseURL = 'https://siglerai.onrender.com';

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

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
      const errMsg = { role: 'bot', content: 'Sorry, something went wrong.' };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  return (
    <div style={{ backgroundColor: theme.background }} className="min-h-screen flex flex-col items-center justify-start p-6">
      <h1 className="text-2xl font-bold mb-4" style={{ color: theme.textColor }}>
        {theme.brandName} Chat Demo
      </h1>
      <div className="w-full max-w-md bg-white rounded shadow p-4 mb-4 h-96 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span
              className="inline-block px-3 py-2 rounded-lg"
              style={{
                backgroundColor: msg.role === 'user' ? theme.userBubble : theme.botBubble,
                color: msg.role === 'user' ? '#fff' : theme.textColor
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full max-w-md flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="px-4 py-2 rounded"
          style={{ backgroundColor: theme.primaryColor, color: '#fff' }}
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
