import type {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ForwardedRef,
  ChangeEvent,
} from "react";
import React, { forwardRef, useState, useRef, useEffect } from "react";
import Label from "../label";
import Button from "../button";
import styles from "./Styles.module.css";

export const errNotImageFile = "Some File is Not Image File";

const defaultFunc = () => {};

type ImagePickerProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string;
  note?: string;
  isInvalid: boolean;
  errMsg?: string;
  onErr?: (message: string) => void;
  onPick?: (files: File[]) => void;
};

const ImagePicker = (
  {
    className,
    style,
    required,
    id,
    children,
    onChange,
    disabled,
    errMsg,
    src = "",
    value = "",
    label = "",
    note = "",
    isInvalid = false,
    onErr = defaultFunc,
    onPick = defaultFunc,
    ...restProps
  }: ImagePickerProps,
  ref: ForwardedRef<HTMLInputElement>,
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

    // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types
    const fileTypes = [
      "image/apng",
      "image/bmp",
      "image/gif",
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/svg+xml",
      "image/tiff",
      "image/webp",
      "image/x-icon",
    ];

    const fileObjs: File[] = [];
    let names = "";

    for (let i = 0; i < filesLen; i++) {
      const file = files[i];

      if (!fileTypes.includes(file.type)) {
        onErr(errNotImageFile);
        return;
      }

      fileObjs.push(file);

      if (i !== filesLen - 1) {
        names += `${file.name}, `;
        continue;
      }

      names += file.name;
    }

    setFilesName(names);
    onPick(fileObjs);

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
      {errMsg ? <p className={styles.errorMsg}>{errMsg}</p> : <></>}
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
            accept="image/*"
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

export default forwardRef(ImagePicker);
