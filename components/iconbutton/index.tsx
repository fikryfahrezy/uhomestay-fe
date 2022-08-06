import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import styles from "./Styles.module.css";

type ButtonProps = JSX.IntrinsicElements["button"] & {
  colorScheme?: "red" | "green";
};

const IconButton = (
  { colorScheme, children, className, ...restProps }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) => {
  const scheme = (() => {
    let schemeClass = styles.defaultBtn;
    switch (colorScheme) {
      case "red":
        schemeClass = styles.redBtn;
        break;
      case "green":
        schemeClass = styles.greenBtn;
        break;
    }

    return schemeClass;
  })();

  return (
    <button
      {...restProps}
      ref={ref}
      className={`${styles.button} ${scheme} ${className ? className : ""}`}
    >
      {children}
    </button>
  );
};

export default forwardRef(IconButton);
