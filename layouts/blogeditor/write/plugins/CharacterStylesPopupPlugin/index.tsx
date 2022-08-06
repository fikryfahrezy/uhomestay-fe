/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $isCodeHighlightNode } from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isAtNodeEnd } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  ElementNode,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
  TextNode,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./Styles.module.css";

function setPopupPosition(
  editor: HTMLElement,
  rect: ClientRect,
  rootElementRect: ClientRect
) {
  editor.style.bottom = "0";
  editor.style.opacity = "1";
}

type FloatingCharacterStylesEditor = {
  editor: LexicalEditor;
  isBold: boolean;
  isCode: boolean;
  isItalic: boolean;
  isLink: boolean;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  isUnderline: boolean;
};

function FloatingCharacterStylesEditor({
  editor,
  isLink,
  isBold,
  isItalic,
  isUnderline,
  isCode,
  isStrikethrough,
  isSubscript,
  isSuperscript,
}: FloatingCharacterStylesEditor) {
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);
  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const updateCharacterStylesEditor = useCallback(() => {
    const selection = $getSelection();
    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = window.getSelection();

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      const rootElementRect = rootElement.getBoundingClientRect();
      let rect;

      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild as HTMLElement;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      setPopupPosition(popupCharStylesEditorElem, rect, rootElementRect);
    }
  }, [editor]);

  useEffect(() => {
    const onResize = () => {
      editor.getEditorState().read(() => {
        updateCharacterStylesEditor();
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [editor, updateCharacterStylesEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateCharacterStylesEditor();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateCharacterStylesEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateCharacterStylesEditor();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateCharacterStylesEditor]);

  return (
    <div
      ref={popupCharStylesEditorRef}
      className={styles["character-style-popup"]}
    >
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={`${styles["popup-item"]} ${styles["popup-item-spaced"]} ${
          isBold ? styles["active"] : ""
        }`}
        aria-label="Format text as bold"
      >
        <i
          className={`${styles["icon"]} ${styles["popup-item-format"]} ${styles["icon-bold"]}`}
        />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={`${styles["popup-item"]} ${styles["popup-item-spaced"]} ${
          isItalic ? styles["active"] : ""
        }`}
        aria-label="Format text as italics"
      >
        <i
          className={`${styles["icon"]} ${styles["popup-item-format"]} ${styles["icon-italic"]}`}
        />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={`${styles["popup-item"]} ${styles["popup-item-spaced"]} ${
          isUnderline ? styles["active"] : ""
        }`}
        aria-label="Format text to underlined"
      >
        <i
          className={`${styles["icon"]} ${styles["popup-item-format"]} ${styles["icon-underline"]}`}
        />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={`${styles["popup-item"]} ${styles["popup-item-spaced"]} ${
          isStrikethrough ? styles["active"] : ""
        }`}
        aria-label="Format text with a strikethrough"
      >
        <i
          className={`${styles["icon"]} ${styles["popup-item-format"]} ${styles["icon-strikethrough"]}`}
        />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
        }}
        className={`${styles["popup-item"]} ${styles["popup-item-spaced"]} ${
          isSubscript ? styles["active"] : ""
        }`}
        title="Subscript"
        aria-label="Format Subscript"
      >
        <i
          className={`${styles["icon"]} ${styles["popup-item-format"]} ${styles["icon-subscript"]}`}
        />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
        }}
        className={`${styles["popup-item"]} ${styles["popup-item-spaced"]} ${
          isSuperscript ? styles["active"] : ""
        }`}
        title="Superscript"
        aria-label="Format Superscript"
      >
        <i
          className={`${styles["icon"]} ${styles["popup-item-format"]} ${styles["icon-superscript"]}`}
        />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        }}
        className={`${styles["popup-item"]} ${styles["popup-item-spaced"]} ${
          isCode ? styles["active"] : ""
        }`}
        aria-label="Insert code block"
      >
        <i
          className={`${styles["icon"]} ${styles["popup-item-format"]} ${styles["icon-code"]}`}
        />
      </button>
      <button
        onClick={insertLink}
        className={`${styles["popup-item"]} ${styles["popup-item-spaced"]} ${
          isLink ? styles["active"] : ""
        }`}
        aria-label="Insert link"
      >
        <i
          className={`${styles["icon"]} ${styles["popup-item-format"]} ${styles["icon-link"]}`}
        />
      </button>
    </div>
  );
}

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

function useCharacterStylesPopup(editor: LexicalEditor): JSX.Element | null {
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection() as RangeSelection;
      const nativeSelection = window.getSelection();
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false);
        return;
      }

      const node = getSelectedNode(selection);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsCode(selection.hasFormat("code"));

      // Update links
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (
        !$isCodeHighlightNode(selection.anchor.getNode()) &&
        selection.getTextContent() !== ""
      ) {
        setIsText($isTextNode(node));
      } else {
        setIsText(false);
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener("selectionchange", updatePopup);
    return () => {
      document.removeEventListener("selectionchange", updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      updatePopup();
    });
  }, [editor, updatePopup]);

  if (!isText || isLink) {
    return null;
  }

  return (
    <FloatingCharacterStylesEditor
      editor={editor}
      isLink={isLink}
      isBold={isBold}
      isItalic={isItalic}
      isStrikethrough={isStrikethrough}
      isSubscript={isSubscript}
      isSuperscript={isSuperscript}
      isUnderline={isUnderline}
      isCode={isCode}
    />
  );
}

/**
 *
 * @returns {JSX.Element | null}
 */
export default function CharacterStylesPopupPlugin() {
  const [editor] = useLexicalComposerContext();
  return useCharacterStylesPopup(editor);
}
