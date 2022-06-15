/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from "react";
import { useEffect, useRef } from "react";
import { UniversalPortal } from "@/lib/react-portal-universal";
import styles from "./Styles.module.css";

type PortalImplProps = {
  children: JSX.Element | string | (JSX.Element | string)[];
  closeOnClickOutside: boolean;
  onClose: () => void;
  title: string;
};

function PortalImpl({
  onClose,
  children,
  title,
  closeOnClickOutside,
}: PortalImplProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (modalRef.current !== null) {
      modalRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let modalOverlayElement: HTMLElement | null = null;
    const handler = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };

    const clickOutsideHandler = (event: MouseEvent) => {
      const target = event.target;
      if (
        modalRef.current !== null &&
        !modalRef.current.contains(target as Node) &&
        closeOnClickOutside
      ) {
        onClose();
      }
    };
    if (modalRef.current !== null) {
      modalOverlayElement = modalRef.current?.parentElement;
      if (modalOverlayElement !== null) {
        modalOverlayElement?.addEventListener("click", clickOutsideHandler);
      }
    }

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
      if (modalOverlayElement !== null) {
        modalOverlayElement?.removeEventListener("click", clickOutsideHandler);
      }
    };
  }, [closeOnClickOutside, onClose]);

  return (
    <div className={styles["Modal__overlay"]} role="dialog">
      <div className={styles["Modal__modal"]} tabIndex={-1} ref={modalRef}>
        <h2 className={styles["Modal__title"]}>{title}</h2>
        <button
          className={styles["Modal__closeButton"]}
          aria-label="Close modal"
          type="button"
          onClick={onClose}
        >
          X
        </button>
        <div className={styles["Modal__content"]}>{children}</div>
      </div>
    </div>
  );
}

type ModalProps = {
  children: JSX.Element | string | (JSX.Element | string)[];
  closeOnClickOutside?: boolean;
  onClose: () => void;
  title: string;
};

export default function Modal({
  onClose,
  children,
  title,
  closeOnClickOutside = false,
}: ModalProps) {
  return (
    <UniversalPortal selector="#lexical-portal">
      <PortalImpl
        onClose={onClose}
        title={title}
        closeOnClickOutside={closeOnClickOutside}
      >
        {children}
      </PortalImpl>
    </UniversalPortal>
  );
}
