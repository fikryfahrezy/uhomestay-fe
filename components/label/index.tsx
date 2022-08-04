import React from "react"
import styles from "./Styles.module.css";

type LabelProps = JSX.IntrinsicElements["label"] & {
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  note?: string;
};

const Label = ({
  children,
  htmlFor,
  readOnly = false,
  required = false,
  disabled = false,
  note = "",
}: LabelProps) => {
  return (
    <>
      <>
        {required && !readOnly && !disabled ? (
          <span style={{ color: "#ff0000" }}>*</span>
        ) : (
          <></>
        )}
        <label
          className={`${styles.label} ${note === "" ? styles.mb10 : ""}`}
          htmlFor={htmlFor}
        >
          {children}
        </label>
      </>
      {note && !readOnly ? <p className={styles.mb10}>{note}</p> : <></>}
    </>
  );
};

export default Label;
