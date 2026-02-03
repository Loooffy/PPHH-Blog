import parse from 'html-react-parser';

interface TrixContentProps {
  content: string;
  className?: string;
}

export function TrixContent({ content, className = '' }: TrixContentProps) {
  return (
    <div
      className={`leading-relaxed break-words text-text 
        [&>*]:box-border [&>*]:m-0 [&>*]:p-0 
        [&>h1]:text-2xl [&>h1]:leading-tight [&>h1]:mb-3 [&>h1]:mt-3 
        [&>h2]:text-xl [&>h2]:leading-tight [&>h2]:mb-2.5 [&>h2]:mt-2.5 
        [&>h3]:text-lg [&>h3]:leading-tight [&>h3]:mb-2 [&>h3]:mt-2 
        [&>p]:mb-4 [&>div]:mb-4 
        [&>p:last-child]:mb-0 [&>div:last-child]:mb-0 
        [&>blockquote]:ml-3 [&>blockquote]:pl-6 [&>blockquote]:text-text-secondary [&>blockquote]:border-l-[0.3em] [&>blockquote]:border-l-border [&>blockquote]:border-solid
        [&>ul]:my-4 [&>ul]:pl-8 [&>ul]:list-disc [&>ul]:[list-style-position:outside]
        [&>ol]:my-4 [&>ol]:pl-8 [&>ol]:list-decimal [&>ol]:[list-style-position:outside]
        [&>li]:my-2 [&>li]:[display:list-item]
        [&>strong]:font-bold [&>b]:font-bold 
        [&>em]:italic [&>i]:italic 
        [&>a]:text-primary [&>a]:underline [&>a:hover]:text-secondary 
        [&>code]:font-mono [&>code]:text-sm [&>code]:bg-background [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:border [&>code]:border-border 
        [&>pre]:block [&>pre]:w-full [&>pre]:font-mono [&>pre]:text-sm [&>pre]:p-4 [&>pre]:bg-background [&>pre]:border [&>pre]:border-border [&>pre]:rounded-lg [&>pre]:overflow-x-auto 
        [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg 
        ${className}`}
    >
      {parse(content || '')}
    </div>
  );
}
