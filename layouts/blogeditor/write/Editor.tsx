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
import type { UploadImgFunc } from "./plugins/ToolbarPlugin";

import AutoFocusPlugin from "@lexical/react/LexicalAutoFocusPlugin";
import AutoScrollPlugin from "@lexical/react/LexicalAutoScrollPlugin";
import LexicalClearEditorPlugin from "@lexical/react/LexicalClearEditorPlugin";
import HashtagsPlugin from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LinkPlugin from "@lexical/react/LexicalLinkPlugin";
import ListPlugin from "@lexical/react/LexicalListPlugin";
import LexicalMarkdownShortcutPlugin from "@lexical/react/LexicalMarkdownShortcutPlugin";
import RichTextPlugin from "@lexical/react/LexicalRichTextPlugin";
import LexicalOnChangePlugin from "@lexical/react/LexicalOnChangePlugin";
import { useRef, forwardRef } from "react";

import { useSharedHistoryContext } from "./context/SharedHistoryContext";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import CharacterStylesPopupPlugin from "./plugins/CharacterStylesPopupPlugin";
import ClickableLinkPlugin from "./plugins/ClickableLinkPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import EmojisPlugin from "./plugins/EmojisPlugin";
import HorizontalRulePlugin from "./plugins/HorizontalRulePlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import KeywordsPlugin from "./plugins/KeywordsPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import MentionsPlugin from "./plugins/MentionsPlugin";

import TabFocusPlugin from "./plugins/TabFocusPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import TwitterPlugin from "./plugins/TwitterPlugin";
import YouTubePlugin from "./plugins/YouTubePlugin";
import ContentEditable from "./ui/ContentEditable";
import Placeholder from "./ui/Placeholder";
import styles from "./Editor.module.css";

export type EditorProps = {
  uploadImgFunc: UploadImgFunc;
  editorStateJSON: InitialEditorStateType;
  onChange?: (editorState: EditorState, editor: LexicalEditor) => void;
};

const Editor = (
  { uploadImgFunc, editorStateJSON, onChange }: EditorProps,
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
        <MentionsPlugin />
        <EmojisPlugin />
        <HashtagsPlugin />
        <KeywordsPlugin />
        <AutoLinkPlugin />
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
        <CodeHighlightPlugin />
        <ListPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <ImagesPlugin />
        <LinkPlugin />
        <TwitterPlugin />
        <YouTubePlugin />
        <ClickableLinkPlugin />
        <HorizontalRulePlugin />
        <CharacterStylesPopupPlugin />
        <TabFocusPlugin />
      </div>
      <ToolbarPlugin uploadImgFunc={uploadImgFunc} />
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
