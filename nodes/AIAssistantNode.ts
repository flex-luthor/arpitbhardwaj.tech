import { ElementNode, LexicalNode, ParagraphNode } from "lexical";

export class AIAssistantNode extends ElementNode {
  static getType(): string {
    return "ai-assistant-node";
  }

  static clone(node: AIAssistantNode): AIAssistantNode {
    return new AIAssistantNode(node.__key);
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("span");
    dom.className = "editor";
    return dom;
  }

  updateDOM(prevNode: AIAssistantNode, dom: HTMLElement): boolean {
    return true;
  }
}

export function $createAIAssitantNode(): AIAssistantNode {
  return new AIAssistantNode();
}

export function $isAIAssitantNode(node: LexicalNode | null): boolean {
  return node instanceof AIAssistantNode;
}
