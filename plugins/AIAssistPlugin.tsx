import { $createAIAssitantNode } from "@/nodes/AIAssistantNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  TypeaheadOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  createCommand,
  LexicalCommand,
  TextNode,
} from "lexical";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import mockData from "../mockData.json";

class AIAssistOption extends TypeaheadOption {
  name: string;
  picture: JSX.Element;

  constructor(name: string, picture: JSX.Element) {
    super(name);
    this.name = name;
    this.picture = picture;
  }
}

const AICommands = [
  "Write a blog post about ",
  "Brainstorm ideas about ",
  "Write an email about ",
];

function AIMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: AIAssistOption;
}) {
  let className = `ai-item`;
  if (isSelected) {
    className += " selected";
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={"ai-typeahead-item-" + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <Image
        src="/magic-icon.svg"
        width={16}
        height={16}
        alt="ai"
        style={{ marginRight: 8, marginLeft: 8 }}
      />
      <span className="text">{option.name + "..."}</span>
    </li>
  );
}

export default function AIAssistPlugin() {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const [AIMenuTrigger, setAIMenuTrigger] = useState(false);
  const [DOMReady, setDOMReady] = useState(false);

  useLayoutEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        editor.update(() => {
          const selection = $getSelection();
          const isParagraphNode =
            selection?.getNodes()[0].getType() == "paragraph";
          const isEmptyNode = selection?.getNodes()[0].getTextContent() == "";
          if (isParagraphNode && isEmptyNode) {
            const aiNode = $createAIAssitantNode();
            selection.insertNodes([aiNode]);
            const REMOVE_AI_COMMAND: LexicalCommand<string> = createCommand();
            editor.registerCommand(
              REMOVE_AI_COMMAND,
              () => {
                aiNode.remove();
                return false;
              },
              0
            );
          }
        });
      }
      if (event.code === "Enter") {
        let isAINode = false;
        editor.update(() => {
          const selection = $getSelection();
          const targetNode = selection?.getNodes()[0].getParent();
          isAINode = targetNode?.getType() == "ai-assistant-node";
        });
        if (isAINode) {
          const data = mockData.data;
          data.forEach((el, i) => {
            setTimeout(() => {
              editor.update(() => {
                const selection = $getSelection();
                const targetNode = selection?.getNodes()[0].getParent();
                const isAINode = targetNode?.getType() == "ai-assistant-node";
                if (isAINode) {
                  if (i === 0) {
                    targetNode
                      .getChildAtIndex(0)
                      ?.replace($createTextNode("AI is writing... "));
                    targetNode.getChildAtIndex(1)?.remove();
                  }
                  const dataNode = $createParagraphNode();
                  dataNode.append($createTextNode(el));
                  targetNode.insertBefore(dataNode);
                  if (i === data.length - 1) {
                    targetNode.remove();
                  }
                }
              });
            }, 500 * i);
          });
        }
      }
      if (event.code === "Backspace") {
        editor.update(() => {
          const selection = $getSelection();
          const targetNode = selection?.getNodes()[0];
          const isAINode = targetNode?.getType() == "ai-assistant-node";
          // const isEmptyNode = targetNode?.getTextContent() == "";
          if (isAINode) {
            targetNode.remove();
            const paragraphNode = $createParagraphNode();
            selection?.insertNodes([paragraphNode]);
          }
        });
      }
    };

    return editor.registerRootListener(
      (
        rootElement: HTMLElement | null,
        prevRootElement: HTMLElement | null
      ) => {
        if (prevRootElement !== null) {
          prevRootElement.removeEventListener("keydown", onKeyDown);
        }
        if (rootElement !== null) {
          rootElement.addEventListener("keydown", onKeyDown);
        }
      }
    );
  }, [editor]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      editor.update(() => {
        const selection = $getSelection();
        const targetNode = selection?.getNodes()[0];
        if (
          targetNode?.__type === "ai-assistant-node" &&
          targetNode?.getTextContent() == ""
        ) {
          setAIMenuTrigger(true);
        } else setAIMenuTrigger(false);
      });
    };

    const commandListener = editor.registerRootListener(
      (rootElement: HTMLElement | null) => {
        rootElement?.addEventListener("keydown", handleKeyDown);
      }
    );

    return commandListener();
  }, []);

  useEffect(() => {
    setDOMReady(true);
  }, []);

  const onSelectOption = useCallback(
    (
      selectedOption: AIAssistOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const selection = $getSelection();
        const targetNode = selection?.getNodes()[0];
        const newNode = $createTextNode(selectedOption.name);
        targetNode?.replace(newNode);
        newNode.select();
      });
    },
    [editor]
  );

  const checkForAIMatch = AIMenuTrigger
    ? useBasicTypeaheadTriggerMatch(" ", {
        minLength: 0,
      })
    : useBasicTypeaheadTriggerMatch("", {});

  if (!DOMReady) {
    return null;
  }
  const options = AICommands.map((command) => {
    return new AIAssistOption(command, <i />);
  });

  return (
    <LexicalTypeaheadMenuPlugin<AIAssistOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForAIMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) =>
        anchorElementRef
          ? ReactDOM.createPortal(
              <div className="ai-input">
                <div
                  style={{
                    display: "flex",
                    paddingLeft: 8,
                    paddingTop: 8,
                    paddingBottom: 8,
                    borderColor: "black",
                    borderBottomWidth: 1,
                    borderBottomColor: "#ffffff22",
                  }}
                >
                  <Image
                    src="/ask-icon.svg"
                    width={16}
                    height={16}
                    alt="ask"
                    style={{ marginRight: 6 }}
                  />
                  Ask AI to write anything
                </div>
                <ul>
                  {options.map((option, i: number) => (
                    <AIMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current
            )
          : null
      }
    />
  );
}
