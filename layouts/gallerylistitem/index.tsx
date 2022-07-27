import type { ImageOut } from "@/services/images";
import { useState } from "react";
import GalleryItem from "@/layouts/galleryitem";
import GalleryViewModal from "@/layouts/galleryviewmodal";

type GalleryListItemProps = {
  imgData: ImageOut;
};

const GalleryListItem = ({ imgData }: GalleryListItemProps) => {
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
      <GalleryViewModal
        isOpen={isOpen}
        prevData={imgData}
        onCancel={() => onClose()}
      />
    </>
  );
};

export default GalleryListItem;
