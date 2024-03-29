import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function HeadingPlugin() {
  const [editor] = useLexicalComposerContext();

  const handleKeyUp = (e: { code: string }) => {
    if (e.code === "Enter") {
      editor.focus();
    }
  };

  return (
    <input className="heading" value={"ARPIT BHARDWAJ"} onKeyUp={handleKeyUp} />
  );
}
