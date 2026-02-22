'use client';

import { remarkStripCodeFences } from '@/lib/remark-strip-code-fences';
import { PostDetail } from '@/types/api';
import {
    Check,
    ChevronRight,
    Copy,
    File,
    List,
    Terminal as TerminalIcon,
    X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ViewMode = 'balanced' | 'code';

interface DevPostProps {
    post: PostDetail;
}

interface FileContent {
    id: string;
    name: string;
    language: string;
    content: string;
}

interface TourStep {
    id: string;
    title: string;
    targetId: string; // file id (包含 setup.sh 等 shell script)
    focusLines?: [number, number]; // [start, end]
    content: string;
}

export function DevPost({ post }: DevPostProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('balanced');
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [activeFile, setActiveFile] = useState<FileContent | null>(null);
    const [copied, setCopied] = useState(false);
    const [isTocOpen, setIsTocOpen] = useState(false);

    // Parse files from markdown content
    const files = useMemo(() => {
        const parsedFiles: FileContent[] = [];
        const markdown = post.content ?? '';
        const regex = /<<<\s*([\w\.-]+)\s*>>>([\s\S]*?)<<<\/>>>/g;

        let match;
        while ((match = regex.exec(markdown)) !== null) {
            const [, name, rawContent] = match;

            // Extract content from code block if present
            let content: string;
            const codeBlockMatch = rawContent.match(/```(?:\w+)?\s([\s\S]*?)```/);
            if (codeBlockMatch) {
                content = codeBlockMatch[1].trim();
            } else {
                content = rawContent.trim();
                // 移除開頭/結尾的 ``` 或 \`\`\` fence（當 regex 未匹配時）
                // 支援 ``` 或 \`\`\` 兩種 fence 格式
                const fenceStart = /^(`{3}|(\\`){3})\w*\s*/;
                const fenceEnd = /\s*(`{3}|(\\`){3})\s*$/;
                content = content.replace(fenceStart, '').replace(fenceEnd, '');
            }

            const id = name.replace('.', '-');
            const language = name.split('.').pop() || 'text';

            parsedFiles.push({
                id,
                name,
                language,
                content,
            });
        }
        return parsedFiles;
    }, [post.content]);

    // Parse markdown content into steps
    const steps = useMemo(() => {
        const parsedSteps: TourStep[] = [];
        const markdown = post.content ?? '';
        const regex = /\[\[\[\s*([\w\.-]+),\s*(\d+)-(\d+)\s*\]\]\]([\s\S]*?)\[\[\[\/\]\]\]/g;

        let match;
        while ((match = regex.exec(markdown)) !== null) {
            const [, filename, startLine, endLine, content] = match;

            const targetId = filename.replace('.', '-');
            const focusLines: [number, number] = [parseInt(startLine), parseInt(endLine)];
            const id = `step-${parsedSteps.length + 1}`; // Generate ID

            // Extract title from first header
            const titleMatch = content.match(/^###\s+(.*)$/m);
            const title = titleMatch ? titleMatch[1] : id;

            parsedSteps.push({
                id,
                title,
                targetId,
                focusLines,
                content: content.trim()
            });
        }

        return parsedSteps;
    }, [post.content]);

    // 同步右側面板到目前的步驟（依 targetId 對應檔案）
    const syncRightPanel = (index: number) => {
        const step = steps[index];
        if (!step) return;

        const file = files.find(f => f.id === step.targetId);
        if (file) setActiveFile(file);
    };

    // 跳轉至內文特定區段，並同步右側（僅在 client 點擊時執行，可安全使用 document）
    const jumpToArticleSection = (index: number) => {
        const container = document.getElementById('article-container');
        const targetSection = document.getElementById(`section-${index}`);

        if (container && targetSection) {
            setActiveStepIndex(index);
            syncRightPanel(index);

            // 計算目標區段相對於滾動容器頂部的距離
            const targetOffset = targetSection.offsetTop - 80;

            container.scrollTo({
                top: targetOffset,
                behavior: 'smooth'
            });
        }
    };

    // 當點擊右側程式碼標籤時，同步跳轉到第一個引用該檔案的內文步驟
    const onCodeTabClick = (fileId: string) => {
        const file = files.find(f => f.id === fileId);
        if (file) {
            setActiveFile(file);
            const firstStepIdx = steps.findIndex(s => s.targetId === fileId);
            if (firstStepIdx !== -1) jumpToArticleSection(firstStepIdx);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const widths = viewMode === 'code' ? { left: 'w-[35%]', right: 'w-[65%]' } : { left: 'w-[50%]', right: 'w-[50%]' };

    return (
        <div className="flex flex-col h-screen w-full bg-[#ffffff] text-[#333333] overflow-hidden">
            {/* Navbar */}
            <nav className="h-16 border-b border-[#eeeeee] flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-[100] shrink-0">
                <div className="flex items-center bg-[#f5f5f5] rounded-full p-1 border border-[#e0e0e0]">
                    {(['balanced', 'code'] as ViewMode[]).map((m) => (
                        <button key={m} onClick={() => setViewMode(m)} className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${viewMode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            <span className="capitalize">{m === 'balanced' ? 'Balanced' : 'Code-First'}</span>
                        </button>
                    ))}
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Article Section */}
                <section
                    id="article-container"
                    className={`${widths.left} h-full overflow-y-auto bg-white flex flex-col scroll-smooth transition-all duration-500 border-r border-[#f0f0f0]`}
                >
                    <div className="max-w-3xl mx-auto w-full px-12 py-16">
                        <div className="mb-14">
                            {post.series && (
                                <span className="inline-block px-3 py-1 rounded-[16px] text-[11px] font-medium tracking-tight mb-5 bg-[#9ea2a5] text-white">
                                    {post.series}
                                </span>
                            )}
                            <h1 className="text-[34px] font-bold text-[#1a1a1a] mb-8 tracking-tight leading-[1.3]">
                                0{activeStepIndex + 1} {post.title}
                            </h1>

                            <div className="flex items-center justify-between text-[12px] text-[#aaaaaa] pb-4 border-b border-[#eeeeee]">
                                <div className="flex gap-4 items-center">
                                    <span>最後更新：{new Date(post.updated_at).toLocaleDateString('zh-TW')}</span>
                                </div>
                                <div className="flex gap-2">
                                    {post.tags?.map((tag) => (
                                        <span key={tag.id} className="px-3 py-0.5 rounded-full border border-[#d0d0d0] bg-white text-[#999] text-[10px]">{tag.name}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <article className="space-y-16">
                            {steps.map((step, idx) => (
                                <div
                                    key={step.id}
                                    id={`section-${idx}`}
                                    onClick={() => jumpToArticleSection(idx)}
                                    className={`transition-all duration-700 cursor-pointer ${activeStepIndex === idx ? 'opacity-100' : 'opacity-20 hover:opacity-40'}`}
                                >
                                    <div className="text-[17px] leading-[2.1] text-[#333] space-y-8 markdown-body">
                                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkStripCodeFences]}>{step.content}</ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                        </article>

                        <footer className="mt-40 pt-10 border-t border-[#f0f0f0] text-center text-[10px] font-bold tracking-[0.3em] uppercase text-[#ccc]">
                            Dev Flow · Pure Technology Reading
                        </footer>
                    </div>
                </section>

                {/* Code Section */}
                <section className={`${widths.right} h-full bg-[#fafafa] flex flex-col relative transition-all duration-500`}>
                    <div className="h-10 border-b border-[#eeeeee] flex items-center px-4 bg-white shrink-0 justify-between">
                        <div className="flex items-center h-full">
                            {files.map(file => (
                                <button
                                    key={file.id}
                                    onClick={() => onCodeTabClick(file.id)}
                                    className={`flex items-center gap-2 px-4 h-10 text-[11px] font-medium border-b-2 transition-all whitespace-nowrap ${activeFile?.id === file.id ? 'text-blue-600 border-blue-600 bg-white' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                                >
                                    {file.name === 'setup.sh' ? <TerminalIcon size={12} /> : <File size={12} />} {file.name}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => copyToClipboard(activeFile ? activeFile.content : "")}
                            className="text-gray-400 hover:text-blue-600 p-2 transition-colors"
                        >
                            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto bg-white p-6 font-mono text-[13px] leading-[1.8]">
                        <pre className="select-all">
                            {(activeFile ? activeFile.content : '').split('\n').map((line, i) => {
                                const lineNum = i + 1;

                                // 找出這行程式碼屬於哪一個步驟
                                const associatedStepIndex = steps.findIndex(s =>
                                    activeFile && s.targetId === activeFile.id && s.focusLines && lineNum >= s.focusLines[0] && lineNum <= s.focusLines[1]
                                );

                                const isHighlighted = associatedStepIndex !== -1;
                                const isActiveHighlight = associatedStepIndex === activeStepIndex;

                                return (
                                    <div
                                        key={i}
                                        onClick={() => isHighlighted && jumpToArticleSection(associatedStepIndex)}
                                        className={`flex transition-all duration-300 ${isHighlighted ? 'cursor-pointer hover:bg-blue-50/40' : 'opacity-25'} ${isActiveHighlight ? 'bg-blue-50/80 text-blue-700 font-bold -mx-6 px-6' : ''}`}
                                    >
                                        <span className={`w-10 shrink-0 text-[10px] select-none ${isActiveHighlight ? 'text-blue-400' : 'text-gray-300'}`}>{lineNum}</span>
                                        <span className="flex-1">{line || ' '}</span>
                                    </div>
                                );
                            })}
                        </pre>
                    </div>
                </section>
            </div>

            {!isTocOpen && (
                <button
                    onClick={() => setIsTocOpen(true)}
                    className="fixed right-6 top-[120px] z-[90] flex items-center gap-2 px-4 py-2 rounded-full border border-[#eeeeee] bg-white shadow-lg hover:shadow-xl transition-all text-[#333]"
                >
                    <List size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">目錄</span>
                </button>
            )}

            <div className="fixed right-0 top-[120px] z-[100] flex items-start pointer-events-none">
                {isTocOpen && (
                    <div
                        className="w-72 max-h-[80vh] bg-[#161b22]/95 backdrop-blur-md border border-[#30363d] rounded-l-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 pointer-events-auto"
                    >
                        <div className="p-4 border-b border-[#30363d] flex items-center justify-between bg-[#1c2128]/50">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <List size={12} /> Table of Contents
                            </span>
                            <button onClick={() => setIsTocOpen(false)} className="text-gray-500 hover:text-white p-1 rounded hover:bg-[#30363d] transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {steps.map((step, idx) => (
                                <button
                                    key={step.id}
                                    onClick={() => jumpToArticleSection(idx)}
                                    className={`w-full text-left p-3 rounded-lg text-xs transition-all flex items-start gap-3 group mb-1 last:mb-0 ${activeStepIndex === idx
                                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                        : 'text-gray-400 hover:bg-[#30363d] hover:text-gray-200 border border-transparent'
                                        }`}
                                >
                                    <span className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${activeStepIndex === idx ? 'bg-blue-500 text-white' : 'bg-[#0d1117] text-gray-600 group-hover:text-gray-400'
                                        }`}>
                                        {idx + 1}
                                    </span>
                                    <div className="flex-1 truncate">
                                        <div className="font-bold truncate">{step.title}</div>
                                        <div className="text-[10px] opacity-60 mt-0.5 truncate uppercase tracking-tighter">
                                            {files.find(f => f.id === step.targetId)?.name ?? step.targetId}
                                        </div>
                                    </div>
                                    {activeStepIndex === idx && <ChevronRight size={14} className="mt-1" />}
                                </button>
                            ))}
                        </div>
                        <div className="p-3 bg-[#0d1117]/50 text-[10px] text-gray-600 text-center border-t border-[#30363d]">
                            點選步驟快速導覽
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};