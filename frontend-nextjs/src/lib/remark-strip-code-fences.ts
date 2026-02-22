import type { Root, Code } from 'mdast';
import { visit } from 'unist-util-visit';

/**
 * 移除程式碼區塊內容中誤解析進來的 ``` 標記
 * 例如：``` 或 ```javascript 或 ``` ``` 等行不應顯示在程式碼區塊內
 */
export function remarkStripCodeFences() {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code) => {
      if (!node.value) return;
      // 移除開頭/結尾的 code fence 行：``` 或 ```lang 或 ``` ``` 等
      node.value = node.value.replace(/^\s*`{3}\w*\s*$/gm, '').replace(/^\s*`{3}\s*`{3}\s*$/gm, '').trim();
    });
  };
}
