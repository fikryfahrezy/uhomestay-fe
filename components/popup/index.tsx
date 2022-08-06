import { useState, cloneElement, useRef } from "react";
import styles from "./Styles.module.css";

type PopUpProps = JSX.IntrinsicElements["div"] & {
  popUpContent: JSX.Element;
  popUpPosition?: string;
  children: JSX.Element;
};

const PopUp = ({
  className,
  children,
  popUpContent,
  popUpPosition,
  ...restProps
}: PopUpProps) => {
  const [isCollapse, setCollapse] = useState(true);

  const posStyle = (() => {
    switch (popUpPosition) {
      case "top-left":
        return styles.topLeft;
      case "top-right":
        return styles.topRight;
      case "bottom-right":
        return styles.bottomRight;
      default:
        return styles.bottomLeft;
    }
  })();

  const ref = useRef<HTMLElement>();

  const onParentBlur = (e: MouseEvent) => {
    setCollapse(true);

    if (
      children &&
      typeof children !== "number" &&
      typeof children !== "string" &&
      typeof children !== "boolean" &&
      "props" in children &&
      typeof children.props.onBlur === "function"
    ) {
      children.props.onBlur(e);
    }
  };

  const onParentClick = (e: MouseEvent) => {
    setCollapse((prevState) => !prevState);

    if (
      children &&
      typeof children !== "number" &&
      typeof children !== "string" &&
      typeof children !== "boolean" &&
      "props" in children &&
      typeof children.props.onBlur === "function"
    ) {
      children.props.onClick(e);
    }
  };

  return (
    <div
      {...restProps}
      className={`${styles.popUpContainer} ${className ? className : ""}`}
      data-testid="popup-container"
    >
      {typeof children !== "number" &&
      typeof children !== "string" &&
      typeof children !== "boolean" ? (
        cloneElement(
          children,
          {
            ref,
            onBlur: onParentBlur,
            onClick: onParentClick,
          },
          children ? children.props.children : null
        )
      ) : (
        <></>
      )}
      <div
        className={`${styles.popUpContent} ${posStyle} ${
          isCollapse ? `${styles.hide} test__popup__hidden` : ""
        }`}
      >
        <div
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            ref.current?.blur();
          }}
        >
          {popUpContent}
        </div>
      </div>
    </div>
  );
};

export default PopUp;
