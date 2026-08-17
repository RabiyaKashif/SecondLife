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
        content: `Hi! I'm your AI styling consultant. I can help you understand exactly how to transform your ${request.dominant_color} ${request.garment_type} into your desired style. Ask me anything about fabrics, colors, cutting techniques, embroidery, or any custom ideas!`,
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
          className="fixed bottom-6 right-6 z-50 w-96 max-h-[600px] flex flex-col rounded-3xl border border-lilacDeep bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-lilacDeep px-6 py-4">
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
          <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>

                <div
                  className={`max-w-xs rounded-2xl px-4 py-3 text-sm leading-relaxed ${
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
            className="border-t border-lilacDeep px-4 py-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about fabrics, colors, cuts..."
              className="flex-1 bg-lilac rounded-full px-4 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-hotpink"
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
