import type { Element, Root, Text } from 'hast';
import { visit } from 'unist-util-visit';

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

/** 匹配標題開頭的階層數字：4、4.1、4.1.1 等 */
const NUMBER_PATTERN = /^(\d+(?:\.\d+)*)\s*(.*)$/s;

/**
 * Rehype plugin: 擷取標題開頭的數字，顯示為 badge，並從標題文字中移除該數字
 */
export function rehypeHeadingNumberBadge() {
    return (tree: Root) => {
        visit(tree, 'element', (node: Element) => {
            if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) return;

            const fullText = extractText(node);
            const match = fullText.match(NUMBER_PATTERN);
            if (!match) return;

            const [, number, rest] = match;
            const restTrimmed = rest.trim();

            const badgeClass =
                node.tagName === 'h1' ? 'numbered-heading-badge numbered-heading-badge-h1'
                : node.tagName === 'h2' ? 'numbered-heading-badge numbered-heading-badge-h2'
                : 'numbered-heading-badge numbered-heading-badge-h3';

            const badge: Element = {
                type: 'element',
                tagName: 'span',
                properties: { className: badgeClass },
                children: [{ type: 'text', value: number } as Text],
            };

            const restNode: Text = restTrimmed
                ? { type: 'text', value: ' ' + restTrimmed }
                : { type: 'text', value: '' };

            node.children = [badge, restNode];
        });
    };
}
