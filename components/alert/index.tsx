import React from "react";
import {
  RiErrorWarningFill,
  RiInformationFill,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import styles from "./Styles.module.css";

export type AlertProps = JSX.IntrinsicElements["div"] & {
  status: "error" | "success" | "warning" | "info" | undefined;
  withIcon: boolean;
  render?: () => JSX.Element | null;
};

const Alert = ({
  status,
  children,
  className,
  withIcon = false,
  ...restProps
}: AlertProps) => {
  const { newStatus, newIcon: NewIcon } = (() => {
    let newStatus = styles.info;
    let newIcon = RiInformationFill;

    switch (status) {
      case "info":
        newStatus = styles.info;
        newIcon = RiInformationFill;
        break;
      case "success":
        newStatus = styles.success;
        newIcon = RiCheckboxCircleFill;
        break;
      case "warning":
        newStatus = styles.warning;
        newIcon = RiErrorWarningFill;
        break;
      case "error":
        newStatus = styles.error;
        newIcon = RiErrorWarningFill;
        break;
    }

    return { newStatus, newIcon };
  })();

  return (
    <div
      className={`${styles.container} ${newStatus} ${
        className ? className : ""
      }`}
      {...restProps}
    >
      {withIcon === true ? (
        <span className={styles.icon}>
          <NewIcon />
        </span>
      ) : (
        <></>
      )}
      {children}
    </div>
  );
};

export default Alert;
