import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ChatSupport = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const sessionId = `chat_${user?.id || user?._id}`;
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get(`/chat/${sessionId}`).then(({ data }) => setMessages(data.messages || []));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      const { data } = await api.post('/chat', { message: input, sessionId });
      setMessages([...messages, data.message]);
      setInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-4">Chat Support</h1>
        <div className="flex-1 card flex flex-col !p-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[400px]">
            {messages.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-8">Start a conversation with our support team</p>
            )}
            {messages.map((msg) => (
              <div key={msg._id} className={`flex ${msg.isFromSupport ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                  msg.isFromSupport ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'bg-primary-500 text-white'
                }`}>
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
            <input className="input-field flex-1" placeholder="Type your message..." value={input} onChange={(e) => setInput(e.target.value)} />
            <button type="submit" disabled={sending} className="btn-primary !px-4">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatSupport;
