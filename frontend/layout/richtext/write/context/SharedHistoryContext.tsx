/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { HistoryState } from "@lexical/react/LexicalHistoryPlugin";
import { createEmptyHistoryState } from "@lexical/react/LexicalHistoryPlugin";
import * as React from "react";
import { createContext, useContext, useMemo } from "react";

type ContextShape = {
  historyState?: HistoryState;
};

const Context = createContext<ContextShape>({
  historyState: { current: null, redoStack: [], undoStack: [] },
});

type SharedHistoryContext = {
  children: JSX.Element | string | (JSX.Element | string)[];
};

export const SharedHistoryContext = ({ children }: SharedHistoryContext) => {
  const historyContext = useMemo(
    () => ({ historyState: createEmptyHistoryState() }),
    []
  );
  return <Context.Provider value={historyContext}>{children}</Context.Provider>;
};

export const useSharedHistoryContext = () => {
  return useContext(Context);
};
