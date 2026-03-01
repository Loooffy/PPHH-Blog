'use client';

import { Tag as TagComponent } from '@/components/atomic/Tag';
import { PostNav, type PostNavItem } from '@/components/layout/PostNav';
import Link from 'next/link';
import { remarkStripCodeFences } from '@/lib/remark-strip-code-fences';
import type { PostDetail } from '@/types/api';
import {
    ChevronRight,
    File,
    List,
    Terminal as TerminalIcon,
    X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ViewMode = 'balanced' | 'code' | 'article';

interface DevPostProps {
    post: PostDetail;
    prevPost?: PostNavItem | null;
    nextPost?: PostNavItem | null;
    seriesId?: number | null;
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

export function DevPost({ post, prevPost, nextPost, seriesId }: DevPostProps) {
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

    const [viewMode, setViewMode] = useState<ViewMode>(() =>
        files.length === 0 ? 'article' : 'balanced'
    );

    useEffect(() => {
        if (files.length === 0 && viewMode !== 'article') {
            setViewMode('article');
        }
    }, [files.length, viewMode]);

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

    // Article 模式用的內容：移除 <<<filename>>> 與 [[[steps]]] 區塊標記，只保留一般 markdown
    const articleContent = useMemo(() => {
        let markdown = post.content ?? '';
        markdown = markdown.replace(/<<<\s*[\w\.-]+\s*>>>[\s\S]*?<<<\/>>>/g, '');
        markdown = markdown.replace(/\[\[\[\s*[\w\.-]+,\s*\d+-\d+\s*\]\]\]/g, '').replace(/\[\[\[\/\]\]\]/g, '');
        return markdown.trim();
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

    const widths = viewMode === 'article'
        ? { left: 'w-full', right: 'hidden' }
        : viewMode === 'code'
            ? { left: 'w-[35%]', right: 'w-[65%]' }
            : { left: 'w-[50%]', right: 'w-[50%]' };

    return (
        <div className="flex flex-col h-screen w-full bg-background text-text overflow-hidden">
            {/* Navbar */}
            <nav className="h-16 flex items-center justify-between px-8 bg-surface/80 backdrop-blur-md z-[100] shrink-0">
                <div className="flex items-center bg-background  p-1">
                    {(['article', 'balanced', 'code'] as ViewMode[]).map((m) => {
                        const isDisabled = files.length === 0 && m !== 'article';
                        return (
                            <button
                                key={m}
                                onClick={() => !isDisabled && setViewMode(m)}
                                disabled={isDisabled}
                                className={`px-4 py-1.5 cursor-pointer rounded-full text-[11px] font-bold transition-all ${isDisabled
                                    ? 'text-text-secondary/50 opacity-10'
                                    : viewMode === m
                                        ? 'bg-primary/15 text-primary ring-1 ring-primary/20'
                                        : 'text-text-secondary hover:text-text hover:bg-surface/50'
                                    }`}
                            >
                                <span className="capitalize">{m === 'balanced' ? 'Balanced' : m === 'code' ? 'Code-First' : 'Article'}</span>
                            </button>
                        );
                    })}
                </div>
                {!isTocOpen && viewMode !== 'article' && steps.length > 0 && (
                    <button
                        onClick={() => setIsTocOpen(true)}
                        className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface transition-all text-text'}`}
                    >
                        <List size={16} />
                        <span className="text-[11px] font-bold uppercase tracking-widest">目錄</span>
                    </button>
                )}
            </nav>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Article Section */}
                <section
                    id="article-container"
                    className={`${widths.left} h-full overflow-y-auto bg-surface flex flex-col scroll-smooth transition-all duration-500 border-r border-border dev-post-scrollbar`}
                >
                    <div className="max-w-3xl mx-auto w-full px-12 py-16">
                        <div className="mb-14">
                            {post.series && (
                                <div className="flex items-center gap-3 mb-5">
                                    {seriesId != null ? (
                                        <Link
                                            href={`/dev?type=DevPost&series_id=${seriesId}`}
                                            className="text-text text-[14px] font-medium underline underline-offset-2 decoration-text hover:text-primary transition-colors"
                                        >
                                            「{post.series}」系列
                                        </Link>
                                    ) : (
                                        <span className="text-text text-[14px] font-medium underline underline-offset-2 decoration-text">
                                            「{post.series}」系列
                                        </span>
                                    )}
                                    {post.series_number != null && (
                                        <span className="inline-block px-3 py-1 rounded-[16px] text-[11px] font-medium tracking-tight bg-border/30 text-text-secondary">
                                            第 {post.series_number} 篇
                                        </span>
                                    )}
                                </div>
                            )}
                            <h1 className="text-[34px] font-bold text-text mb-8 tracking-tight leading-[1.3]">
                                {viewMode === 'article' ? post.title : `0${activeStepIndex + 1} ${post.title}`}
                            </h1>

                            <div className="flex items-center justify-between text-[12px] text-text-secondary pb-4 border-b border-border">
                                <div className="flex gap-4 items-center">
                                    <span>最後更新：{new Date(post.updated_at).toLocaleDateString('zh-TW')}</span>
                                </div>
                                <div className="flex gap-2">
                                    {post.tags?.map((tag) => (
                                        <TagComponent key={tag.id} href={`/dev?type=DevPost&tag_id=${tag.id}`}>
                                            {tag.name}
                                        </TagComponent>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <article className="space-y-16">
                            {viewMode === 'article' ? (
                                <div className="text-[17px] leading-[2.1] text-text space-y-8 markdown-body">
                                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkStripCodeFences]}>{articleContent}</ReactMarkdown>
                                </div>
                            ) : (
                                steps.map((step, idx) => (
                                    <div
                                        key={step.id}
                                        id={`section-${idx}`}
                                        onClick={() => jumpToArticleSection(idx)}
                                        className={`transition-all duration-700 cursor-pointer ${activeStepIndex === idx ? 'opacity-100' : 'opacity-20 hover:opacity-40'}`}
                                    >
                                        <div className="text-[17px] leading-[2.1] text-text space-y-8 markdown-body">
                                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkStripCodeFences]}>{step.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                ))
                            )}
                        </article>

                        <PostNav
                            prev={prevPost ?? undefined}
                            next={nextPost ?? undefined}
                            basePath="/dev"
                        />
                    </div>
                </section>

                {/* Code Section */}
                <section className={`${widths.right} h-full bg-background flex flex-col relative transition-all duration-500`}>
                    <div className="h-10 border-b border-border flex items-center px-4 bg-surface shrink-0 justify-between">
                        <div className="flex items-center h-full">
                            {files.map(file => (
                                <button
                                    key={file.id}
                                    onClick={() => onCodeTabClick(file.id)}
                                    className={`flex items-center gap-2 px-4 h-10 text-[11px] font-medium border-b-2 transition-all whitespace-nowrap ${activeFile?.id === file.id ? 'text-primary border-primary bg-primary/10' : 'text-text-secondary border-transparent hover:text-text hover:bg-surface/80 hover:text-primary/80'}`}
                                >
                                    {file.name === 'setup.sh' ? <TerminalIcon size={12} /> : <File size={12} />} {file.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto bg-surface p-6 font-mono text-[13px] leading-[1.8] dev-post-scrollbar">
                        <pre className="select-text">
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
                                        className={`flex transition-all duration-300 ${isHighlighted ? 'cursor-pointer hover:bg-primary/10' : 'opacity-25'} ${isActiveHighlight ? 'bg-primary/15 text-primary font-bold -mx-6 px-6' : ''}`}
                                    >
                                        <span className={`w-10 shrink-0 text-[10px] select-none ${isActiveHighlight ? 'text-primary' : 'text-text-secondary'}`}>{lineNum}</span>
                                        <span className="flex-1">{line || ' '}</span>
                                    </div>
                                );
                            })}
                        </pre>
                    </div>
                </section>
            </div>

            <div className="fixed right-0 top-[120px] z-[100] flex items-start">
                {isTocOpen && viewMode !== 'article' && (
                    <div
                        className="w-72 max-h-[80vh] bg-surface/95 backdrop-blur-md border border-border rounded-l-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 pointer-events-auto"
                    >
                        <div className="p-4 border-b border-border flex items-center justify-between bg-background/50">
                            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
                                <List size={12} /> Table of Contents
                            </span>
                            <button onClick={() => setIsTocOpen(false)} className="text-text-secondary hover:text-text p-1 rounded hover:bg-border transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 dev-post-toc dev-post-scrollbar">
                            {steps.map((step, idx) => (
                                <button
                                    key={step.id}
                                    onClick={() => jumpToArticleSection(idx)}
                                    className={`w-full text-left p-3 rounded-lg text-xs transition-all flex items-start gap-3 group mb-1 last:mb-0 ${activeStepIndex === idx
                                        ? 'bg-primary/20 text-primary border border-primary/30'
                                        : 'text-text-secondary hover:bg-border/50 hover:text-text border border-transparent'
                                        }`}
                                >
                                    <span className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${activeStepIndex === idx ? 'bg-primary text-surface' : 'bg-background text-text-secondary group-hover:text-text'
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
                    </div>
                )}
            </div>
        </div>
    );
};