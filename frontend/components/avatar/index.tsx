import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import { RiAccountCircleFill } from "react-icons/ri";
import styles from "./Styles.module.css";

const Avatar = (
  props: JSX.IntrinsicElements["button"],
  ref: ForwardedRef<HTMLButtonElement>
) => {
  return (
    <button
      {...props}
      ref={ref}
      aria-label="avatar icon"
      className={styles.avatarIcon}
    >
      <RiAccountCircleFill />
    </button>
  );
};

export default forwardRef(Avatar);
