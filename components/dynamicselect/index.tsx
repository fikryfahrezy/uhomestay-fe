import type {
  MouseEvent,
  ChangeEvent,
  ForwardedRef,
  HTMLAttributes,
  FormEvent,
} from "react";
import { useState, useRef, useEffect, forwardRef, memo } from "react";
import { RiAddLine, RiCloseLine } from "react-icons/ri";
import IconButton from "../iconbutton";
import Label from "../label";
import Select from "../select";
import styles from "./Styles.module.css";

type SelectProp = JSX.IntrinsicElements["select"] & {
  key: unknown;
  value: unknown;
};

type DynamicSelectProps = HTMLAttributes<HTMLElement> & {
  onFieldChange?: (
    currentValue: string,
    prevValue: string,
    e: ChangeEvent<HTMLSelectElement>,
  ) => void;
  onFieldDelete?: (deletedVal: string) => void;
  selects: SelectProp[];
  label?: string;
  isInvalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  errMsg?: string;
};

const DynamicSelect = (
  {
    label,
    children,
    onFieldChange,
    onMouseDown,
    selects,
    required,
    onChange,
    errMsg,
    disabled = false,
    isInvalid = false,
    defaultValue = "",
    onFieldDelete = () => {},
    ...restProps
  }: DynamicSelectProps,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const [selection, setSelection] = useState<SelectProp[]>([]);
  const [value, setValue] = useState("");
  const prevValueRef = useRef<string>(String(defaultValue));
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputEventRef = useRef(new Event("change", { bubbles: true }));

  /**
   * @type {import("react").MutableRefObject<number>}
   */
  const prevSelectionKey = useRef<number>(0);

  const onAddSelection = () => {
    const newValue = value !== "" ? `${value}, ${""}` : "";

    setValue(newValue);
    setSelection((prevState) => [
      ...prevState,
      { key: ++prevSelectionKey.current, value: "", defaultValue: "" },
    ]);
  };

  const onRemoveSelection = (idx: number) => () => {
    const newSelection = Array.from(selection);
    const deleted = newSelection.splice(idx, 1);

    if (idx > prevSelectionKey.current) {
      prevSelectionKey.current = idx;
    }

    const tempValue = value.split(", ");
    tempValue.splice(idx, 1);

    const newValue = tempValue.join(", ");

    setValue(newValue);
    setSelection(newSelection);

    let deletedVal = String(defaultValue);
    if (deleted.length !== 0) {
      deletedVal = String(deleted[0].value);
    }

    if (onFieldDelete !== undefined) {
      onFieldDelete(deletedVal);
    }
  };

  const onSelectChange =
    (idx: number) => (e: ChangeEvent<HTMLSelectElement>) => {
      const newSelection = Array.from(selection);
      const currVal = e.target.value;

      if (idx > prevSelectionKey.current) {
        prevSelectionKey.current = idx;
      }

      newSelection.splice(idx, 1, { key: selection[idx].key, value: currVal });

      const tempValue = value.split(", ");
      tempValue.splice(idx, 1, currVal);

      const newValue = tempValue.join(", ");

      setValue(newValue);
      setSelection(newSelection);

      if (onFieldChange !== undefined) {
        onFieldChange(currVal, prevValueRef.current, e);
      }
    };

  const onSelectMouseDown =
    (idx: number) =>
    (e: MouseEvent<HTMLSelectElement, globalThis.MouseEvent>) => {
      const select = selection[idx]?.value;
      prevValueRef.current = select ? String(select) : String(defaultValue);

      if (onMouseDown !== undefined) {
        onMouseDown(e);
      }
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

  return (
    <div className={styles.contentContainer}>
      {label && (
        <Label disabled={disabled} required={required}>
          {label}
        </Label>
      )}
      {errMsg ? <p className={styles.errorMsg}>{errMsg}</p> : <></>}
      {selection.map(({ key, defaultValue }, i) => (
        <div className={styles.selectContainer} key={key}>
          <Select
            defaultValue={defaultValue}
            disabled={disabled}
            onChange={onSelectChange(i)}
            onMouseDown={onSelectMouseDown(i)}
            className={styles.select}
            isInvalid={isInvalid}
          >
            {children}
          </Select>
          {disabled === false ? (
            <IconButton
              type="button"
              colorScheme="red"
              className={styles.selectBtn}
              onClick={onRemoveSelection(i)}
            >
              <RiCloseLine />
            </IconButton>
          ) : (
            <></>
          )}
        </div>
      ))}
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
      {disabled === false ? (
        <IconButton
          type="button"
          className={styles.btn}
          onClick={onAddSelection}
          data-testid="dynamic-select-btn"
        >
          <RiAddLine />
        </IconButton>
      ) : (
        <></>
      )}
    </div>
  );
};

export default memo(forwardRef(DynamicSelect), (prevValue, nextProps) => {
  return prevValue.selects === nextProps.selects;
});
