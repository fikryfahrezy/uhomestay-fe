import type { ComponentProps, ForwardedRef } from "react";
import { forwardRef } from "react";
import { chakra } from "@chakra-ui/system";
import styles from "./Styles.module.css";

type LinkButtonProps = ComponentProps<typeof chakra.a> & {
  colorScheme: "red" | "green";
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
};

const LinkButton = (
  {
    colorScheme,
    leftIcon,
    rightIcon,
    className,
    children,
    ...restProps
  }: LinkButtonProps,
  ref: ForwardedRef<HTMLAnchorElement>,
) => {
  const scheme = (() => {
    let schemeClass = styles.defaultScheme;
    switch (colorScheme) {
      case "red":
        schemeClass = styles.redScheme;
        break;
      case "green":
        schemeClass = styles.greenScheme;
        break;
    }

    return `${styles.link} ${schemeClass} ${className ? className : ""}`;
  })();

  const newChildren = (
    <>
      {leftIcon ? <span>{leftIcon}</span> : <></>}
      {children}
      {rightIcon ? <span>{rightIcon}</span> : <></>}
    </>
  );

  return (
    <chakra.a {...restProps} ref={ref} className={scheme}>
      {newChildren}
    </chakra.a>
  );
};

export default forwardRef(LinkButton);
