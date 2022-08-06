import type { ImageOut } from "@/services/images";
import { useState } from "react";
import GalleryItem from "@/layouts/galleryitem";
import GalleryViewModal from "@/layouts/galleryviewmodal";

type GalleryListItemProps = {
  imgData: ImageOut;
  removeBtn?: JSX.Element;
  withDescription?: boolean;
};

const GalleryListItem = ({
  imgData,
  removeBtn,
  withDescription,
}: GalleryListItemProps) => {
  const [isOpen, setOpen] = useState(false);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <GalleryItem imgData={imgData} onClick={() => onOpen()} />
      {isOpen ? (
        <GalleryViewModal
          isOpen={isOpen}
          prevData={imgData}
          removeBtn={removeBtn}
          withDescription={withDescription}
          onCancel={() => onClose()}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default GalleryListItem;
