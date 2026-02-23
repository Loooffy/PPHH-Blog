import { remarkStripCodeFences } from '@/lib/remark-strip-code-fences';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  return (
    <div
      className={`leading-relaxed break-words text-text 
        [&>*]:box-border [&>*:not(p)]:m-0 [&>*]:p-0 
        [&>h1]:text-2xl [&_h1]:font-bold [&>h1]:leading-relaxed [&>h1]:my-8
        [&>h2]:text-xl [&_h2]:font-bold [&>h2]:leading-relaxed [&>h2]:my-5
        [&>h3]:text-lg [&_h3]:font-bold [&>h3]:leading-relaxed [&>h3]:my-4
        [&>p]:my-4 text-medium [&>div]:mb-4 
        [&>p:last-child]:mb-0 [&>div:last-child]:mb-0 
        [&>blockquote]:ml-3 [&>blockquote]:pl-6 [&>blockquote]:text-text-secondary [&>blockquote]:border-l-[0.3em] [&>blockquote]:border-l-border [&>blockquote]:border-solid
        [&>ul]:my-4 [&>ul]:pl-8 [&>ul]:list-disc [&>ul]:[list-style-position:outside]
        [&>ol]:my-4 [&>ol]:pl-8 [&>ol]:list-decimal [&>ol]:[list-style-position:outside]
        [&>li]:my-2 [&>li]:[display:list-item]
        [&>strong]:font-bold [&>b]:font-bold 
        [&>em]:italic [&>i]:italic 
        [&>a]:text-primary [&>a]:underline [&>a:hover]:text-secondary 
        [&>code]:font-mono [&>code]:text-sm [&>code]:bg-background [&>code]:my-4 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:border [&>code]:border-border 
        [&>pre]:block [&>pre]:w-full [&>pre]:font-mono [&>pre]:text-sm [&>pre]:p-4 [&>pre]:my-6 [&>pre]:bg-background [&>pre]:border [&>pre]:border-border [&>pre]:rounded-lg [&>pre]:overflow-x-auto 
        [&>pre_code]:p-0 [&>pre_code]:bg-transparent [&>pre_code]:border-0
        [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg 
        [&_table]:border-collapse [&_table]:w-full [&_table]:my-4
        [&_th]:border [&_th]:border-border [&_th]:px-4 [&_th]:py-2 [&_th]:bg-background
        [&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-2
        ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkStripCodeFences]}>{content || ''}</ReactMarkdown>
    </div>
  );
}
