import { RiAlertLine } from "react-icons/ri";
import { UniversalPortal } from "@/lib/react-portal-universal";
import Button from "@/components/button";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type ModalProps = JSX.IntrinsicElements["div"] & {
  heading: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: JSX.Element;
  children?: JSX.Element;
};

const Modal = ({
  icon,
  children,
  heading = "",
  isOpen = false,
  onConfirm = defaultFunc,
  onCancel = defaultFunc,
}: ModalProps) => {
  return isOpen ? (
    <UniversalPortal selector="#modal">
      <div className={styles.modal}>
        <div className={styles.modalBody}>
          {heading ? <h3>{heading}</h3> : <></>}
          <div className={styles.modalContent}>
            <span className={styles.modalIcon}>
              {icon ? icon : <RiAlertLine />}
            </span>
            {children}
          </div>
          <div className={styles.buttonContainer}>
            <Button colorScheme="green" onClick={onConfirm}>
              Iya
            </Button>
            <Button colorScheme="red" onClick={onCancel}>
              Tidak
            </Button>
          </div>
        </div>
      </div>
    </UniversalPortal>
  ) : (
    <></>
  );
};

export default Modal;
