import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText } from 'lucide-react';

const MarkdownPreview = ({ content }) => {
    return (
        <div className="h-full relative group">
            <div className="absolute inset-0 bg-zinc-900/50 blur-xl group-hover:bg-zinc-800/50 transition-all duration-700 -z-10 rounded-2xl"></div>
            <div className="h-full border border-white/5 rounded-xl overflow-y-auto bg-[#0a0a0a]/60 backdrop-blur-sm p-8 prose prose-invert custom-markdown">
                {content ? (
                    <ReactMarkdown>{content}</ReactMarkdown>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-4 opacity-50">
                        <FileText className="w-12 h-12 stroke-[1]" />
                        <p className="text-sm font-medium tracking-wide uppercase italic">
                            AI Documentation will manifest here
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarkdownPreview;
