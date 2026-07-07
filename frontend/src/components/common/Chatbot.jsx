import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import api from '../../services/api';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your TravelEase AI assistant. How can I help you plan your trip today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data } = await api.post('/api/ai/chat', {
        message: userMessage,
        history: messages
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const quickReplies = ['Best time to visit Goa?', 'Budget travel tips', 'Top destinations in India', 'Safety tips'];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
      >
        {isOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-4 text-white">
            <h3 className="font-semibold">TravelEase AI Assistant</h3>
            <p className="text-xs text-white/80">Ask me anything about travel!</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-primary-500 text-white rounded-br-none'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {quickReplies.map(q => (
                <button key={q} onClick={() => { setInput(q); }} className="px-2.5 py-1 text-xs rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
              />
              <button type="submit" disabled={loading} className="p-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition disabled:opacity-50">
                <FiSend size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
