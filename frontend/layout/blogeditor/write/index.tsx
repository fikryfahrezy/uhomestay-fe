/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { MutableRefObject } from "react";
import type { EditorState } from "lexical";
import type { EditorProps } from "./Editor";
import type { UploadImgFunc } from "./plugins/ToolbarPlugin";

import LexicalComposer from "@lexical/react/LexicalComposer";
import * as React from "react";

import { SharedHistoryContext } from "./context/SharedHistoryContext";
import Editor from "./Editor";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import styles from "./index.module.css";

type AppProps = EditorProps & {
  editorStateRef: MutableRefObject<EditorState | undefined | null>;
};

const App = ({
  editorStateJSON,
  editorStateRef,
  onChange,
  uploadImgFunc = async (f: FormData) => ({ data: { url: "" } }),
}: AppProps) => {
  const initialConfig = {
    namespace: "PlaygroundEditor",
    nodes: [...PlaygroundNodes],
    onError: (error: unknown) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <div className={`editor-shell ${styles["editor-shell"]}`}>
          <Editor
            uploadImgFunc={uploadImgFunc}
            ref={editorStateRef}
            editorStateJSON={editorStateJSON}
            onChange={onChange}
          />
        </div>
      </SharedHistoryContext>
    </LexicalComposer>
  );
};

export default App;
