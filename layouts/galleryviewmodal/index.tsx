import type { ImageOut } from "@/services/images";
import { RiCloseLine } from "react-icons/ri";
import { UniversalPortal } from "@/lib/react-portal-universal";
import IconButton from "@/components/iconbutton";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type GalleryViewModalProps = {
  prevData: ImageOut;
  isOpen: boolean;
  onCancel: () => void;
  removeBtn?: JSX.Element;
  withDescription?: boolean;
};

const GalleryViewModal = ({
  prevData,
  removeBtn,
  isOpen = false,
  onCancel = defaultFunc,
  withDescription = true,
}: GalleryViewModalProps) => {
  const { description, url } = prevData;

  const onClose = () => {
    onCancel();
  };

  return isOpen ? (
    <UniversalPortal selector="#modal">
      <div className={styles.modal}>
        <div className={styles.modalBody}>
          {withDescription ? (
            <>
              <p>
                <strong>Deskripsi:</strong>
              </p>
              <p className={styles.bannerDescription}>{description || "-"}</p>
            </>
          ) : (
            <></>
          )}
          <div className={styles.bannerContainer}>
            {isOpen ? (
              <img
                alt="Photo"
                src={url ? url : "/images/image/login-bg.svg"}
                className={styles.bannerImg}
              />
            ) : (
              <></>
            )}
          </div>
          <div className={styles.buttonContainer}>
            {removeBtn ? removeBtn : <></>}
            <IconButton type="button" onClick={() => onClose()}>
              <RiCloseLine />
            </IconButton>
          </div>
        </div>
      </div>
    </UniversalPortal>
  ) : (
    <></>
  );
};

export default GalleryViewModal;
