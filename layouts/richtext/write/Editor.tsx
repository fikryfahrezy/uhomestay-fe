/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ForwardedRef } from "react";
import type { EditorState, LexicalEditor } from "lexical";
import type { InitialEditorStateType } from "@lexical/react/LexicalRichTextPlugin";
import AutoFocusPlugin from "@lexical/react/LexicalAutoFocusPlugin";
import AutoScrollPlugin from "@lexical/react/LexicalAutoScrollPlugin";
import LexicalClearEditorPlugin from "@lexical/react/LexicalClearEditorPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import ListPlugin from "@lexical/react/LexicalListPlugin";
import LexicalMarkdownShortcutPlugin from "@lexical/react/LexicalMarkdownShortcutPlugin";
import RichTextPlugin from "@lexical/react/LexicalRichTextPlugin";
import LexicalOnChangePlugin from "@lexical/react/LexicalOnChangePlugin";
import { useRef, forwardRef } from "react";

import { useSharedHistoryContext } from "./context/SharedHistoryContext";
import CharacterStylesPopupPlugin from "./plugins/CharacterStylesPopupPlugin";
import KeywordsPlugin from "./plugins/KeywordsPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";

import TabFocusPlugin from "./plugins/TabFocusPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ContentEditable from "./ui/ContentEditable";
import Placeholder from "./ui/Placeholder";
import styles from "./Editor.module.css";

export type EditorProps = {
  editorStateJSON: InitialEditorStateType;
  onChange?: (editorState: EditorState, editor: LexicalEditor) => void;
};

const Editor = (
  { editorStateJSON, onChange }: EditorProps,
  ref: ForwardedRef<EditorState | undefined | null>
) => {
  const { historyState } = useSharedHistoryContext();
  const text = "Enter some rich text...";
  const placeholder = <Placeholder>{text}</Placeholder>;
  const scrollRef = useRef(null);

  return (
    <>
      <div className={`${styles["editor-container"]}`} ref={scrollRef}>
        <AutoFocusPlugin />
        <LexicalClearEditorPlugin />
        <KeywordsPlugin />
        <AutoScrollPlugin scrollRef={scrollRef} />
        <HistoryPlugin externalHistoryState={historyState} />
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={placeholder}
          initialEditorState={
            editorStateJSON === "" ? undefined : editorStateJSON
          }
        />
        {/* @ts-ignore: `transformers` is expected but doesn't know what is that for now */}
        <LexicalMarkdownShortcutPlugin />
        <ListPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <CharacterStylesPopupPlugin />
        <TabFocusPlugin />
      </div>
      <ToolbarPlugin />
      <LexicalOnChangePlugin
        onChange={
          onChange
            ? onChange
            : ref
            ? (editorState) => {
                if ("current" in ref) {
                  ref.current = editorState;
                }
              }
            : () => {}
        }
      />
    </>
  );
};

export default forwardRef(Editor);
