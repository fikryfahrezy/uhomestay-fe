import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import Label from "../label";
import styles from "./Styles.module.css";

type InputProps = JSX.IntrinsicElements["input"] & {
  label?: string;
  note?: string;
  isInvalid?: boolean;
  errMsg?: string;
};

const Input = (
  {
    id,
    className,
    required,
    readOnly,
    type,
    errMsg,
    isInvalid = false,
    label = "",
    note = "",
    ...restProps
  }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) => (
  <>
    {label && type !== "hidden" ? (
      <Label readOnly={readOnly} required={required} note={note} htmlFor={id}>
        {label}
      </Label>
    ) : (
      <></>
    )}
    {errMsg ? <p className={styles.errorMsg}>{errMsg}</p> : <></>}
    <input
      {...restProps}
      ref={ref}
      id={id}
      readOnly={readOnly}
      type={type}
      className={`${styles.input} ${readOnly ? styles.readOnlyInput : ""} ${
        isInvalid ? styles.invalidInput : ""
      } ${className ? className : ""}`}
      required={required}
    />
  </>
);

export default forwardRef(Input);
