import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ value, onChange, language = 'javascript' }) => {
    return (
        <div className="w-full h-full min-h-[400px] relative group bg-[#0c0c0c]">
            <Editor
                height="100%"
                width="100%"
                defaultLanguage={language}
                theme="vs-dark"
                value={value}
                onChange={onChange}
                loading={<div className="flex items-center justify-center h-full text-zinc-500 font-mono text-xs uppercase tracking-widest">Initialising Editor...</div>}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    automaticLayout: true,
                    padding: { top: 20, bottom: 20 },
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    renderLineHighlight: 'all',
                    backgroundColor: '#0c0c0c',
                    scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible',
                        useShadows: false,
                        verticalScrollbarSize: 8,
                        horizontalScrollbarSize: 8,
                    }
                }}
            />
        </div>
    );
};

export default CodeEditor;
