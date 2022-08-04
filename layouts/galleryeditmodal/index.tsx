import type { ImageOut } from "@/services/images";
import { useState } from "react";
import { useMutation } from "react-query";
import { removeImage } from "@/services/images";
import Button from "@/components/button";
import GalleryViewModal from "@/layouts/galleryviewmodal";
import Modal from "@/layouts/modal";

export type GalleryEditModalType = "delete";
type OnEvent = (
  type: GalleryEditModalType,
  title?: string,
  message?: string
) => void;

const defaultFunc = () => {};

type GalleryEditModalProps = {
  prevData: ImageOut;
  isOpen: boolean;
  onCancel: () => void;
  onSubmited: OnEvent;
  onError: OnEvent;
  onLoading: OnEvent;
};

const GalleryEditModal = ({
  prevData,
  isOpen = false,
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
}: GalleryEditModalProps) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const removeImageMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof removeImage>[0]
  >((id) => {
    return removeImage(id);
  });

  const onDelete = (id: number) => {
    onLoading("delete", "Loading menghapus foto");

    removeImageMutation
      .mutateAsync(id)
      .then(() => {
        onSubmited("delete", "Sukses menghapus foto");
      })
      .catch((e) => {
        onError("delete", "Error menghapus foto", e.message);
      });
  };

  const onConfirmDelete = () => {
    setModalOpen(true);
  };

  const onCancelDelete = () => {
    setModalOpen(false);
  };

  const onClose = () => {
    onCancel();
  };

  return (
    <>
      <GalleryViewModal
        prevData={prevData}
        isOpen={isOpen}
        onCancel={() => onClose()}
        removeBtn={
          <Button
            colorScheme="red"
            type="button"
            onClick={() => onConfirmDelete()}
            data-testid="gallery-remove-btn"
          >
            Hapus
          </Button>
        }
      />
      <Modal
        isOpen={isModalOpen}
        heading="Peringatan!"
        onCancel={() => onCancelDelete()}
        onConfirm={() => onDelete(prevData.id)}
      >
        <p>Apakah anda yakin ingin menghapus data yang dipilih?</p>
      </Modal>
    </>
  );
};

export default GalleryEditModal;
