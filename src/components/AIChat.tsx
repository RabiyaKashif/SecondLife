import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendIcon, Loader2Icon, XIcon } from 'lucide-react';
import type { RestyleRequest, ScoredIdea } from '../types/restyle';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  request: RestyleRequest;
  topMatches: ScoredIdea[];
  isOpen: boolean;
  onClose: () => void;
}

export function AIChat({ request, topMatches, isOpen, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: Message = {
        id: '0',
        role: 'assistant',
        content: `HI! 👋 I'm your AI styling consultant for South Asian desi wear. I serve the entire South Asian community - India, Pakistan, Bangladesh, Nepal, and beyond. I can help you transform your ${request.dominant_color} ${request.garment_type} into exactly what you envision. Ask me about fabrics, colors, cutting techniques, embroidery, silhouettes, or any custom ideas!`,
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garment_type: request.garment_type,
          dominant_color: request.dominant_color,
          fabric_type: request.fabric_type,
          original_wish: request.wish,
          user_question: input,
          topMatches: topMatches.map((r) => r.idea),
          conversationHistory: messages
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 right-4 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-96 flex-col rounded-2xl border border-lilacDeep bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:max-h-[600px] sm:rounded-3xl">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-lilacDeep px-4 py-3 sm:px-6 sm:py-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">AI Styling Advisor</h3>
              <p className="text-xs text-ink/60">Ask me anything about your restyle</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-lilac transition-colors">
              <XIcon className="h-5 w-5 text-ink" />
            </button>
          </div>

          {/* Messages */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 sm:p-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-xs ${
                    message.role === 'user'
                      ? 'bg-hotpink text-white'
                      : 'bg-lilac text-ink'
                  }`}>
                  {message.content}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start">
                <div className="bg-lilac text-ink rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t border-lilacDeep px-3 py-3 sm:px-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about fabrics, colors, cuts..."
              className="min-w-0 flex-1 rounded-full bg-lilac px-4 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-hotpink"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-hotpink text-white rounded-full p-2 hover:bg-hotpinkDark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <SendIcon className="h-5 w-5" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
