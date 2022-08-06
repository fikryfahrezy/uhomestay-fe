import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import styles from "./Styles.module.css";

type ButtonProps = JSX.IntrinsicElements["button"] & {
  colorScheme?: "red" | "green";
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
};

const Button = (
  {
    colorScheme,
    leftIcon,
    rightIcon,
    className,
    children,
    ...restProps
  }: ButtonProps,
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
      {leftIcon ? <span>{leftIcon}</span> : <></>}
      {children}
      {rightIcon ? <span>{rightIcon}</span> : <></>}
    </button>
  );
};

export default forwardRef(Button);
