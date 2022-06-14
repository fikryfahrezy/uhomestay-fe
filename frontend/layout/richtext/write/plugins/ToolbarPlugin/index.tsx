/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  LexicalEditor,
  RangeSelection,
  NodeSelection,
  GridSelection,
} from "lexical";
import type { HeadingTagType } from "@lexical/rich-text";

import { $createCodeNode, $isCodeNode } from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $isAtNodeEnd, $wrapLeafNodesInElements } from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  TextNode,
  ElementNode,
} from "lexical";
import { useCallback, useEffect, useState } from "react";
import { IS_APPLE } from "../../shared/environment";

import DropDown from "../../ui/DropDown";
import styles from "./Styles.module.css";

const supportedBlockTypes = new Set([
  "paragraph",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
]);

const blockTypeToBlockName: Record<string, string> = {
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  ol: "Numbered List",
  paragraph: "Normal",
  ul: "Bulleted List",
};

function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

type BlockFormatDropDownProps = {
  blockType: string;
  editor: LexicalEditor;
};

function BlockFormatDropDown({ editor, blockType }: BlockFormatDropDownProps) {
  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () =>
            $createHeadingNode(headingSize)
          );
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          if (selection.isCollapsed()) {
            $wrapLeafNodesInElements(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.removeText();
            selection.insertNodes([codeNode]);
            selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  return (
    <DropDown
      buttonClassName={`${styles["block-controls"]}`}
      buttonIconClassName={`${styles["icon"]} ${styles["block-type"]} ${
        styles[`icon-${blockType}`]
      }`}
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonAriaLabel="Formatting options for text style"
    >
      <button className={styles["dropdown-item"]} onClick={formatParagraph}>
        <span className={`${styles["icon"]} ${styles["icon-paragraph"]}`} />
        <span className={styles["dropdown-item-text"]}>Normal</span>
        {blockType === "paragraph" && (
          <span className={styles["controls-item-active"]} />
        )}
      </button>
      <button
        className={styles["dropdown-item"]}
        onClick={() => formatHeading("h1")}
      >
        <span className={`${styles["icon"]} ${styles["icon-h1"]}`} />
        <span className={styles["dropdown-item-text"]}>Heading 1</span>
        {blockType === "h1" && (
          <span className={styles["controls-item-active"]} />
        )}
      </button>
      <button
        className={styles["dropdown-item"]}
        onClick={() => formatHeading("h2")}
      >
        <span className={`${styles["icon"]} ${styles["icon-h2"]}`} />
        <span className={styles["dropdown-item-text"]}>Heading 2</span>
        {blockType === "h2" && (
          <span className={styles["controls-item-active"]} />
        )}
      </button>
      <button
        className={styles["dropdown-item"]}
        onClick={() => formatHeading("h3")}
      >
        <span className={`${styles["icon"]} ${styles["icon-h3"]}`} />
        <span className={styles["dropdown-item-text"]}>Heading 3</span>
        {blockType === "h3" && (
          <span className={styles["controls-item-active"]} />
        )}
      </button>
      <button className={styles["dropdown-item"]} onClick={formatBulletList}>
        <span className={`${styles["icon"]} ${styles["icon-bullet-list"]}`} />
        <span className={styles["dropdown-item-text"]}>Bullet List</span>
        {blockType === "ul" && (
          <span className={styles["controls-item-active"]} />
        )}
      </button>
      <button className={styles["dropdown-item"]} onClick={formatNumberedList}>
        <span className={`${styles["icon"]} ${styles["icon-numbered-list"]}`} />
        <span className={styles["dropdown-item-text"]}>Numbered List</span>
        {blockType === "ol" && (
          <span className={styles["controls-item-active"]} />
        )}
      </button>
    </DropDown>
  );
}

/**
 *
 * @returns {JSX.Element}
 */
function Divider() {
  return <div className={styles["divider"]} />;
}

/**
 *
 * @returns {JSX.Element}
 */
export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList
            ? (parentList as ListNode).getTag()
            : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
          if ($isCodeNode(element)) {
            return;
          }
        }
      }
      return;
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      activeEditor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload: boolean) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand(
        CAN_REDO_COMMAND,
        (payload: boolean) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [activeEditor, updateToolbar]);

  return (
    <>
      <div className={styles["toolbar-container"]}>
        <button
          className={styles["show-toolbar-button"]}
          onClick={() => {
            setIsToolbarOpen((prevState) => !prevState);
          }}
        >
          <span
            className={`${styles["show-toolbar-icon"]} ${styles["icon-paragraph"]}`}
          />
        </button>
        <div
          className={`${styles["toolbar"]} ${
            isToolbarOpen ? styles["toolbar-open"] : ""
          }`}
        >
          <button
            disabled={!canUndo}
            onClick={() => {
              activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
            }}
            title={IS_APPLE ? "Undo (⌘Z)" : "Undo (Ctrl+Z)"}
            className={`${styles["toolbar-item"]} ${styles["spaced"]}`}
            aria-label="Undo"
          >
            <i className={`${styles["format"]} ${styles["icon-undo"]}`} />
          </button>
          <button
            disabled={!canRedo}
            onClick={() => {
              activeEditor.dispatchCommand(REDO_COMMAND, undefined);
            }}
            title={IS_APPLE ? "Redo (⌘Y)" : "Undo (Ctrl+Y)"}
            className={styles["toolbar-item"]}
            aria-label="Redo"
          >
            <i className={`${styles["format"]} ${styles["icon-redo"]}`} />
          </button>
          <Divider />
          {supportedBlockTypes.has(blockType) && activeEditor === editor && (
            <>
              <BlockFormatDropDown blockType={blockType} editor={editor} />
              <Divider />
            </>
          )}
          <button
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            className={`${styles["toolbar-item"]} ${styles["spaced"]}  ${
              isBold ? styles["button-active"] : ""
            }`}
            title={IS_APPLE ? "Bold (⌘B)" : "Bold (Ctrl+B)"}
            aria-label={`Format text as bold. Shortcut: ${
              IS_APPLE ? "⌘B" : "Ctrl+B"
            }`}
          >
            <i className={`${styles["format"]} ${styles["icon-bold"]}`} />
          </button>
          <button
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            className={`${styles["toolbar-item"]} ${styles["spaced"]} ${
              isItalic ? styles["button-active"] : ""
            }`}
            title={IS_APPLE ? "Italic (⌘I)" : "Italic (Ctrl+I)"}
            aria-label={`Format text as italics. Shortcut: ${
              IS_APPLE ? "⌘I" : "Ctrl+I"
            }`}
          >
            <i className={`${styles["format"]} ${styles["icon-italic"]}`} />
          </button>
          <button
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            className={`${styles["toolbar-item"]} ${styles["spaced"]} ${
              isUnderline ? styles["button-active"] : ""
            }`}
            title={IS_APPLE ? "Underline (⌘U)" : "Underline (Ctrl+U)"}
            aria-label={`Format text to underlined. Shortcut: ${
              IS_APPLE ? "⌘U" : "Ctrl+U"
            }`}
          >
            <i className={`${styles["format"]} ${styles["icon-underline"]}`} />
          </button>
          <Divider />
          <DropDown
            buttonLabel="Align"
            buttonIconClassName={`${styles["icon"]} ${styles["icon-left-align"]}`}
            buttonClassName={`${styles["toolbar-item"]} ${styles["spaced"]} ${styles["alignment"]}`}
            buttonAriaLabel="Formatting options for text alignment"
          >
            <button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
              }}
              className={styles["dropdown-item"]}
            >
              <i className={`${styles["icon"]} ${styles["icon-left-align"]}`} />
              <span className={styles["dropdown-item-text"]}>Left Align</span>
            </button>
            <button
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
              }}
              className={styles["dropdown-item"]}
            >
              <i
                className={`${styles["icon"]} ${styles["icon-right-align"]}`}
              />
              <span className={styles["dropdown-item-text"]}>Right Align</span>
            </button>
          </DropDown>
        </div>
      </div>
    </>
  );
}
