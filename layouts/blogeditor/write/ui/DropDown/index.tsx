/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { UniversalPortal } from "@/lib/react-portal-universal";

import styles from "./Styles.module.css";

type DropDownProps = {
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconClassName?: string;
  buttonLabel?: string;
  children: JSX.Element | string | (JSX.Element | string)[];
};

export default function DropDown({
  buttonLabel,
  buttonAriaLabel,
  buttonClassName,
  buttonIconClassName,
  children,
}: DropDownProps) {
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [showDropDown, setShowDropDown] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    const dropDown = dropDownRef.current;

    if (showDropDown && button !== null && dropDown !== null) {
      const { top, left } = button.getBoundingClientRect();
      const height = dropDown.clientHeight;
      dropDown.style.top = `${top - 10 - height}px`;
      dropDown.style.left = `${Math.min(
        left,
        window.innerWidth - dropDown.offsetWidth - 20
      )}px`;
    }
  }, [dropDownRef, buttonRef, showDropDown]);

  useEffect(() => {
    const button = buttonRef.current;

    if (button !== null && showDropDown) {
      const handle = (event: MouseEvent) => {
        const target = event.target;
        if (!button.contains(target as Node)) {
          setShowDropDown(false);
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, buttonRef, showDropDown]);

  return (
    <>
      <button
        aria-label={buttonAriaLabel || buttonLabel}
        className={buttonClassName}
        onClick={() => setShowDropDown(!showDropDown)}
        ref={buttonRef}
      >
        {buttonIconClassName && <span className={buttonIconClassName} />}
        {buttonLabel && (
          <span
            className={`${styles["text"]} ${styles["dropdown-button-text"]}`}
          >
            {buttonLabel}
          </span>
        )}
        <i className={styles["chevron-down"]} />
      </button>

      {showDropDown && (
        <UniversalPortal selector="#lexical-portal">
          <div className={styles["dropdown"]} ref={dropDownRef}>
            {children}
          </div>
        </UniversalPortal>
      )}
    </>
  );
}
