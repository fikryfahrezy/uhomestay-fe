import React from "react"
import styles from "./Styles.module.css";

type ChipProps = JSX.IntrinsicElements["span"] & {
  isActive?: boolean;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
};

const Chip = ({
  className,
  children,
  leftIcon,
  rightIcon,
  isActive = false,
  ...restProps
}: ChipProps) => (
  <span
    {...restProps}
    className={`${styles.span} ${isActive ? styles.active : ""} ${
      className ? className : ""
    }`}
  >
    {leftIcon ? <span>{leftIcon}</span> : <></>}
    <span className={styles.chipText}>{children}</span>
    {rightIcon ? <span>{rightIcon}</span> : <></>}
    {isActive ? (
      <span className={styles.checkmark}>
        <div className={styles.checkmarkStem}></div>
        <div className={styles.checkmarkKick}></div>
      </span>
    ) : (
      <></>
    )}
  </span>
);

export default Chip;
