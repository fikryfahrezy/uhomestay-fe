/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


import { ListItemNode, ListNode } from "@lexical/list";
import { OverflowNode } from "@lexical/overflow";
import { HeadingNode } from "@lexical/rich-text";

import { KeywordNode } from "./KeywordNode";
import { TypeaheadNode } from "./TypeaheadNode";

const PlaygroundNodes: Array<unknown> = [
  HeadingNode,
  ListNode,
  ListItemNode,
  OverflowNode,
  TypeaheadNode,
  KeywordNode,
];

export default PlaygroundNodes;
