/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from "react";
import styles from "./Styles.module.css";

type PlaceholderProps = {
  children: JSX.Element | string | (JSX.Element | string)[];
  className?: string;
};

export default function Placeholder({ children, className }: PlaceholderProps) {
  return (
    <div className={className || styles["Placeholder__root"]}>{children}</div>
  );
}
