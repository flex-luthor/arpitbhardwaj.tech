import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  QueryMatch,
  TypeaheadOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $getSelection, ElementNode, TextNode } from "lexical";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createListItemNode, $createListNode } from "@lexical/list";

const commandsData = ["H1", "H2", "H3", "H4", "List"];

class CommandOption extends TypeaheadOption {
  name: string;
  picture: JSX.Element;

  constructor(name: string, picture: JSX.Element) {
    super(name);
    this.name = name;
    this.picture = picture;
  }
}

function CommandMenuItem({
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
  option: CommandOption;
}) {
  let className = `item item-${option.name.toLowerCase()}`;
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
      id={"typeahead-item-" + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {option.picture}
      <span className="text">{option.name}</span>
    </li>
  );
}

export default function CommandsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const [queryString, setQueryString] = useState<string | null>(null);

  const [DOMReady, setDOMReady] = useState(false);
  const [commandMenuTrigger, setCommandMenuTrigger] = useState(false);

  useEffect(() => {
    setDOMReady(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      editor.update(() => {
        const selection = $getSelection();
        const targetNode = selection?.getNodes()[0].getParent();
        if (
          targetNode?.__type === "paragraph" ||
          targetNode?.__type === "root"
        ) {
          setCommandMenuTrigger(true);
        } else setCommandMenuTrigger(false);
      });
    };

    const commandListener = editor.registerRootListener(
      (rootElement: HTMLElement | null) => {
        rootElement?.addEventListener("keydown", handleKeyDown);
      }
    );

    return commandListener();
  }, []);

  const options = useMemo(
    () => commandsData.map((result) => new CommandOption(result, <i />)),
    [commandsData]
  );

  const onSelectOption = useCallback(
    (
      selectedOption: CommandOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const selection = $getSelection();
        const targetNode = selection?.getNodes()[0].getParent();
        if (
          targetNode?.__type === "paragraph" ||
          targetNode?.__type === "heading"
        ) {
          let newNode;
          switch (selectedOption.name.toLowerCase()) {
            case "h1":
              newNode = $createHeadingNode("h1");
              break;
            case "h2":
              newNode = $createHeadingNode("h2");
              break;
            case "h3":
              newNode = $createHeadingNode("h3");
              break;
            case "h4":
              newNode = $createHeadingNode("h4");
              break;
            case "list":
              newNode = $createListNode("bullet");
              break;
            default:
              break;
          }
          targetNode.insertBefore(newNode);
          targetNode.remove();
        }
      });
    },
    [editor]
  );

  const checkForCommandMatch = commandMenuTrigger
    ? useBasicTypeaheadTriggerMatch("/", {
        minLength: 0,
      })
    : useBasicTypeaheadTriggerMatch("", {});

  if (!DOMReady) {
    return null;
  }
  return (
    <LexicalTypeaheadMenuPlugin<CommandOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForCommandMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) =>
        anchorElementRef && commandsData.length
          ? ReactDOM.createPortal(
              <div className="typeahead-menu">
                <ul>
                  {options.map((option, i: number) => (
                    <CommandMenuItem
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
