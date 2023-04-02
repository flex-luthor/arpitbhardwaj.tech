import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CLEAR_EDITOR_COMMAND } from "lexical";
import Image from "next/image";
import { useState } from "react";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [locked, setLocked] = useState(false);

  const handleClickClear = () => {
    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
  };

  const handleClickLock = () => {
    setLocked(!locked);
    editor.update(() => {
      editor.setEditable(locked);
    });
  };

  return (
    <div className="toolbar-container">
      <button
        className="toolbar-button"
        placeholder="Untitled"
        onClick={handleClickClear}
      >
        <Image src="/clear-icon.svg" width={24} height={24} alt="Clear" />
      </button>
      <button
        className="toolbar-button"
        placeholder="Untitled"
        onClick={handleClickLock}
      >
        <Image
          src={locked ? "/lock-active-icon.svg" : "/lock-icon.svg"}
          width={24}
          height={24}
          alt="Clear"
        />
      </button>
    </div>
  );
}
