import type {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ForwardedRef,
  ChangeEvent,
} from "react";
import { forwardRef, useState, useRef, useEffect } from "react";
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
    label = "",
    note = "",
    isInvalid = false,
    onErr = defaultFunc,
    ...restProps
  }: ImagePickerProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const [filesName, setFilesName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");
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

  const onPick = (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    setSelectedFile(files[0]);
  };

  useEffect(() => {
    if (!selectedFile) {
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setImgUrl(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  return (
    <>
      {label ? (
        <Label disabled={disabled} required={required} note={note} htmlFor={id}>
          {label}
        </Label>
      ) : (
        <></>
      )}
      {disabled === true ? (
        <></>
      ) : (
        <>
          {errMsg ? <p className={styles.errorMsg}>{errMsg}</p> : <></>}
          <div
            style={style}
            className={`${styles.inputContainer} ${
              isInvalid ? styles.invalidInput : ""
            } ${disabled ? styles.disabledInput : ""} ${
              className ? className : ""
            }`}
          >
            <p className={styles.p}>{filesName ? filesName : ""}</p>
            <Button
              type="button"
              className={styles.btn}
              onClick={() => inputFileRef.current?.click()}
            >
              {children}
            </Button>
            <span className={styles.inputWrapper}>
              <input
                {...restProps}
                type="file"
                accept="image/*"
                multiple={false}
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
      )}
      {imgUrl ? (
        <img src={imgUrl} className={styles.img} alt="Photo Preview" />
      ) : (
        <></>
      )}
    </>
  );
};

export default forwardRef(ImagePicker);
