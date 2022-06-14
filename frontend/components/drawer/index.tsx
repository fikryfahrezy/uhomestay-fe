import { RiCloseLine } from "react-icons/ri";
import ModalBackdrop from "@/components/modalbackdrop";
import IconButton from "@/components/iconbutton";
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
      className={`${styles.drawer} ${isOpen ? styles.open : ""} ${
        className ? className : ""
      }`}
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
