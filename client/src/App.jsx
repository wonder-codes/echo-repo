import React, { useState, useEffect, useCallback } from 'react';
import {
    Github,
    Code,
    Download,
    Copy,
    MessageSquare,
    Zap,
    History as HistoryIcon,
    Check,
    RefreshCw,
    ExternalLink,
    X,
    ChevronRight,
    Sparkles,
    Command,
    Layout,
    Cpu,
    Keyboard,
    Maximize2,
    Columns
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import CodeEditor from './components/CodeEditor';
import MarkdownPreview from './components/MarkdownPreview';
import ChatSidebar from './components/ChatSidebar';
import LoadingTerminal from './components/LoadingTerminal';

function App() {
    const [code, setCode] = useState('// Paste your code here\nfunction hello() {\n  console.log("Hello EchoRepo");\n}');
    const [repoUrl, setRepoUrl] = useState('');
    const [readme, setReadme] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
    const [viewMode, setViewMode] = useState('split'); // 'split', 'editor', 'preview'

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/generate/history');
            setHistory(res.data);
        } catch (err) {
            console.error('History error:', err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleGenerate = useCallback(async () => {
        if ((!code.trim() && !repoUrl.trim()) || isGenerating) return;
        setIsGenerating(true);
        setReadme('');

        try {
            const response = await axios.post('http://localhost:5000/api/generate', {
                code: repoUrl ? '' : code,
                repoUrl: repoUrl
            });
            setReadme(response.data.readme);
            fetchHistory();
        } catch (error) {
            console.error('Generation error:', error);
            alert('Failed to generate README. Check console for details.');
        } finally {
            setIsGenerating(false);
        }
    }, [code, repoUrl, isGenerating]);

    const copyToClipboard = useCallback(() => {
        if (!readme) return;
        navigator.clipboard.writeText(readme);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [readme]);

    const downloadReadme = useCallback(() => {
        if (!readme) return;
        const element = document.createElement("a");
        const file = new Blob([readme], { type: 'text/markdown' });
        element.href = URL.createObjectURL(file);
        element.download = "README.md";
        document.body.appendChild(element);
        element.click();
    }, [readme]);

    // Keyboard Shortcuts Handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl + Enter to Generate
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                handleGenerate();
            }
            // Ctrl + S to Download
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                downloadReadme();
            }
            // Ctrl + C (handled by browser usually, but we can add a custom check if needed)
            // Alt + C to Chat
            if (e.altKey && e.key === 'c') {
                e.preventDefault();
                setIsChatOpen(prev => !prev);
            }
            // Ctrl + H to History
            if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                setShowHistory(prev => !prev);
            }
            // Escape to close everything
            if (e.key === 'Escape') {
                setShowHistory(false);
                setIsShortcutsOpen(false);
                setIsChatOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleGenerate, downloadReadme]);

    const toggleLayout = () => {
        const modes = ['split', 'editor', 'preview'];
        const nextIndex = (modes.indexOf(viewMode) + 1) % modes.length;
        setViewMode(modes[nextIndex]);
    };

    return (
        <div className="min-h-screen bg-[#030303] flex flex-col selection:bg-blue-500/30 font-sans text-zinc-200 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-600/5 blur-[100px] rounded-full"></div>
            </div>

            {/* Modern Header */}
            <header className="h-16 glass-dark shrink-0 sticky top-0 z-40 px-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Zap className="w-5 h-5 text-white fill-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tighter text-white flex items-center gap-2">
                                EchoRepo
                                <span className="text-[10px] uppercase font-mono bg-white/10 text-zinc-400 px-1.5 py-0.5 rounded leading-none">v1.0</span>
                            </h1>
                            <p className="text-[9px] text-zinc-500 font-medium uppercase tracking-[0.2em]">AI Documentation Assistant</p>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5 ml-4">
                        <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-white/10 text-white shadow-sm transition-all">Documentation</button>
                        <button
                            onClick={() => setShowHistory(true)}
                            className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-all"
                        >
                            Recent history
                        </button>
                    </nav>
                </div>

                <div className="flex items-center gap-3 text-xs">
                    <button
                        onClick={() => setIsShortcutsOpen(true)}
                        className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-400 hover:text-white transition-all group hover:bg-white/5"
                    >
                        <Command className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        <span>Shortcuts</span>
                    </button>

                    <div className="hidden sm:block h-5 w-[1px] bg-white/10 mx-1"></div>

                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-xl border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <Github className="w-5 h-5" />
                    </a>

                    <button
                        onClick={toggleLayout}
                        title={`Current view: ${viewMode}. Click to toggle.`}
                        className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-all shadow-lg"
                    >
                        {viewMode === 'split' ? <Columns className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden p-4 md:p-6 lg:p-8">
                <div className="h-full max-w-[1600px] mx-auto flex flex-col gap-6">

                    {/* Top Inputs Bar */}
                    <div className="flex flex-col md:flex-row items-center gap-4 shrink-0">
                        <div className="relative flex-1 group w-full">
                            <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Import from GitHub repo URL..."
                                className="w-full bg-[#121212]/80 border border-white/10 rounded-2xl py-3 pl-11 pr-10 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all backdrop-blur-md"
                                value={repoUrl}
                                onChange={(e) => setRepoUrl(e.target.value)}
                            />
                            {repoUrl && (
                                <button
                                    onClick={() => setRepoUrl('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-3 h-3 text-zinc-500" />
                                </button>
                            )}
                        </div>

                        <div className="hidden md:flex items-center gap-3 shrink-0">
                            <div className="h-[1px] w-6 bg-white/10"></div>
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic">OR</span>
                            <div className="h-[1px] w-6 bg-white/10"></div>
                        </div>

                        <button className="flex items-center gap-2 px-5 py-3 bg-blue-600/5 border border-blue-500/20 rounded-2xl text-xs font-semibold text-blue-400 shrink-0 backdrop-blur-md">
                            <Code className="w-4 h-4" />
                            <span>Local snippet mode</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse ml-0.5"></div>
                        </button>
                    </div>

                    {/* Editors Grid */}
                    <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">

                        {/* Left Zone: Editor */}
                        <div className={`flex flex-col gap-3 min-h-0 group transition-all duration-500 ${viewMode === 'editor' ? 'flex-[2]' : viewMode === 'preview' ? 'hidden' : 'flex-1'
                            }`}>
                            <div className="flex items-center justify-between px-2 shrink-0">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center">
                                        <Cpu className="w-3.5 h-3.5 text-blue-500" />
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Source Content</span>
                                </div>
                                <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-600 px-2 py-1 bg-white/5 rounded-md border border-white/5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.3)] animate-pulse"></span>
                                    READY TO SCAN
                                </div>
                            </div>

                            <div className="flex-1 relative min-h-[400px] border border-white/5 rounded-2xl overflow-hidden glass-dark bg-black/40">
                                <CodeEditor value={code} onChange={setCode} language="javascript" />

                                {/* Floating Generate Button */}
                                <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-30">
                                    <motion.button
                                        whileHover={{ scale: 1.02, translateY: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className="pointer-events-auto bg-blue-600 hover:bg-blue-500 text-white pl-6 pr-8 py-3.5 rounded-full font-bold flex items-center gap-3 shadow-2xl shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden border border-white/10"
                                    >
                                        {isGenerating ? (
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <div className="relative">
                                                <Sparkles className="w-5 h-5 group-hover:animate-bounce" />
                                                <div className="absolute inset-0 blur-sm bg-blue-400/50 -z-10 animate-pulse"></div>
                                            </div>
                                        )}
                                        <span className="tracking-tight text-sm uppercase">{isGenerating ? 'Synthesizing...' : 'Generate README'}</span>
                                        <ChevronRight className="w-4 h-4 opacity-50 transition-transform group-hover:translate-x-1" />
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Right Zone: Preview */}
                        <div className={`flex flex-col gap-3 min-h-0 transition-all duration-500 ${viewMode === 'preview' ? 'flex-[2]' : viewMode === 'editor' ? 'hidden' : 'flex-1'
                            }`}>
                            <div className="flex items-center justify-between px-2 shrink-0 h-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center">
                                        <Layout className="w-3.5 h-3.5 text-zinc-500" />
                                    </div>
                                    <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        Live Preview
                                    </h2>
                                </div>

                                {readme && (
                                    <div className="flex items-center gap-2 animate-in fade-in duration-500">
                                        <button
                                            onClick={copyToClipboard}
                                            className="p-1.5 hover:bg-white/10 rounded-lg transition-all flex items-center gap-2 text-[10px] font-semibold text-zinc-400 hover:text-white"
                                            title="Copy Markdown"
                                        >
                                            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                        </button>
                                        <button
                                            onClick={downloadReadme}
                                            className="px-3 py-1 bg-white text-black hover:bg-zinc-200 rounded-lg transition-all flex items-center gap-1.5 text-[10px] font-bold shadow-lg"
                                        >
                                            <Download className="w-3 h-3" />
                                            Export .md
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 overflow-hidden relative border border-white/5 rounded-2xl glass-dark bg-black/40">
                                <AnimatePresence mode="wait">
                                    {isGenerating ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="h-full"
                                        >
                                            <LoadingTerminal />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="preview"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="h-full"
                                        >
                                            <MarkdownPreview content={readme} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Status Bar */}
            <footer className="h-10 shrink-0 border-t border-white/5 bg-[#050505]/80 backdrop-blur-md px-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse"></div>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-zinc-500">Core Engine Online</span>
                    </div>
                    <div className="h-3 w-[1px] bg-white/10"></div>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase">AI: GPT-4O-MINI</span>
                </div>

                <div className="flex items-center gap-4 text-zinc-600 font-mono text-[9px]">
                    <span className="hidden sm:inline">UTF-8</span>
                    <span className="hidden sm:inline text-blue-500/50">DOCUMENTATION MODE</span>
                    <span className="text-zinc-500 uppercase">Interactive Analysis Enabled</span>
                </div>
            </footer>

            {/* Overlay Components */}
            {readme && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1, rotate: 5, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-14 left-8 w-14 h-14 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-500/40 flex items-center justify-center group z-30 transition-shadow"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-50 transition-opacity group-hover:opacity-100"></div>
                    <MessageSquare className="w-7 h-7 text-white relative z-10" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#030303] animate-pulse"></div>
                </motion.button>
            )}

            {/* Chat Sidebar */}
            <ChatSidebar
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                code={repoUrl ? "Content from GitHub: " + repoUrl : code}
            />

            {/* History Sidebar */}
            <AnimatePresence>
                {showHistory && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowHistory(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
                        />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#0a0a0a] border-l border-white/10 shadow-3xl z-[70] flex flex-col"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                        <HistoryIcon className="w-5 h-5 text-zinc-500" />
                                        Archive
                                    </h2>
                                </div>
                                <button onClick={() => setShowHistory(false)} className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
                                    <X className="w-5 h-5 text-zinc-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {history.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 opacity-20 italic text-sm text-zinc-600">
                                        <HistoryIcon className="w-12 h-12 mb-4" />
                                        Nothing archived yet
                                    </div>
                                ) : (
                                    history.map((item) => (
                                        <div
                                            key={item._id}
                                            className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/30 hover:bg-white/[0.04] transition-all cursor-pointer group"
                                            onClick={() => { setReadme(item.content); setCode(item.code || ''); setRepoUrl(item.repoUrl || ''); setShowHistory(false); }}
                                        >
                                            <h3 className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors line-clamp-1">{item.title}</h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] text-zinc-500 uppercase font-mono">{new Date(item.createdAt).toLocaleDateString()}</span>
                                                <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
                                                <span className="text-[9px] text-zinc-600 uppercase tracking-tighter truncate">{item.repoUrl || 'Code Snippet'}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Shortcuts Modal */}
            <AnimatePresence>
                {isShortcutsOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsShortcutsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0c0c0c] border border-white/10 rounded-3xl p-8 shadow-3xl z-[110]"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                        <Keyboard className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
                                </div>
                                <button
                                    onClick={() => setIsShortcutsOpen(false)}
                                    className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { key: 'Ctrl + Enter', desc: 'Generate documentation' },
                                    { key: 'Ctrl + S', desc: 'Download README.md' },
                                    { key: 'Ctrl + H', desc: 'Toggle History Sidebar' },
                                    { key: 'Alt + C', desc: 'Toggle AI Chat' },
                                    { key: 'Esc', desc: 'Close modals & panels' },
                                ].map((s, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5">
                                        <span className="text-sm font-medium text-zinc-300">{s.desc}</span>
                                        <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded-lg border border-white/5 font-mono">
                                            {s.key}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 text-center">
                                <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                                    Master the workflow with EchoRepo
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
