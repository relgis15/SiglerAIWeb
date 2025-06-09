import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Welcome to the SiglerAI demo. How can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const chatflowId = '60f1e766-b99e-48e2-8022-a43630b4a540';
  const flowiseURL = 'https://api.siglerai.com';

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${flowiseURL}/api/v1/prediction/${chatflowId}`,
        {
          question: input,
          chatId: 'sigler-demo-user-' + Date.now(),
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const botMessage = { role: 'bot', content: res.data.text };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errMsg = { role: 'bot', content: 'Sorry, something went wrong.' };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const container = document.getElementById('chat-scroll');
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages, loading]);

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-lg p-4 font-inter text-gray-800 flex flex-col">
      {/* Header */}
      <div className="text-blue-600 font-semibold text-lg border-b pb-2 mb-4 flex items-center">
        <img
          src="https://siglerai.com/favicon.ico"
          alt="Sigler AI"
          className="w-6 h-6 mr-2"
        />
        Sigler AI Chat
      </div>

      {/* Chat Messages */}
      <div
        id="chat-scroll"
        className="flex-1 overflow-y-auto pr-1 space-y-3 mb-4 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[80%] text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing dots animation */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm max-w-[80%] flex space-x-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="flex items-center gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

