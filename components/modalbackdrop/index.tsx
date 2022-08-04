import React from "react"
import styles from "./Styles.module.css";

type BackdropProps = JSX.IntrinsicElements["div"] & {
  isOpen: boolean;
};

const Backdrop = ({
  isOpen = false,
  className,
  ...restProps
}: BackdropProps) => (
  <div
    {...restProps}
    className={`${styles.backdrop} ${isOpen ? styles.open : ""} ${
      className ? className : ""
    }`}
  ></div>
);

export default Backdrop;
