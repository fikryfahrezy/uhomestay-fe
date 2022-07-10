/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { EditorConfig, LexicalNode, NodeKey } from "lexical";

import { TextNode } from "lexical";
import styles from "./Styles.module.css";

export class EmojiNode extends TextNode {
  __className: string;

  static getType() {
    return "emoji";
  }

  static clone(node: EmojiNode) {
    return new EmojiNode(node.__className, node.__text, node.__key);
  }

  constructor(className: string, text: string, key?: string) {
    super(text, key);
    this.__className = className;
  }

  createDOM(config: EditorConfig) {
    const dom = document.createElement("span");
    const inner = super.createDOM(config);
    dom.className = this.__className;
    inner.className = styles["emoji-inner"];
    dom.appendChild(inner);
    return dom;
  }

  updateDOM(prevNode: TextNode, dom: HTMLElement, config: EditorConfig) {
    const inner = dom.firstChild;
    if (inner === null) {
      return true;
    }
    super.updateDOM(prevNode, inner as HTMLElement, config);
    return false;
  }
}

export function $isEmojiNode(
  node: LexicalNode | null | undefined
): node is EmojiNode {
  return node instanceof EmojiNode;
}

export function $createEmojiNode(className: string, emojiText: string) {
  return new EmojiNode(className, emojiText).setMode("token");
}
