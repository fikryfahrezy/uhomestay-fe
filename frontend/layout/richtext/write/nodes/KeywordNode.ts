/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { EditorConfig, LexicalNode } from "lexical";
import { TextNode } from "lexical";

export class KeywordNode extends TextNode {
  static getType() {
    return "keyword";
  }

  static clone(node: KeywordNode) {
    return new KeywordNode(node.__text, node.__key);
  }

  createDOM(config: EditorConfig) {
    const dom = super.createDOM(config);
    dom.style.cursor = "default";
    dom.className = "keyword";
    return dom;
  }

  canInsertTextBefore() {
    return false;
  }

  canInsertTextAfter() {
    return false;
  }

  isTextEntity() {
    return true;
  }
}

export function $createKeywordNode(keyword: string) {
  return new KeywordNode(keyword);
}

export function $isKeywordNode(node: LexicalNode | null | undefined) {
  return node instanceof KeywordNode;
}
