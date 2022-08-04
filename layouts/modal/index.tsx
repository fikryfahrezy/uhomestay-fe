import { RiAlertLine } from "react-icons/ri";
import Button from "@/components/button";
import ModalContainer from "@/layouts/modalcontainer";
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
  return (
    <ModalContainer isOpen={isOpen} onClose={onCancel}>
      {heading ? <h3>{heading}</h3> : <></>}
      <div className={styles.modalContent}>
        <span className={styles.modalIcon}>
          {icon ? icon : <RiAlertLine />}
        </span>
        {children}
      </div>
      <div className={styles.buttonContainer}>
        <Button
          colorScheme="green"
          onClick={onConfirm}
          data-testid="popup-modal-conf-btn"
        >
          Iya
        </Button>
        <Button
          colorScheme="red"
          onClick={onCancel}
          data-testid="popup-modal-conf-n-btn"
        >
          Tidak
        </Button>
      </div>
    </ModalContainer>
  );
};

export default Modal;
