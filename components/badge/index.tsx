import React from "react"
import styles from "./Styles.module.css";

type BadgeProps = JSX.IntrinsicElements["span"] & {
  colorScheme: "red" | "green" | "yellow";
};

const Badge = ({ colorScheme, className, children }: BadgeProps) => {
  const scheme = (() => {
    let schemeClass = styles.defaultBadge;

    switch (colorScheme) {
      case "red":
        schemeClass = styles.redBadge;
        break;
      case "green":
        schemeClass = styles.greenBadge;
        break;
      case "yellow":
        schemeClass = styles.yellowBadge;
        break;
    }

    return schemeClass;
  })();
  return (
    <span className={`${className ? className : ""} ${styles.badge} ${scheme}`}>
      {children}
    </span>
  );
};

export default Badge;
