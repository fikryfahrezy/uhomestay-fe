/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from "react";
import joinClasses from "../../utils/join-classes";
import styles from "./Styles.module.css";

type ButtonProps = {
  "data-test-id"?: string;
  children: JSX.Element | string | (JSX.Element | string)[];
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  small?: boolean;
  title?: string;
};

export default function Button({
  "data-test-id": dataTestId,
  children,
  className,
  onClick,
  disabled,
  small,
  title,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={joinClasses(
        styles["Button__root"],
        disabled && styles["Button__disabled"],
        small && styles["Button__small"],
        className
      )}
      onClick={onClick}
      title={title}
      aria-label={title}
      {...(dataTestId && { "data-test-id": dataTestId })}
    >
      {children}
    </button>
  );
}
