import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Issue, UserProfile } from '../types';

interface ChatbotWidgetProps {
  issues: Issue[];
  profile: UserProfile | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function ChatbotWidget({ issues, profile }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Namaste! 🙏 I'm Samadhan, your civic assistant. Ask me anything about reporting issues, tracking complaints, or using this platform!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessageBadge, setHasNewMessageBadge] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom on each new message or loading status update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date(),
    };

    // Append user message and slice to keep last 20 messages max
    setMessages((prev) => {
      const updated = [...prev, userMsg];
      return updated.slice(-20);
    });

    setIsLoading(true);

    try {
      const openCount = issues.filter((i) => i.status === 'Open' || i.status === 'In Progress').length;
      const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;
      const contextString = `Total issues: ${issues.length}. Open: ${openCount}. Resolved: ${resolvedCount}. User points: ${profile?.points ?? 0}. User role: ${profile?.role ?? 'citizen'}.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          context: contextString,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API returned error');
      }

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || "I didn't receive a valid response.",
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const updated = [...prev, botMsg];
        return updated.slice(-20);
      });
    } catch (error) {
      console.error('Error in chatbot:', error);
      const errMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'bot',
        text: "Sorry, I'm having trouble connecting. Please try again!",
        timestamp: new Date(),
      };
      setMessages((prev) => {
        const updated = [...prev, errMsg];
        return updated.slice(-20);
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        id="samadhan-chatbot-toggle"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setHasNewMessageBadge(false);
          }
        }}
        className="fixed bottom-20 right-4 z-40 rounded-full bg-[#1B3A6B] hover:bg-[#152e55] active:scale-95 transition-all text-white w-14 h-14 flex items-center justify-center shadow-xl cursor-pointer"
        aria-label="Open AI Assistant Chatbot"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        
        {/* Small red pulsing dot badge */}
        {!isOpen && hasNewMessageBadge && (
          <span 
            id="samadhan-chatbot-badge"
            className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-white dark:border-slate-900"></span>
          </span>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          id="samadhan-chatbot-panel"
          ref={panelRef}
          className="fixed bottom-36 right-4 w-80 max-h-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-40 flex flex-col overflow-hidden transition-all duration-200 ease-in-out"
        >
          {/* Header */}
          <div 
            id="samadhan-chatbot-header"
            className="bg-[#1B3A6B] text-white rounded-t-2xl px-4 py-3 flex items-center justify-between"
          >
            <div className="space-y-0.5">
              <h5 className="text-sm font-black tracking-wide flex items-center gap-1.5">
                <span>🏛️</span> Samadhan Assistant
              </h5>
              <p className="text-[10px] text-slate-300 font-semibold tracking-wider uppercase">
                Powered by Gemini AI
              </p>
            </div>
            <button
              id="samadhan-chatbot-close"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-slate-200 p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div
            id="samadhan-chatbot-messages"
            className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/50 dark:bg-slate-950/40"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`text-xs p-2.5 max-w-[80%] shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#1B3A6B] text-white rounded-2xl rounded-br-sm ml-auto'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl rounded-bl-sm mr-auto'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div 
                id="samadhan-chatbot-typing"
                className="flex justify-start"
              >
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl rounded-bl-sm mr-auto p-2.5 max-w-[80%] flex items-center justify-center">
                  <div className="flex gap-1 items-center p-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            id="samadhan-chatbot-form"
            onSubmit={handleSendMessage}
            className="border-t border-slate-200 dark:border-slate-700 p-3 flex gap-2 bg-white dark:bg-slate-900"
          >
            <input
              id="samadhan-chatbot-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ask about civic issues..."
              className="flex-1 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#1B3A6B] focus:border-transparent disabled:opacity-60 transition-all"
              autoComplete="off"
            />
            <button
              id="samadhan-chatbot-submit"
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-[#FF6B35] text-white hover:bg-[#e05824] disabled:opacity-50 disabled:hover:bg-[#FF6B35] rounded-full p-2 flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
              aria-label="Send Message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
