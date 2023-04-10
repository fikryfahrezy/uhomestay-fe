import type { DetailedHTMLProps, HTMLAttributes } from "react";
import { UniversalPortal } from "cmnjg-sb";
import { ModalBackdrop } from "cmnjg-sb";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type ModalProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  isOpen: boolean;
  onClose?: () => void;
};

const ModalContainer = ({
  isOpen = false,
  onClose = defaultFunc,
  children,
}: ModalProps) => {
  return isOpen ? (
    <UniversalPortal selector="#modal">
      <ModalBackdrop
        className={styles.backdrop}
        isOpen={isOpen}
        onClick={() => onClose()}
      />
      <div className={styles.modal}>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </UniversalPortal>
  ) : (
    <></>
  );
};

export default ModalContainer;
