import React from "react"
import { RiCloseLine } from "react-icons/ri";
import ModalBackdrop from "../modalbackdrop";
import IconButton from "../iconbutton";
import styles from "./Styles.module.css";

type DrawerProps = JSX.IntrinsicElements["div"] & {
  isOpen: boolean;
  onClose: () => void;
  withBackdrop?: boolean;
};

const Drawer = ({
  children,
  className,
  onClose = () => {},
  withBackdrop = true,
  isOpen = false,
  ...restProps
}: DrawerProps) => {
  return (
    <div
      {...restProps}
      className={`${styles.drawer} ${
        isOpen ? `${styles.open} test__drawer__open` : ""
      } ${className ? className : ""}`}
    >
      {withBackdrop ? (
        <ModalBackdrop
          className={styles.backdrop}
          isOpen={isOpen}
          onClick={() => onClose()}
        />
      ) : (
        <></>
      )}
      <div className={`${styles.drawerContent} ${isOpen ? styles.open : ""}`}>
        <div className={styles.btnContainer}>
          <IconButton
            aria-label="drawer close button"
            className={styles.closeBtn}
            onClick={onClose}
            data-testid="drawer-close-btn"
          >
            <RiCloseLine />
          </IconButton>
        </div>
        <div className={styles.drawerBody}>{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
