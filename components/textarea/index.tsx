import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import Label from "../label";
import styles from "./Styles.module.css";

type TextAreaProps = JSX.IntrinsicElements["textarea"] & {
  label?: string;
  note?: string;
  isInvalid?: boolean;
  type?: string;
  errMsg?: string;
};
const TextArea = (
  {
    id,
    className,
    required,
    readOnly,
    errMsg,
    isInvalid = false,
    type = "",
    label = "",
    note = "",
    ...restProps
  }: TextAreaProps,
  ref: ForwardedRef<HTMLTextAreaElement>,
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
    <textarea
      {...restProps}
      ref={ref}
      id={id}
      readOnly={readOnly}
      className={`${styles.textarea} ${
        readOnly ? styles.readOnlyTextarea : ""
      } ${isInvalid ? styles.invalidTextarea : ""} ${
        className ? className : ""
      }`}
      required={required}
    />
  </>
);

export default forwardRef(TextArea);
