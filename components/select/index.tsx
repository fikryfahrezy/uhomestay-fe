import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import Label from "../label";
import styles from "./Styles.module.css";

type SelectProps = JSX.IntrinsicElements["select"] & {
  label?: string;
  note?: string;
  isInvalid?: boolean;
  errMsg?: string;
};

const Select = (
  {
    children,
    className,
    style,
    required,
    id,
    disabled,
    errMsg,
    isInvalid = false,
    note = "",
    label = "",
    ...restProps
  }: SelectProps,
  ref: ForwardedRef<HTMLSelectElement>,
) => (
  <>
    {label ? (
      <Label disabled={disabled} required={required} note={note} htmlFor={id}>
        {label}
      </Label>
    ) : (
      <></>
    )}
    {errMsg ? <p className={styles.errorMsg}>{errMsg}</p> : <></>}
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
