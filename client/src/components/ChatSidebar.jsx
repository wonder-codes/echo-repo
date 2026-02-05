import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Bot, User, Loader2, Sparkles, Code2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const ChatSidebar = ({ code, isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || !code) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/chat', {
                message: input,
                code: code,
                history: messages
            });

            setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please check your API configuration.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => setMessages([]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-screen w-full max-w-md bg-[#0c0c0c] border-l border-white/5 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Sidebar Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                    <Bot className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                        Code Analyst
                                        <div className="flex gap-1">
                                            <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                                        </div>
                                    </h3>
                                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Semantic logic analyzer</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={clearChat}
                                    className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
                                    <X className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                            {messages.length === 0 && (
                                <div className="text-center py-20 px-8 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-blue-500/5 rounded-full flex items-center justify-center mb-6">
                                        <Sparkles className="w-10 h-10 text-blue-500/30" />
                                    </div>
                                    <h4 className="text-zinc-200 font-bold mb-2">How can I help you today?</h4>
                                    <p className="text-zinc-500 text-sm mb-8">Ask questions specifically about the logic, structure, or setup of the code you provided.</p>

                                    <div className="grid grid-cols-1 gap-2 w-full">
                                        {[
                                            "Explain the main function",
                                            "Analyze time complexity",
                                            "How do I install this?",
                                            "Are there any security risks?"
                                        ].map((suggestion, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { setInput(suggestion); }}
                                                className="text-xs text-zinc-400 bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 hover:text-white transition-all text-left flex items-center justify-between group"
                                            >
                                                {suggestion}
                                                <Code2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <AnimatePresence initial={false}>
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        key={idx}
                                        className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="w-8 h-8 rounded-lg bg-blue-900/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Bot className="w-5 h-5 text-blue-400" />
                                            </div>
                                        )}
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 max-w-[85%]'
                                                : 'bg-[#1a1a1a] border border-white/5 text-zinc-300 max-w-[85%]'
                                            }`}>
                                            {msg.content}
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                                                <User className="w-5 h-5 text-zinc-400" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isLoading && (
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-900/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
                                        <Bot className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-[#1a1a1a] border border-white/5 text-zinc-500 text-sm flex items-center gap-3">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="font-mono text-[10px] uppercase tracking-widest">Processing request...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask the Analyst anything..."
                                    className="w-full bg-[#111111] border border-white/5 rounded-2xl py-4 pl-5 pr-14 text-sm text-zinc-200 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:bg-zinc-800 disabled:shadow-none transition-all active:scale-95"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-[10px] text-zinc-600 mt-4 text-center uppercase tracking-widest font-bold">
                                Powered by EchoRepo Intelligence
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ChatSidebar;
