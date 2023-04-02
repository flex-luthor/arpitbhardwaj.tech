import { $createParagraphNode, $getRoot, $getSelection } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import AIEditorNodes from "@/nodes/AIEditorNodes";
import { TRANSFORMERS } from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import AIAssistPlugin from "@/plugins/AIAssistPlugin";
import CommandsPlugin from "@/plugins/CommandsPlugin";
import HeadingPlugin from "@/plugins/HeadingPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import ToolbarPlugin from "@/plugins/ToolbarPlugin";

const theme = {
  heading: {
    h1: "text-4xl leading-loose",
    h2: "text-3xl leading-loose",
    h3: "text-2xl leading-loose",
    h4: "text-xl leading-loose",
    h5: "text-lg leading-loose",
    h6: "text-md",
  },
  paragraph: "py-1",
  list: {
    nested: {
      listitem: "ml-2",
    },
    ol: "ml-2",
    ul: "ml-2 list-disc",
    listitem: "ml-2",
  },
};

function prepopulatedRichText() {
  const root = $getRoot();
  if (root.getFirstChild() === null) {
    const paragraph = $createParagraphNode();
    root.append(paragraph);
  }
}

function onError(error: any) {
  console.error(error);
}

export default function Editor() {
  const initialConfig = {
    editorState: prepopulatedRichText,
    namespace: "AI Editor",
    nodes: [...AIEditorNodes],
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative min-h-96">
        <HeadingPlugin />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="relative z-10 text-white/80 focus:outline-none min-h-96" />
          }
          placeholder={
            <span className="absolute top-14 left-0 select-none text-white/30 py-1">
              Press space for AI, / for commands
            </span>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <HistoryPlugin />
        <AIAssistPlugin />
        <CommandsPlugin />
        <ClearEditorPlugin />
        <ToolbarPlugin />
      </div>
    </LexicalComposer>
  );
}
