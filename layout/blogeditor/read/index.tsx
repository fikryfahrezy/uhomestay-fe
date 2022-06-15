/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { EditorProps } from "./Editor";
import LexicalComposer from "@lexical/react/LexicalComposer";
import * as React from "react";

import { SharedHistoryContext } from "./context/SharedHistoryContext";
import Editor from "./Editor";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import styles from "./index.module.css";

const App = ({ editorStateJSON, placeholder }: EditorProps) => {
  const initialConfig = {
    namespace: "PlaygroundEditor",
    nodes: [...PlaygroundNodes],
    onError: (error: unknown) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
    readOnly: true,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <div className={`editor-shell ${styles["editor-shell"]}`}>
          <Editor editorStateJSON={editorStateJSON} placeholder={placeholder} />
        </div>
      </SharedHistoryContext>
    </LexicalComposer>
  );
};

export default App;
