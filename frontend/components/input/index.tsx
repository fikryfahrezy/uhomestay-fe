import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import Label from "@/components/label";
import styles from "./Styles.module.css";

type InputProps = JSX.IntrinsicElements["input"] & {
  label?: string;
  note?: string;
  isInvalid?: boolean;
};

const Input = (
  {
    id,
    className,
    required,
    readOnly,
    type,
    isInvalid = false,
    label = "",
    note = "",
    ...restProps
  }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) => (
  <>
    {label && type !== "hidden" ? (
      <Label readOnly={readOnly} required={required} note={note} htmlFor={id}>
        {label}
      </Label>
    ) : (
      <></>
    )}
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
