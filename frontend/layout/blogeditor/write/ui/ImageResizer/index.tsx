/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor } from "lexical";
import * as React from "react";
import { useRef } from "react";
import styles from "./Styles.module.css";

type ImageResizerProps = {
  editor: LexicalEditor;
  imageRef: { current: null | HTMLElement };
  maxWidth?: number;
  onResizeEnd: (width: "inherit" | number, height: "inherit" | number) => void;
  onResizeStart: () => void;
  setShowCaption: (v: boolean) => void;
  showCaption: boolean;
};

export default function ImageResizer({
  onResizeStart,
  onResizeEnd,
  imageRef,
  maxWidth,
  editor,
  showCaption,
  setShowCaption,
}: ImageResizerProps) {
  const buttonRef = useRef(null);
  return (
    <>
      {!showCaption && (
        <button
          className={styles["image-caption-button"]}
          ref={buttonRef}
          onClick={() => {
            setShowCaption(!showCaption);
          }}
        >
          Add Caption
        </button>
      )}
    </>
  );
}
