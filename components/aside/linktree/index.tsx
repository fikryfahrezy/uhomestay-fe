import type { HTMLAttributes, Key } from "react";

export type LinkTreeProps = HTMLAttributes<HTMLElement> & {
  key?: Key;
  element?: JSX.Element;
  childrens?: LinkTreeProps[];
  isActive?: boolean;
  isLink?: boolean;
  isRoot?: boolean;
};
