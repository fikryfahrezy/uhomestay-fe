import type { UseToastReturn } from "./useToast";
import React from "react";
import { RiCloseLine } from "react-icons/ri";
import { UniversalPortal } from "@/lib/react-portal-universal";
import Alert from "../alert";
import IconButton from "../iconbutton";

import styles from "./Styles.module.css";

const Toast = ({ isOpen, toasts }: UseToastReturn["props"]) => {
  return isOpen ? (
    <UniversalPortal selector="#modal">
      <div className={styles.alertContainer}>
        {toasts.map(({ id, status, render, onCloseToast }) => {
          return (
            <Alert
              key={id}
              withIcon={true}
              status={status}
              className={styles.alert}
            >
              <div className={styles.alertBody}>
                {typeof render === "function" ? render() : <></>}
              </div>
              <IconButton
                className={styles.closeButton}
                onClick={() => onCloseToast()}
              >
                <RiCloseLine />
              </IconButton>
            </Alert>
          );
        })}
      </div>
    </UniversalPortal>
  ) : (
    <></>
  );
};

export default Toast;

export * from "./useToast";
