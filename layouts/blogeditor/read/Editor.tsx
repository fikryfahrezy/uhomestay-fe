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
import HashtagsPlugin from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LinkPlugin from "@lexical/react/LexicalLinkPlugin";
import ListPlugin from "@lexical/react/LexicalListPlugin";
import LexicalMarkdownShortcutPlugin from "@lexical/react/LexicalMarkdownShortcutPlugin";
import RichTextPlugin from "@lexical/react/LexicalRichTextPlugin";
import { useRef } from "react";

import { useSharedHistoryContext } from "./context/SharedHistoryContext";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import ClickableLinkPlugin from "./plugins/ClickableLinkPlugin";
import EmojisPlugin from "./plugins/EmojisPlugin";
import KeywordsPlugin from "./plugins/KeywordsPlugin";
import MentionsPlugin from "./plugins/MentionsPlugin";

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
        <MentionsPlugin />
        <EmojisPlugin />
        <HashtagsPlugin />
        <KeywordsPlugin />
        <AutoLinkPlugin />
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
        <LinkPlugin />
        <ClickableLinkPlugin />
        <TabFocusPlugin />
      </div>
    </>
  );
};

export default Editor;
