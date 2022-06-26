import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import styles from "./Styles.module.css";

type SelectProps = JSX.IntrinsicElements["select"] & {
  label?: string;
  isInvalid?: boolean;
};

const Select = (
  {
    children,
    className,
    style,
    required,
    id,
    disabled,
    isInvalid = false,
    label = "",
    ...restProps
  }: SelectProps,
  ref: ForwardedRef<HTMLSelectElement>
) => (
  <>
    {label ? (
      <>
        {required && !disabled ? (
          <span style={{ color: "#ff0000" }}>*</span>
        ) : (
          <></>
        )}
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      </>
    ) : (
      <></>
    )}
    <div
      style={style}
      className={`${styles.selectContainer} ${
        isInvalid ? styles.invalidInput : ""
      } ${disabled ? styles.readOnlySelect : ""} ${className ? className : ""}`}
    >
      <select
        {...restProps}
        ref={ref}
        className={styles.select}
        required={required}
        disabled={disabled}
        id={id}
        data-testid="select-comp"
      >
        {children}
      </select>
      {!disabled ? (
        <div className={styles.iconContainer}>
          <RiArrowDownSLine />
        </div>
      ) : (
        <></>
      )}
    </div>
  </>
);

export default forwardRef(Select);
