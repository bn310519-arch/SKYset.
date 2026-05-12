import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Sparkles, Minus, Maximize2, Phone, MessageCircle, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTravelAdvice } from '../lib/gemini';
import { useStore } from '../lib/store';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDirectSupport, setShowDirectSupport] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Welcome to Skyset. I am your personal AI guide. How may I assist your travels today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { trips, searchHistory } = useStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const context = {
        lastTrips: trips.slice(-2).map(t => t.destination),
        recentSearches: searchHistory
    };

    const response = await getTravelAdvice(userMessage, context);
    setMessages(prev => [...prev, { role: 'assistant', content: response || "I apologize, I'm momentarily offline. Please try again." }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="glass-panel w-[320px] sm:w-[400px] h-[550px] sm:h-[600px] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-black/10 bg-white"
          >
            {/* Header */}
            <div className="p-6 border-b border-black/5 flex flex-col gap-4 bg-luxury-gold/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-luxury-gold/20 rounded-xl">
                            <Sparkles className="w-5 h-5 text-luxury-gold" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm tracking-tight text-black">Skyset AI Guide</h3>
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] text-black/40 uppercase tracking-widest font-bold">Live Support</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button onClick={() => setShowDirectSupport(!showDirectSupport)} className={`p-2 rounded-full transition-all ${showDirectSupport ? 'bg-luxury-gold text-white' : 'hover:bg-black/5 text-black/40 underline text-[9px] font-bold uppercase tracking-widest'}`}>
                            {showDirectSupport ? <X className="w-4 h-4" /> : 'Direct Help'}
                        </button>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/5 rounded-full text-black/40 group"><X className="w-4 h-4 group-hover:text-black" /></button>
                    </div>
                </div>

                {showDirectSupport && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="space-y-2 pb-2"
                    >
                        <p className="text-[9px] font-bold uppercase tracking-widest text-black/40 mb-3 text-center italic">Connect with an agent directly</p>
                        <div className="grid grid-cols-2 gap-2">
                            <a href="https://wa.me/918792653387" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-sm">
                                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                            </a>
                            <a href="tel:8792653387" className="flex items-center justify-center gap-2 py-3 bg-black text-white rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:bg-luxury-gold transition-all shadow-sm">
                                <Phone className="w-3.5 h-3.5" /> Call Now
                            </a>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                            m.role === 'user' 
                                ? 'bg-black text-white font-medium shadow-md' 
                                : 'bg-black/5 border border-black/5 text-black/80 font-light'
                        }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-black/5 border border-black/5 p-4 rounded-2xl flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-black/20 animate-bounce" />
                            <span className="w-1.5 h-1.5 rounded-full bg-black/20 animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-black/20 animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 bg-black/5 border-t border-black/5">
                <div className="bg-white rounded-2xl p-2 flex items-center gap-2 border border-black/10 focus-within:border-luxury-gold transition-all shadow-sm">
                    <input 
                        type="text" 
                        placeholder="Message Skyset AI..." 
                        className="bg-transparent flex-grow px-4 outline-none text-sm text-black placeholder:text-black/30"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <button 
                        type="submit"
                        className="p-3 bg-black text-white rounded-xl hover:bg-luxury-gold transition-colors shadow-inner"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <AnimatePresence>
            {!isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-2"
                >
                    <a 
                        href="https://wa.me/918792653387" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-4 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95"
                    >
                        <MessageCircle className="w-6 h-6" />
                    </a>
                    <a 
                        href="tel:8792653387" 
                        className="p-4 bg-black text-white rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95"
                    >
                        <Phone className="w-6 h-6" />
                    </a>
                </motion.div>
            )}
        </AnimatePresence>
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`p-5 rounded-full shadow-2xl transition-all duration-500 hover:rotate-12 ${isOpen ? 'bg-luxury-gold rotate-90 scale-90' : 'bg-black text-white hover:bg-luxury-gold'}`}
        >
            {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
        </button>
      </div>
    </div>
  );
}

