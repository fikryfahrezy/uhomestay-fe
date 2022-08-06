// import type { DetailedReactHTMLElement, MouseEventHandler } from "react";
import type { LinkProps } from "next/link";
import { useState, useEffect, cloneElement } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Children } from "react";

/**
 * Ref:
 * https://github.com/vercel/next.js/tree/canary/examples/active-class-name
 *
 */

type ActiveLinkProps = LinkProps & {
  activeClassName: string;
  children: JSX.Element;
};

const ActiveLink = ({
  children,
  activeClassName,
  ...props
}: ActiveLinkProps) => {
  const { asPath, isReady } = useRouter();

  const child = Children.only(children);
  const childClassName = child.props.className ? child.props.className : "";
  const [className, setClassName] = useState(childClassName);

  useEffect(() => {
    // Check if the router fields are updated client-side
    if (isReady) {
      // Dynamic route will be matched via props.as
      // Static route will be matched via props.href
      const linkPathname = new URL(
        String(props.as ? props.as : props.href),
        location.href
      ).pathname;

      // Using URL().pathname to get rid of query and hash
      const activePathname = new URL(asPath, location.href).pathname;

      const newClassName =
        linkPathname === activePathname
          ? `${childClassName} ${activeClassName}`.trim()
          : childClassName;

      if (newClassName !== className) {
        setClassName(newClassName);
      }
    }
  }, [
    asPath,
    isReady,
    props.as,
    props.href,
    childClassName,
    activeClassName,
    setClassName,
    className,
  ]);

  return (
    <Link {...props}>
      {cloneElement(child, {
        className: className ? className : null,
      })}
    </Link>
  );
};

export default ActiveLink;
