
import { useState } from 'react';
import axios from 'axios';

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
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Sigler AI Chat Demo</h1>
      <div className="w-full max-w-md bg-white rounded shadow p-4 mb-4 h-96 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
