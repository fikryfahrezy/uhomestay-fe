import type { ImageOut } from "@/services/images";
import Image from "next/image";
import { RiCloseLine } from "react-icons/ri";
import { UniversalPortal } from "@/lib/react-portal-universal";
import IconButton from "cmnjg-sb/dist/iconbutton";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type GalleryViewModalProps = {
  prevData: ImageOut;
  isOpen: boolean;
  onCancel: () => void;
  removeBtn?: JSX.Element;
};

const GalleryViewModal = ({
  prevData,
  removeBtn,
  isOpen = false,
  onCancel = defaultFunc,
}: GalleryViewModalProps) => {
  const { description, url } = prevData;

  const onClose = () => {
    onCancel();
  };

  return isOpen ? (
    <UniversalPortal selector="#modal">
      <div className={styles.modal}>
        <div className={styles.modalBody}>
          <p>
            <strong>Deskripsi:</strong>
          </p>
          <p className={styles.bannerDescription}>{description || "-"}</p>
          <div className={styles.bannerContainer}>
            <Image
              layout="fill"
              alt="Photo"
              objectFit="contain"
              priority={true}
              src={url ? url : "/images/image/login-bg.svg"}
              className={styles.bannerImg}
            />
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
