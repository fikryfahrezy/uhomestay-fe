/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ElementFormatType, LexicalNode, NodeKey } from "lexical";

import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { DecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import * as React from "react";

import styles from "./Styles.module.css";

type YouTubeComponentProps = Readonly<{
  format: ElementFormatType | null;
  nodeKey: NodeKey;
  videoID: string;
}>;

function YouTubeComponent({ format, nodeKey, videoID }: YouTubeComponentProps) {
  return (
    <BlockWithAlignableContents format={format} nodeKey={nodeKey}>
      <div className={styles["embed-container"]}>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${videoID}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={true}
          title="YouTube video"
        />
      </div>
    </BlockWithAlignableContents>
  );
}

export class YouTubeNode extends DecoratorBlockNode<JSX.Element> {
  __id: string;

  static getType() {
    return "youtube";
  }

  static clone(node: YouTubeNode) {
    return new YouTubeNode(node.__id, node.__format, node.__key);
  }

  constructor(id: string, format?: ElementFormatType | null, key?: NodeKey) {
    super(format, key);
    this.__id = id;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return (
      <YouTubeComponent
        format={this.__format}
        nodeKey={this.getKey()}
        videoID={this.__id}
      />
    );
  }

  isTopLevel() {
    return true;
  }
}

export function $createYouTubeNode(videoID: string): YouTubeNode {
  return new YouTubeNode(videoID);
}

export function $isYouTubeNode(
  node: YouTubeNode | LexicalNode | null | undefined
): node is YouTubeNode {
  return node instanceof YouTubeNode;
}
