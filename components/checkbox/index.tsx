import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import { RiCheckLine } from "react-icons/ri";
import styles from "./Styles.module.css";

type CheckboxProps = JSX.IntrinsicElements["input"] & {
  colorScheme?: "red" | "green" | "yellow";
  icon?: JSX.Element;
  isInvalid?: boolean;
  errMsg?: string;
};
/**
 * Ref:
 * https://stackoverflow.com/a/21968532/12976234
 */
const Checkbox = (
  {
    colorScheme,
    isInvalid,
    icon,
    id,
    children,
    type,
    className,
    errMsg,
    ...restProps
  }: CheckboxProps,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const scheme = (() => {
    let schemeClass = styles.greenScheme;

    switch (colorScheme) {
      case "red":
        schemeClass = styles.redScheme;
        break;
      case "green":
        schemeClass = styles.greenScheme;
        break;
      case "yellow":
        schemeClass = styles.yellowScheme;
        break;
    }

    return schemeClass;
  })();

  return (
    <>
      {errMsg ? <p className={styles.errorMsg}>{errMsg}</p> : <></>}
      <label htmlFor={id} className={styles.container}>
        <input
          {...restProps}
          ref={ref}
          type="checkbox"
          id={id}
          className={`${styles.checkbox} ${className ? className : ""}`}
        />
        <div
          className={`${styles.checkmarkContainer} ${
            isInvalid ? styles.invalidInput : ""
          }`}
        >
          <span className={`${scheme} ${styles.checkmark}`}>
            <div className={`${scheme} ${styles.checkmarkMask}`}></div>
            {icon ? icon : <RiCheckLine />}
          </span>
        </div>
        {children}
      </label>
    </>
  );
};

export default forwardRef(Checkbox);
