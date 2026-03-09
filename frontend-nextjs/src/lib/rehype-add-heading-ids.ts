import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fff-]/g, '');
}

function extractText(node: Element): string {
    let text = '';
    for (const child of node.children) {
        if (child.type === 'text') {
            text += child.value;
        } else if (child.type === 'element') {
            text += extractText(child);
        }
    }
    return text;
}

/**
 * Rehype plugin: 為 h1-h6 標題自動加上 id 屬性，方便 TOC 錨點跳轉
 */
export function rehypeAddHeadingIds() {
    const slugCounts = new Map<string, number>();

    return (tree: Root) => {
        visit(tree, 'element', (node: Element) => {
            if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) return;
            if (node.properties?.id) return; // 已有 id 則跳過

            const text = extractText(node);
            let slug = slugify(text) || 'heading';
            const count = slugCounts.get(slug) ?? 0;
            slugCounts.set(slug, count + 1);
            if (count > 0) slug += `-${count}`;

            node.properties = node.properties || {};
            node.properties.id = slug;
        });
    };
}
