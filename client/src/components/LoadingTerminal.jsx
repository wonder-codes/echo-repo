import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Search, Sparkles, Wand2, ShieldCheck, FileJson } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingTerminal = () => {
    const [logs, setLogs] = useState([]);
    const [phase, setPhase] = useState(0);

    const messages = [
        { text: '> INITIALIZING DOCUMENTATION ARCHITECT...', icon: <Cpu className="w-3 h-3" /> },
        { text: '> ESTABLISHING NEURAL LINK TO GPT-4O-MINI', icon: <Sparkles className="w-3 h-3" /> },
        { text: '> SCANNING SOURCE CODE MANIFEST', icon: <Search className="w-3 h-3" /> },
        { text: '> ANALYZING COMPONENT HIERARCHY', icon: <FileJson className="w-3 h-3" /> },
        { text: '> DECONSTRUCTING LOGIC BLOCKS', icon: <Terminal className="w-3 h-3" /> },
        { text: '> SYNTHESIZING MARKDOWN SCHEMA', icon: <Wand2 className="w-3 h-3" /> },
        { text: '> VERIFYING DOCUMENTATION INTEGRITY', icon: <ShieldCheck className="w-3 h-3" /> },
        { text: '> FINALIZING DOCUMENTATION ARCHIVE', icon: <Cpu className="w-3 h-3" /> },
    ];

    useEffect(() => {
        let current = 0;
        const interval = setInterval(() => {
            if (current < messages.length) {
                setLogs(prev => [...prev, messages[current]]);
                setPhase(current);
                current++;
            } else {
                clearInterval(interval);
            }
        }, 900);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
                {/* Terminal Header */}
                <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                        <Terminal className="w-3 h-3" />
                        <span>AI Gen Shell v2.0.4</span>
                    </div>
                </div>

                {/* Terminal Body */}
                <div className="p-8 font-mono text-sm min-h-[300px] flex flex-col gap-3">
                    <AnimatePresence>
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3"
                            >
                                <span className="text-zinc-700">{i + 1}.</span>
                                <span className="text-zinc-500">{log.icon}</span>
                                <span className={`${i === phase ? 'text-blue-400 font-bold' : 'text-zinc-300'}`}>
                                    {log.text}
                                </span>
                                {i === phase && (
                                    <motion.span
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                        className="w-2 h-4 bg-blue-500 ml-1"
                                    />
                                )}
                                {i < phase && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="ml-auto"
                                    >
                                        <ShieldCheck className="w-4 h-4 text-green-500/50" />
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {logs.length === 0 && (
                        <div className="flex items-center gap-3 animate-pulse">
                            <span className="text-zinc-700">1.</span>
                            <span className="text-zinc-300 font-bold">BOOTING AI ENGINE...</span>
                            <span className="w-2 h-4 bg-blue-500 ml-1" />
                        </div>
                    )}
                </div>

                {/* Terminal Footer / Progress bar */}
                <div className="px-8 pb-8 flex flex-col gap-4">
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
                            initial={{ width: "0%" }}
                            animate={{ width: `${((phase + 1) / messages.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                        <span>Process status: {phase === messages.length - 1 ? 'Complete' : 'Working'}</span>
                        <span>{Math.round(((phase + 1) / messages.length) * 100)}%</span>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-zinc-500 text-xs font-semibold uppercase tracking-[0.3em] animate-pulse">
                Synthesizing high-integrity documentation
            </p>
        </div>
    );
};

export default LoadingTerminal;
