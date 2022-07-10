/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
  NodeSelection,
  GridSelection,
  NodeKey,
} from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import HashtagsPlugin from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LinkPlugin from "@lexical/react/LexicalLinkPlugin";
import LexicalNestedComposer from "@lexical/react/LexicalNestedComposer";
import RichTextPlugin from "@lexical/react/LexicalRichTextPlugin";
import useLexicalNodeSelection from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  createEditor,
  DecoratorNode,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from "lexical";
import * as React from "react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import { useSharedHistoryContext } from "../../context/SharedHistoryContext";
import EmojisPlugin from "../../plugins/EmojisPlugin";
import ImagesPlugin from "../../plugins/ImagesPlugin";
import KeywordsPlugin from "../../plugins/KeywordsPlugin";
import MentionsPlugin from "../../plugins/MentionsPlugin";
import ContentEditable from "../../ui/ContentEditable";
import ImageResizer from "../../ui/ImageResizer";
import Placeholder from "../../ui/Placeholder";
import styles from "./Styles.module.css";

const imageCache = new Set();

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}

type LazyImageProps = {
  altText: string;
  className?: string;
  height: "inherit" | number;
  imageRef: { current: null | HTMLImageElement };
  maxWidth: number;
  src: string;
  width: "inherit" | number;
};

function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  maxWidth,
}: LazyImageProps) {
  useSuspenseImage(src);
  return (
    <img
      className={className}
      src={src}
      alt={altText}
      ref={imageRef}
      style={{
        height,
        maxWidth,
        width,
      }}
    />
  );
}

type ImageComponentProps = {
  altText: string;
  caption: LexicalEditor;
  height: "inherit" | number;
  maxWidth: number;
  nodeKey: NodeKey;
  resizable: boolean;
  showCaption: boolean;
  src: string;
  width: "inherit" | number;
};

function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
  resizable,
  showCaption,
  caption,
}: ImageComponentProps) {
  const ref = useRef(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState(false);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<
    RangeSelection | NodeSelection | GridSelection | null
  >(null);

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event = payload;
        event.preventDefault();
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isImageNode(node)) {
            node.remove();
          }
          setSelected(false);
        });
      }
      return false;
    },
    [editor, isSelected, nodeKey, setSelected]
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        setSelection(editorState.read(() => $getSelection()));
      }),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload: MouseEvent) => {
          const event = payload;

          if (isResizing) {
            return true;
          }
          if (event.target === ref.current) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(!isSelected);
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      )
    );
  }, [
    clearSelection,
    editor,
    isResizing,
    isSelected,
    nodeKey,
    onDelete,
    setSelected,
  ]);

  const setShowCaption = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setShowCaption(true);
      }
    });
  };

  const onResizeEnd = (
    nextWidth: number | "inherit",
    nextHeight: number | "inherit"
  ) => {
    // Delay hiding the resize bars for click case
    setTimeout(() => {
      setIsResizing(false);
    }, 200);

    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node?.setWidthAndHeight(nextWidth, nextHeight);
      }
    });
  };

  const onResizeStart = () => {
    setIsResizing(true);
  };

  const { historyState } = useSharedHistoryContext();

  return (
    <Suspense fallback={null}>
      <>
        <LazyImage
          className={isSelected || isResizing ? styles["focused"] : undefined}
          src={src}
          altText={altText}
          imageRef={ref}
          width={width}
          height={height}
          maxWidth={maxWidth}
        />
        {showCaption && (
          <div className={styles["image-caption-container"]}>
            <LexicalNestedComposer initialEditor={caption}>
              <MentionsPlugin />
              <ImagesPlugin />
              <LinkPlugin />
              <EmojisPlugin />
              <HashtagsPlugin />
              <KeywordsPlugin />
              <HistoryPlugin externalHistoryState={historyState} />
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className={styles["ImageNode__contentEditable"]}
                  />
                }
                placeholder={
                  <Placeholder className={styles["ImageNode__placeholder"]}>
                    Enter a caption...
                  </Placeholder>
                }
                initialEditorState={null}
              />
            </LexicalNestedComposer>
          </div>
        )}
        {resizable &&
          $isNodeSelection(selection) &&
          (isSelected || isResizing) && (
            <ImageResizer
              showCaption={showCaption}
              setShowCaption={setShowCaption}
              editor={editor}
              imageRef={ref}
              maxWidth={maxWidth}
              onResizeStart={onResizeStart}
              onResizeEnd={onResizeEnd}
            />
          )}
      </>
    </Suspense>
  );
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: "inherit" | number;
  __height: "inherit" | number;
  __maxWidth: number;
  __showCaption: boolean;
  __caption: LexicalEditor;

  static getType() {
    return "image";
  }

  static clone(node: ImageNode) {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__key
    );
  }

  constructor(
    src: string,
    altText: string,
    maxWidth: number,
    width?: number | "inherit",
    height?: number | "inherit",
    showCaption?: boolean,
    caption?: LexicalEditor,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
    this.__showCaption = showCaption || false;
    this.__caption = caption || createEditor();
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);
    return { element };
  }

  setWidthAndHeight(width: "inherit" | number, height: "inherit" | number) {
    const writable = this.getWritable();
    (writable as any).__width = width;
    (writable as any).__height = height;
  }

  setShowCaption(showCaption: boolean) {
    const writable = this.getWritable();
    (writable as any).__showCaption = showCaption;
  }

  // View

  createDOM(config: EditorConfig) {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM() {
    return false;
  }

  getSrc() {
    return this.__src;
  }

  getAltText() {
    return this.__altText;
  }

  decorate() {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
        showCaption={this.__showCaption}
        caption={this.__caption}
        resizable={true}
      />
    );
  }
}

export function $createImageNode(
  src: string,
  altText: string,
  maxWidth: number
) {
  return new ImageNode(src, altText, maxWidth);
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}
