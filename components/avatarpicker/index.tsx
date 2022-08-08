import type { ChangeEvent, ForwardedRef } from "react";
import { forwardRef, useState, useRef, useEffect } from "react";
import Button from "../button";
import { RiFileEditLine, RiCloseLine } from "react-icons/ri";
import styles from "./Styles.module.css";

export const errNotImageFile = "Some File is Not Image File";

const defaultFunc = () => {};

type AvatarPickerProps = JSX.IntrinsicElements["input"] & {
  defaultSrc: string;
  text: string;
  onErr?: (message: string) => void;
  onRemove?: () => void;
};

const AvatarPicker = (
  {
    defaultSrc,
    className,
    onChange,
    style,
    disabled,
    src = "",
    text = "",
    onErr = defaultFunc,
    onRemove = defaultFunc,
    ...restProps
  }: AvatarPickerProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState(src);

  const inputFileRef = useRef<HTMLInputElement | null>(null);

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

  function validFileType(file: File) {
    return fileTypes.includes(file.type);
  }

  /**
   *
   * Ref:
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#examples
   *
   */
  function updateImageDisplay(e: ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;
    if (files === null) {
      return;
    }

    if (files.length === 0) {
      onErr(errNotImageFile);
    }

    const file = files[0];
    if (!validFileType(file)) {
      onErr(errNotImageFile);
      return;
    }

    setSelectedFile(file);
    if (typeof onChange === "function") {
      onChange(e);
    }
  }

  useEffect(() => {
    if (!selectedFile) {
      setImgUrl(src);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setImgUrl(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile, src]);

  return (
    <div
      style={style}
      className={`${styles.container} ${className ? className : ""}`}
    >
      <span className={styles.inputWrapper}>
        <input
          {...restProps}
          type="file"
          accept="image/*"
          multiple={false}
          disabled={disabled}
          onChange={updateImageDisplay}
          ref={(e) => {
            inputFileRef.current = e;

            if (typeof ref === "function") {
              return ref(e);
            }
          }}
          onClick={(e) => (e.currentTarget.value = "")}
        />
      </span>
      {!disabled && imgUrl !== "" ? (
        <Button
          type="button"
          leftIcon={<RiCloseLine />}
          className={`${styles.editBtn} ${styles.active}`}
          onClick={() => {
            setImgUrl("");
            onRemove();
          }}
        >
          <span className={styles.btnText}>{text}</span>
        </Button>
      ) : (
        <Button
          type="button"
          leftIcon={<RiFileEditLine />}
          className={`${styles.editBtn} ${
            disabled ? styles.editBtnDisabled : ""
          }`}
          onClick={() => {
            if (inputFileRef.current !== null) {
              inputFileRef.current.click();
              inputFileRef.current.value = "";
            }
          }}
        >
          <span className={styles.btnText}>{text}</span>
        </Button>
      )}
      <img
        src={imgUrl ? imgUrl : defaultSrc}
        className={styles.img}
        alt="Avatar Picker"
      />
    </div>
  );
};

export default forwardRef(AvatarPicker);
