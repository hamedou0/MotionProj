'use client';
import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'bot';
  text: string;
};

export default function ChatBotUI({ productId }: { productId?: number }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! I can help you find products, check availability, or answer questions about exports. What do you need?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, productId }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, I ran into an issue. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 text-2xl transition"
        aria-label="Toggle chatbot"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col z-50 overflow-hidden">

          {/* Header */}
          <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Motion Assistant</p>
              <p className="text-xs text-gray-400">Ask me anything</p>
            </div>
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-400 italic">Typing...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask a question..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
