import type { ForwardedRef, HTMLAttributes, FormEvent } from "react";
import { useState, useRef, useEffect, forwardRef, memo } from "react";
import { RiAddLine } from "react-icons/ri";
import IconButton from "@/components/iconbutton";
import Label from "@/components/label";
import Button from "@/components/button";
import GalleryListItem from "@/layouts/gallerylistitem";
import styles from "./Styles.module.css";

export type SelectProp = JSX.IntrinsicElements["img"] & {
  key: unknown;
  value: unknown;
};

type DynamicImageSelectProps = HTMLAttributes<HTMLElement> & {
  onFieldDelete?: (deletedIdx: number, cb: () => void) => void;
  selects: SelectProp[];
  label?: string;
  isInvalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  errMsg?: string;
  uploadComponent?: (
    isOpen: boolean,
    close: () => void,
    cb: (url: string) => void
  ) => void;
};

const DynamicImageSelect = (
  {
    label,
    children,
    onMouseDown,
    selects,
    required,
    onChange,
    errMsg,
    disabled = false,
    isInvalid = false,
    defaultValue = "",
    uploadComponent = () => {},
    onFieldDelete = () => "x",
    ...restProps
  }: DynamicImageSelectProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const [isUploading, setUploading] = useState(false);
  const [selection, setSelection] = useState<SelectProp[]>([]);
  const [value, setValue] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputEventRef = useRef(new Event("change", { bubbles: true }));
  const prevSelectionKey = useRef<number>(0);
  const isMounted = useRef(false);

  const onAddSelection = (url: string) => {
    const newValue = value !== "" ? `${value}, ${url}` : url;

    setValue(newValue);
    setSelection((prevState) => [
      ...prevState,
      { key: ++prevSelectionKey.current, value: url, defaultValue: "" },
    ]);
    setUploading(false);
  };

  const onRemoveSelection = (idx: number) => () => {
    const newSelection = Array.from(selection);
    newSelection.splice(idx, 1);

    if (idx > prevSelectionKey.current) {
      prevSelectionKey.current = idx;
    }

    const tempValue = value.split(", ");
    tempValue.splice(idx, 1);

    const newValue = tempValue.join(", ");

    if (onFieldDelete !== undefined) {
      onFieldDelete(idx, () => {
        setValue(newValue);
        setSelection(newSelection);
      });
    }
  };

  const onUploading = () => {
    setUploading(true);
  };

  useEffect(() => {
    const newSelection = Array.isArray(selects)
      ? selects
      : [{ key: 0, value: "" }];
    const newSelectLen = newSelection.length;

    let newValue = "";
    for (let i = 0; i < newSelectLen; i++) {
      const { value } = newSelection[i];

      if (i === 0) {
        newValue = String(value);
        continue;
      }

      newValue = `${newValue}, ${value}`;
    }

    setValue(newValue);
    setSelection(newSelection);
  }, [selects]);

  useEffect(() => {
    const onChanging = (e: Event) => {
      if (typeof onChange === "function") {
        onChange(e as unknown as FormEvent<HTMLElement>);
      }
    };

    const inputEl = inputRef.current;
    if (inputEl !== null) {
      inputEl.addEventListener("change", onChanging);
    }

    return () => {
      if (inputEl !== null) {
        inputEl.removeEventListener("change", onChanging);
      }
    };
  }, [onChange]);

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.dispatchEvent(inputEventRef.current);
    }
  }, [value]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    uploadComponent(
      isUploading,
      () => setUploading((prevState) => !prevState),
      (url) => onAddSelection(url)
    );
  }, [isUploading]);

  return (
    <>
      <div className={styles.contentContainer}>
        {label && (
          <Label disabled={disabled} required={required}>
            {label}
          </Label>
        )}
        {errMsg ? <p className={styles.errorMsg}>{errMsg}</p> : <></>}
        <div className={styles.selectContainer}>
          {selection.map(({ key, value }, i) => (
            <div key={key} className={styles.cardWrapper}>
              <GalleryListItem
                imgData={{
                  url: String(value),
                  id: 0,
                  name: "",
                  description: "",
                }}
                withDescription={false}
                removeBtn={
                  disabled ? (
                    <></>
                  ) : (
                    <Button
                      colorScheme="red"
                      type="button"
                      onClick={onRemoveSelection(i)}
                    >
                      Hapus
                    </Button>
                  )
                }
              />
            </div>
          ))}
          {disabled === false ? (
            <IconButton
              type="button"
              className={styles.btn}
              onClick={() => onUploading()}
              data-testid="dynamic-select-btn"
            >
              <RiAddLine />
            </IconButton>
          ) : (
            <></>
          )}
        </div>
        <input
          {...restProps}
          ref={(r) => {
            inputRef.current = r;

            if (typeof ref === "function") {
              return ref(r);
            }
          }}
          required={required}
          className={styles.input}
          value={value}
          onChange={() => {}}
        />
      </div>
    </>
  );
};

export default memo(forwardRef(DynamicImageSelect), (prevValue, nextProps) => {
  return prevValue.selects === nextProps.selects;
});
