/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  RangeSelection,
  NodeSelection,
  GridSelection,
  LexicalCommand,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  $isRootNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from "lexical";
import { useEffect } from "react";

import { $createImageNode, ImageNode } from "../nodes/ImageNode";

export type InsertImagePayload = Readonly<{
  altText: string;
  src: string;
}>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand();

export const REPLACE_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand();

export default function ImagesPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            if ($isRootNode(selection.anchor.getNode())) {
              selection.insertParagraph();
            }

            selection.insertText("Loading...");
            selection.insertLineBreak();
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        REPLACE_IMAGE_COMMAND,
        (payload: InsertImagePayload) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            if ($isRootNode(selection.anchor.getNode())) {
              selection.insertParagraph();
            }

            const imageNode = $createImageNode(
              payload.src,
              payload.altText,
              500
            );

            selection.insertNodes([imageNode]);

            const siblings = imageNode.getPreviousSiblings();
            siblings[siblings.length - 2].remove();
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);
  return null;
}
