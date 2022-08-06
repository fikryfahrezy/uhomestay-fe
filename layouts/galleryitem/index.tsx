import type { ImageOut } from "@/services/images";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type GalleryItemProps = {
  imgData: ImageOut;
  onClick?: (imgData: ImageOut) => void;
};

const GalleryItem = ({ imgData, onClick = defaultFunc }: GalleryItemProps) => {
  const { url } = imgData;

  return (
    <div
      className={styles.cardContent}
      onClick={() => onClick(imgData)}
      data-testid="gallery-img-container"
    >
      {url ? (
        <img
          alt="Photo"
          src={url ? url : "/images/image/login-bg.svg"}
          className={styles.bannerImg}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default GalleryItem;
