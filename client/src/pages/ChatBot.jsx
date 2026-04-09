import React, { useEffect, useRef, useState } from 'react';
import { Send, MessageCircle, RefreshCcw } from 'lucide-react';
import api from '../utils/api';

const initialMessages = [
  {
    id: 'intro',
    role: 'assistant',
    content: 'Hi there! I am EduVerse Chat. Ask me about assignments, attendance, grades, or how to use the platform.'
  }
];

const ChatBot = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (event) => {
    event.preventDefault();
    const messageText = input.trim();
    if (!messageText) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const { data } = await api.post('/chat', {
        message: messageText
      });

      const botMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I am sorry, I could not generate a response right now.'
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Unable to reach the chat service. Please try again in a moment.'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setMessages(initialMessages);
    setInput('');
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        <div className="glass-card border border-white/10 bg-white/80 dark:bg-slate-900/80 p-6 rounded-[32px] shadow-xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-600">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">EduVerse Chat</h1>
                <p className="text-sm text-slate-500">Ask the assistant about your learning path, assignments, attendance, or school tools.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <RefreshCcw className="w-4 h-4" />
              New Conversation
            </button>
          </div>

          <div className="flex h-[62vh] flex-col overflow-hidden rounded-[28px] border border-slate-200/10 bg-slate-950/95">
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-3xl p-4 text-sm leading-6 ${
                      message.role === 'user'
                        ? 'bg-sky-500 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="border-t border-slate-200/10 bg-slate-950/90 p-4">
              <div className="flex gap-3">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-full border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
                <button
                  type="submit"
                  disabled={isSending || input.trim().length === 0}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary-600 px-5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : <Send className="w-5 h-5" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
