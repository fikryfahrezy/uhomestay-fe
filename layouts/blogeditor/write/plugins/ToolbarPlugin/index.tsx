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
import type { InsertImagePayload } from "../ImagesPlugin";

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
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import {
  $isAtNodeEnd,
  $isParentElementRTL,
  $wrapLeafNodesInElements,
} from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  TextNode,
  ElementNode,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { IS_APPLE } from "../../shared/environment";

import useModal from "../../hooks/useModal";
import Button from "../../ui/Button";
import DropDown from "../../ui/DropDown";
import FileInput from "../../ui/FileInput";
import LinkPreview from "../../ui/LinkPreview";
import TextInput from "../../ui/TextInput";
import { INSERT_IMAGE_COMMAND, REPLACE_IMAGE_COMMAND } from "../ImagesPlugin";
import { INSERT_TWEET_COMMAND } from "../TwitterPlugin";
import { INSERT_YOUTUBE_COMMAND } from "../YouTubePlugin";
import styles from "./Styles.module.css";

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
]);

const blockTypeToBlockName: Record<string, string> = {
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  ol: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
  ul: "Bulleted List",
};

const CODE_LANGUAGE_OPTIONS: [string, string][] = [
  ["", "- Select language -"],
  ["c", "C"],
  ["clike", "C-like"],
  ["css", "CSS"],
  ["html", "HTML"],
  ["js", "JavaScript"],
  ["markdown", "Markdown"],
  ["objc", "Objective-C"],
  ["plain", "Plain Text"],
  ["py", "Python"],
  ["rust", "Rust"],
  ["sql", "SQL"],
  ["swift", "Swift"],
  ["xml", "XML"],
];

const CODE_LANGUAGE_MAP: Record<string, string> = {
  javascript: "js",
  md: "markdown",
  plaintext: "plain",
  python: "py",
  text: "plain",
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

function positionEditorElement(
  editor: HTMLDivElement,
  rect: DOMRect | undefined | null
) {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.position = "sticky";
    editor.style.top = `0`;
    editor.style.left = `0`;
    editor.style.bottom = "0";
    editor.style.opacity = "1";
  }
}

type FloatingLinkEditorProps = {
  editor: LexicalEditor;
};

function FloatingLinkEditor({ editor }: FloatingLinkEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState<
    RangeSelection | NodeSelection | GridSelection | null
  >(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
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

      positionEditorElement(editorElem, rect);
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl("");
    }

    return true;
  }, [editor]);

  useEffect(() => {
    const onResize = () => {
      editor.getEditorState().read(() => {
        updateLinkEditor();
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div ref={editorRef} className={styles["link-editor"]}>
      {isEditMode ? (
        <input
          ref={inputRef}
          className={styles["link-input"]}
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== "") {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === "Escape") {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <>
          <LinkPreview url={linkUrl} />
          <div className={styles["link-input"]}>
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <div
              className={styles["link-edit"]}
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

type InsertImageUriDialogBodyProps = {
  onClick: (payload: InsertImagePayload) => void;
};

function InsertImageUriDialogBody({ onClick }: InsertImageUriDialogBodyProps) {
  const [src, setSrc] = useState("");
  const [altText, setAltText] = useState("");

  const isDisabled = src === "";

  return (
    <>
      <TextInput
        label="Image URL"
        placeholder="i.e. https://source.unsplash.com/random"
        onChange={setSrc}
        value={src}
        data-test-id="image-modal-url-input"
      />
      <TextInput
        label="Alt Text"
        placeholder="Random unsplash image"
        onChange={setAltText}
        value={altText}
        data-test-id="image-modal-alt-text-input"
      />
      <div className={styles["ToolbarPlugin__dialogActions"]}>
        <Button
          data-test-id="image-modal-confirm-btn"
          disabled={isDisabled}
          onClick={() => onClick({ altText, src })}
        >
          Confirm
        </Button>
      </div>
    </>
  );
}

type InsertImageUploadedDialogBodyProps = {
  onClick: (payload: { altText: string; src: File }) => void;
};

function InsertImageUploadedDialogBody({
  onClick,
}: InsertImageUploadedDialogBodyProps) {
  const [src, setSrc] = useState<File | null>(null);
  const [altText, setAltText] = useState("");

  const isDisabled = src === null;

  const loadImage = (files: FileList | null) => {
    if (files === null || files.length === 0) {
      return;
    }
    const file = files[0];

    // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
    const fileTypes = [
      "image/apng",
      "image/bmp",
      "image/gif",
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/svg+xml",
      "image/tiff",
      "image/webp",
      "image/x-icon",
    ];

    if (!fileTypes.includes(file.type)) {
      return;
    }

    setSrc(file);
  };

  return (
    <>
      <FileInput
        label="Image Upload"
        onChange={loadImage}
        accept="image/*"
        data-test-id="image-modal-file-upload"
      />
      <TextInput
        label="Alt Text"
        placeholder="Descriptive alternative text"
        onChange={setAltText}
        value={altText}
        data-test-id="image-modal-alt-text-input"
      />
      <div className={styles["ToolbarPlugin__dialogActions"]}>
        <Button
          data-test-id="image-modal-file-upload-btn"
          disabled={isDisabled}
          onClick={() => {
            if (src === null) {
              return;
            }
            onClick({ altText, src });
          }}
        >
          Confirm
        </Button>
      </div>
    </>
  );
}

export type UploadImgFunc = (
  param: FormData
) => Promise<{ data: { url: string } }>;

type InsertImageDialog = {
  uploadImgFunc: UploadImgFunc;
  activeEditor: LexicalEditor;
  onClose: () => void;
};

function InsertImageDialog({
  uploadImgFunc,
  activeEditor,
  onClose,
}: InsertImageDialog) {
  const [mode, setMode] = useState<null | "url" | "file">(null);

  const onImgFileClick = (payload: { altText: string; src: File }) => {
    const { altText, src } = payload;

    const formData = new FormData();
    formData.append("file", src);

    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);

    uploadImgFunc(formData)
      .then((res) => {
        activeEditor.dispatchCommand(REPLACE_IMAGE_COMMAND, {
          altText,
          src: res.data.url,
        });
      })
      .catch((e) => {
        console.error(e);
      });

    onClose();
  };

  return (
    <>
      {!mode && (
        <div className={styles["ToolbarPlugin__dialogButtonsList"]}>
          <Button
            data-test-id="image-modal-option-file"
            onClick={() => setMode("file")}
          >
            File
          </Button>
        </div>
      )}
      {mode === "file" && (
        <InsertImageUploadedDialogBody onClick={onImgFileClick} />
      )}
    </>
  );
}

const VALID_TWITTER_URL = /twitter.com\/[0-9a-zA-Z]{1,20}\/status\/([0-9]*)/g;

type InsertTweetDialogProps = {
  activeEditor: LexicalEditor;
  onClose: () => void;
};

function InsertTweetDialog({ activeEditor, onClose }: InsertTweetDialogProps) {
  const [text, setText] = useState("");

  const onClick = () => {
    const tweetID = text.split("status/")?.[1]?.split("?")?.[0];
    activeEditor.dispatchCommand(INSERT_TWEET_COMMAND, tweetID);
    onClose();
  };

  const isDisabled = text === "" || !text.match(VALID_TWITTER_URL);

  return (
    <>
      <TextInput
        label="Tweet URL"
        placeholder="i.e. https://twitter.com/jack/status/20"
        onChange={setText}
        value={text}
      />
      <div className={styles["ToolbarPlugin__dialogActions"]}>
        <Button disabled={isDisabled} onClick={onClick}>
          Confirm
        </Button>
      </div>
    </>
  );
}

// Taken from https://stackoverflow.com/a/9102270
const YOUTUBE_ID_PARSER =
  /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

const parseYouTubeVideoID = (url: string) => {
  const urlMatches = url.match(YOUTUBE_ID_PARSER);

  return urlMatches?.[2].length === 11 ? urlMatches[2] : null;
};

type InsertYouTubeDialogProps = {
  activeEditor: LexicalEditor;
  onClose: () => void;
};

function InsertYouTubeDialog({
  activeEditor,
  onClose,
}: InsertYouTubeDialogProps) {
  const [text, setText] = useState("");

  const onClick = () => {
    const videoID = parseYouTubeVideoID(text);
    if (videoID) {
      activeEditor.dispatchCommand(INSERT_YOUTUBE_COMMAND, videoID);
    }
    onClose();
  };

  const isDisabled = text === "" || !parseYouTubeVideoID(text);

  return (
    <>
      <TextInput
        data-test-id="youtube-embed-modal-url"
        label="YouTube URL"
        placeholder="i.e. https://www.youtube.com/watch?v=jNQXAC9IVRw"
        onChange={setText}
        value={text}
      />
      <div className={styles["ToolbarPlugin__dialogActions"]}>
        <Button
          data-test-id="youtube-embed-modal-submit-btn"
          disabled={isDisabled}
          onClick={onClick}
        >
          Confirm
        </Button>
      </div>
    </>
  );
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
      <button className={styles["dropdown-item"]} onClick={formatQuote}>
        <span className={`${styles["icon"]} ${styles["icon-quote"]}`} />
        <span className={styles["dropdown-item-text"]}>Quote</span>
        {blockType === "quote" && (
          <span className={styles["controls-item-active"]} />
        )}
      </button>
      <button className={styles["dropdown-item"]} onClick={formatCode}>
        <span className={`${styles["icon"]} ${styles["icon-code"]}`} />
        <span className={styles["dropdown-item-text"]}>Code Block</span>
        {blockType === "code" && (
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

type SelectProps = {
  className: string;
  onChange: (event: { target: { value: string } }) => void;
  options: [string, string][];
  value: string;
};

function Select({ onChange, className, options, value }: SelectProps) {
  return (
    <select className={`${className}`} onChange={onChange} value={value}>
      {options.map(([option, text]) => (
        <option key={option} value={option}>
          {text}
        </option>
      ))}
    </select>
  );
}

type ToolbarPluginProps = {
  uploadImgFunc: UploadImgFunc;
};

export default function ToolbarPlugin({ uploadImgFunc }: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(
    null
  );
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [modal, showModal] = useModal();
  const [isRTL, setIsRTL] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState("");
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
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsCode(selection.hasFormat("code"));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
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
            const language = element.getLanguage();
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : ""
            );
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

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const onCodeLanguageSelect = useCallback(
    (e: {
      target: {
        value: string;
      };
    }) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey]
  );

  return (
    <>
      {isLink && <FloatingLinkEditor editor={activeEditor} />}
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
          {blockType === "code" ? (
            <>
              <Select
                className={`${styles["select-toolbar-item"]} ${styles["select-code-language"]}`}
                onChange={onCodeLanguageSelect}
                options={CODE_LANGUAGE_OPTIONS}
                value={codeLanguage}
              />
              <i className={`${styles["chevron-down"]} ${styles["inside"]}`} />
            </>
          ) : (
            <>
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
                  activeEditor.dispatchCommand(
                    FORMAT_TEXT_COMMAND,
                    "underline"
                  );
                }}
                className={`${styles["toolbar-item"]} ${styles["spaced"]} ${
                  isUnderline ? styles["button-active"] : ""
                }`}
                title={IS_APPLE ? "Underline (⌘U)" : "Underline (Ctrl+U)"}
                aria-label={`Format text to underlined. Shortcut: ${
                  IS_APPLE ? "⌘U" : "Ctrl+U"
                }`}
              >
                <i
                  className={`${styles["format"]} ${styles["icon-underline"]}`}
                />
              </button>
              <button
                onClick={() => {
                  activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
                }}
                className={`${styles["toolbar-item"]} ${styles["spaced"]} ${
                  isCode ? styles["button-active"] : ""
                }`}
                title="Insert code block"
                aria-label="Insert code block"
              >
                <i className={`${styles["format"]} ${styles["icon-code"]}`} />
              </button>
              <button
                onClick={insertLink}
                className={`${styles["toolbar-item"]} ${styles["spaced"]} ${
                  isLink ? styles["button-active"] : ""
                }`}
                aria-label="Insert link"
                title="Insert link"
              >
                <i className={`${styles["format"]} ${styles["icon-link"]}`} />
              </button>
              <DropDown
                buttonClassName={`${styles["toolbar-item"]} ${styles["spaced"]}`}
                buttonLabel=""
                buttonAriaLabel="Formatting options for additional text styles"
                buttonIconClassName={`${styles["icon"]} ${styles["icon-dropdown-more"]}`}
              >
                <button
                  onClick={() => {
                    activeEditor.dispatchCommand(
                      FORMAT_TEXT_COMMAND,
                      "strikethrough"
                    );
                  }}
                  className={`
              ${styles["dropdown-item"]} ${
                    isStrikethrough ? styles["button-active"] : ""
                  }
            `}
                  title="Strikethrough"
                  aria-label="Format text with a strikethrough"
                >
                  <i
                    className={`${styles["icon"]} ${styles["icon-strikethrough"]}`}
                  />
                  <span className={styles["dropdown-item-text"]}>
                    Strikethrough
                  </span>
                </button>
                <button
                  onClick={() => {
                    activeEditor.dispatchCommand(
                      FORMAT_TEXT_COMMAND,
                      "subscript"
                    );
                  }}
                  className={`
              ${styles["dropdown-item"]} ${
                    isSubscript ? styles["button-active"] : ""
                  }
            `}
                  title="Subscript"
                  aria-label="Format text with a subscript"
                >
                  <i
                    className={`${styles["icon"]} ${styles["icon-subscript"]}`}
                  />
                  <span className={styles["dropdown-item-text"]}>
                    Subscript
                  </span>
                </button>
                <button
                  onClick={() => {
                    activeEditor.dispatchCommand(
                      FORMAT_TEXT_COMMAND,
                      "superscript"
                    );
                  }}
                  className={`
              ${styles["dropdown-item"]} ${
                    isSuperscript ? styles["button-active"] : ""
                  }
            `}
                  title="Superscript"
                  aria-label="Format text with a superscript"
                >
                  <i
                    className={`${styles["icon"]} ${styles["icon-superscript"]}`}
                  />
                  <span className={styles["dropdown-item-text"]}>
                    Superscript
                  </span>
                </button>
              </DropDown>
              <Divider />
              <DropDown
                buttonClassName={`${styles["toolbar-item"]} ${styles["spaced"]}`}
                buttonLabel="Insert"
                buttonAriaLabel="Insert specialized editor node"
                buttonIconClassName={`${styles["icon"]} ${styles["icon-plus"]}`}
              >
                <button
                  onClick={() => {
                    activeEditor.dispatchCommand(
                      INSERT_HORIZONTAL_RULE_COMMAND,
                      undefined
                    );
                  }}
                  className={styles["dropdown-item"]}
                >
                  <i
                    className={`${styles["icon"]} ${styles["icon-horizontal-rule"]}`}
                  />
                  <span className={styles["dropdown-item-text"]}>
                    Horizontal Rule
                  </span>
                </button>
                <button
                  onClick={() => {
                    showModal("Insert Image", (onClose) => (
                      <InsertImageDialog
                        uploadImgFunc={uploadImgFunc}
                        activeEditor={activeEditor}
                        onClose={onClose}
                      />
                    ));
                  }}
                  className={styles["dropdown-item"]}
                >
                  <i className={`${styles["icon"]} ${styles["icon-image"]}`} />
                  <span className={styles["dropdown-item-text"]}>Image</span>
                </button>
                <button
                  onClick={() => {
                    showModal("Insert Tweet", (onClose) => (
                      <InsertTweetDialog
                        activeEditor={activeEditor}
                        onClose={onClose}
                      />
                    ));
                  }}
                  className={styles["dropdown-item"]}
                >
                  <i className={`${styles["icon"]} ${styles["icon-tweet"]}`} />
                  <span className={styles["dropdown-item-text"]}>Tweet</span>
                </button>
                <button
                  onClick={() => {
                    showModal("Insert YouTube Video", (onClose) => (
                      <InsertYouTubeDialog
                        activeEditor={activeEditor}
                        onClose={onClose}
                      />
                    ));
                  }}
                  className={styles["dropdown-item"]}
                >
                  <i
                    className={`${styles["icon"]} ${styles["icon-youtube"]}`}
                  />
                  <span className={styles["dropdown-item-text"]}>
                    YouTube Video
                  </span>
                </button>
              </DropDown>
            </>
          )}
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
            <Divider />
            <button
              onClick={() => {
                activeEditor.dispatchCommand(
                  OUTDENT_CONTENT_COMMAND,
                  undefined
                );
              }}
              className={styles["dropdown-item"]}
            >
              <i
                className={`${styles["icon"]} ${
                  isRTL ? styles["icon-indent"] : styles["icon-outdent"]
                }`}
              />
              <span className={styles["dropdown-item-text"]}>Outdent</span>
            </button>
            <button
              onClick={() => {
                activeEditor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
              }}
              className={styles["dropdown-item"]}
            >
              <i
                className={`${styles["icon"]} ${
                  isRTL ? styles["icon-outdent"] : styles["icon-indent"]
                }`}
              />
              <span className={styles["dropdown-item-text"]}>Indent</span>
            </button>
          </DropDown>
          {modal}
        </div>
      </div>
    </>
  );
}
