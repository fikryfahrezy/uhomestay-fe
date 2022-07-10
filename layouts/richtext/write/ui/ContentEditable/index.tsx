/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from "react";
import LexicalContentEditable from "@lexical/react/LexicalContentEditable";
import styles from "./Styles.module.css";

type ContentEditableProps = {
  className?: string;
};

export default function ContentEditable({ className }: ContentEditableProps) {
  return (
    <LexicalContentEditable
      className={className || styles["ContentEditable__root"]}
      testid="lexical-editor-rich-write"
    />
  );
}
