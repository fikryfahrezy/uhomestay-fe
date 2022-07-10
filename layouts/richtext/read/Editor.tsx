/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { InitialEditorStateType } from "@lexical/react/LexicalRichTextPlugin";
import AutoFocusPlugin from "@lexical/react/LexicalAutoFocusPlugin";
import AutoScrollPlugin from "@lexical/react/LexicalAutoScrollPlugin";
import LexicalClearEditorPlugin from "@lexical/react/LexicalClearEditorPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import ListPlugin from "@lexical/react/LexicalListPlugin";
import LexicalMarkdownShortcutPlugin from "@lexical/react/LexicalMarkdownShortcutPlugin";
import RichTextPlugin from "@lexical/react/LexicalRichTextPlugin";
import { useRef } from "react";

import { useSharedHistoryContext } from "./context/SharedHistoryContext";
import KeywordsPlugin from "./plugins/KeywordsPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";

import TabFocusPlugin from "./plugins/TabFocusPlugin";
import ContentEditable from "./ui/ContentEditable";
import Placeholder from "./ui/Placeholder";
import styles from "./Editor.module.css";

export type EditorProps = {
  editorStateJSON: InitialEditorStateType;
  placeholder?: JSX.Element;
};

const Editor = ({ editorStateJSON, placeholder }: EditorProps) => {
  const { historyState } = useSharedHistoryContext();
  const text = "Tidak ada konten untuk sekarang...";

  const edtPlaceholder = placeholder ? (
    placeholder
  ) : (
    <Placeholder>{text}</Placeholder>
  );

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
          placeholder={edtPlaceholder}
          initialEditorState={
            editorStateJSON === "" ? undefined : editorStateJSON
          }
        />
        {/* @ts-ignore: `transformers` is expected but doesn't know what is that for now */}
        <LexicalMarkdownShortcutPlugin />
        <ListPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <TabFocusPlugin />
      </div>
    </>
  );
};

export default Editor;
