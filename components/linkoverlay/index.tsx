import type { ComponentProps, ForwardedRef } from "react";
import { forwardRef } from "react";
import { chakra } from "@chakra-ui/system";
import styles from "./Styles.module.css";

export const LinkBox = ({
  children,
  className,
  ...restProps
}: JSX.IntrinsicElements["div"]) => {
  return (
    <div
      className={`${className ? className : ""} ${styles.linkBox}`}
      {...restProps}
    >
      {children}
    </div>
  );
};

type LinkOverlayProps = ComponentProps<typeof chakra.a>;

const LinkOverlayComp = (
  { children, className, ...restProps }: LinkOverlayProps,
  ref: ForwardedRef<HTMLAnchorElement>
) => {
  return (
    <chakra.a
      {...restProps}
      ref={ref}
      className={`${className ? className : ""} ${styles.linkOverlay}`}
    >
      {children}
    </chakra.a>
  );
};

export const LinkOverlay = forwardRef(LinkOverlayComp);
