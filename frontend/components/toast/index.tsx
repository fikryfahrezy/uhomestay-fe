import type { ToastProps } from "./useToast";
import { RiCloseLine } from "react-icons/ri";
import { UniversalPortal } from "@/lib/react-portal-universal";
import Alert from "@/components/alert";
import IconButton from "@/components/iconbutton";

import styles from "./Styles.module.css";

const Toast = ({
  isOpen,
  status,
  onCloseToast,
  render,
}: Omit<ToastProps, "duration">) => {
  return isOpen ? (
    <UniversalPortal selector="#modal">
      <div className={styles.alertContainer}>
        <Alert withIcon={true} status={status} className={styles.alert}>
          <div className={styles.alertBody}>
            {typeof render === "function" ? render() : <></>}
          </div>
          <IconButton
            className={styles.closeButton}
            onClick={() => onCloseToast()}
          >
            <RiCloseLine />
          </IconButton>
        </Alert>
      </div>
    </UniversalPortal>
  ) : (
    <></>
  );
};

export default Toast;

export * from "./useToast";
