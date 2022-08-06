import type { HTMLAttributes, Key } from "react";
import { cloneElement, useState, useEffect } from "react";
import styles from "./Styles.module.css";

export type LinkTreeProps = HTMLAttributes<HTMLElement> & {
  key?: Key;
  element?: JSX.Element;
  childrens?: LinkTreeProps[];
  isActive?: boolean;
  isLink?: boolean;
  isRoot?: boolean;
};

const LinkNode = ({
  element,
  childrens,
  className,
  isActive = false,
  isLink = false,
}: LinkTreeProps) => {
  const [collapse, setCollapse] = useState(true);

  const collapseToggle = () => {
    setCollapse((prevState) => !prevState);
  };

  useEffect(() => {
    setCollapse(isActive === false);
  }, [isActive]);

  return (
    <li className={`${className ? className : ""}`} onClick={(e) => {}}>
      {isLink === false ? (
        element !== undefined ? (
          cloneElement(element, {
            ...element.props,
            onClick: (e: MouseEvent) => {
              collapseToggle();
            },
          })
        ) : (
          <></>
        )
      ) : (
        element
      )}
      {Array.isArray(childrens) ? (
        <LinkTree
          isRoot={false}
          childrens={childrens}
          className={`${collapse ? styles.collapse : ""}`}
        />
      ) : (
        <></>
      )}
    </li>
  );
};

const LinkTree = ({
  className,
  childrens = [],
  isRoot = true,
}: LinkTreeProps) => {
  return (
    <ul
      className={`${isRoot === true ? styles.ulContainer : ""} ${styles.ul} ${
        className ? className : ""
      }`}
    >
      {childrens.map(({ key, className, ...restProps }) => {
        return (
          <LinkNode
            key={key}
            {...restProps}
            className={`${styles.linkNode} ${className ? className : ""}`}
          />
        );
      })}
    </ul>
  );
};

export default LinkTree;
