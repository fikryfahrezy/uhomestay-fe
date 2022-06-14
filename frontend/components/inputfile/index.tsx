import type { ForwardedRef, ChangeEvent } from "react";
import { forwardRef, useState, useRef, useEffect } from "react";
import Label from "@/components/label";
import Button from "@/components/button";
import styles from "./Styles.module.css";

type InputFileProps = JSX.IntrinsicElements["input"] & {
  label?: string;
  note?: string;
  isInvalid?: boolean;
};

const InputFile = (
  {
    className,
    style,
    required,
    id,
    children,
    onChange,
    disabled,
    src = "",
    value = "",
    label = "",
    note = "",
    isInvalid = false,
    ...restProps
  }: InputFileProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const srcs = src.split(", ");
  const [filesName, setFilesName] = useState("");
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files === null) {
      return;
    }

    const filesLen = files.length;

    let names = "";
    for (let i = 0; i < filesLen; i++) {
      const { name } = files[i];

      if (i !== filesLen - 1) {
        names += `${name}, `;
        continue;
      }

      names += name;
    }

    setFilesName(names);

    if (onChange !== undefined) {
      onChange(e);
    }
  };

  useEffect(() => {
    if (disabled) {
      setFilesName(String(value));
      return;
    }

    setFilesName("");
  }, [value, disabled]);

  return (
    <>
      {label ? (
        <Label disabled={disabled} required={required} note={note} htmlFor={id}>
          {label}
        </Label>
      ) : (
        <></>
      )}
      <div
        style={style}
        className={`${styles.inputContainer} ${
          isInvalid ? styles.invalidInput : ""
        } ${disabled ? styles.disabledInput : ""} ${
          className ? className : ""
        }`}
      >
        {value !== "" ? (
          <span className={styles.p}>
            {String(value)
              .split(", ")
              .map((v, i) => {
                const href = srcs[i];
                return typeof href === "string" && href !== "" ? (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    key={i}
                    href={href}
                    className={`${styles.mr7} ${styles.link}`}
                  >
                    {v}
                  </a>
                ) : (
                  <span key={i} className={styles.mr7}>
                    {v}
                  </span>
                );
              })}
          </span>
        ) : (
          <p className={styles.p}>{filesName ? filesName : ""}</p>
        )}
        {disabled === true ? (
          <></>
        ) : (
          <Button
            type="button"
            className={styles.btn}
            onClick={() => inputFileRef.current?.click()}
          >
            {children}
          </Button>
        )}
        <span className={styles.inputWrapper}>
          <input
            {...restProps}
            type="file"
            ref={(e) => {
              inputFileRef.current = e;
              if (typeof ref === "function") {
                return ref(e);
              }
            }}
            onChange={onFileChange}
          />
        </span>
      </div>
    </>
  );
};

export default forwardRef(InputFile);
