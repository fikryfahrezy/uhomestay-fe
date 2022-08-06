import type { MemberHomestaysRes } from "@/services/member-homestay";
import type { HomestayAddModalType } from "@/layouts/homestayviewmodal";
import { useState } from "react";
import { useMutation } from "react-query";
import { removeHomestay } from "@/services/member-homestay";
import Button from "@/components/button";
import HomestayViewModal from "@/layouts/homestayviewmodal";
import Modal from "@/layouts/modal";

export type HomestayEditModalType = "delete" | HomestayAddModalType;
type OnEvent = (
  type: HomestayEditModalType,
  title?: string,
  message?: string
) => void;

const defaultFunc = () => {};

type HomestayEditModalProps = {
  prevData: MemberHomestaysRes & { uid: string };
  isOpen: boolean;
  onCancel: () => void;
  onSubmited: OnEvent;
  onError: OnEvent;
  onLoading: OnEvent;
};

const HomestayEditModal = ({
  prevData,
  isOpen = false,
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
}: HomestayEditModalProps) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const removeImageMutation = useMutation<
    unknown,
    unknown,
    {
      id: Parameters<typeof removeHomestay>[0];
      uid: Parameters<typeof removeHomestay>[1];
    }
  >(({ id, uid }) => {
    return removeHomestay(id, uid);
  });

  const onDelete = (id: number, uid: string) => {
    onLoading("delete", "Loading menghapus homestay");

    removeImageMutation
      .mutateAsync({ id, uid })
      .then(() => {
        onSubmited("delete", "Sukses menghapus homestay");
      })
      .catch((e) => {
        onError("delete", "Error menghapus homestay", e.message);
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
      <HomestayViewModal
        prevData={prevData}
        isOpen={isOpen}
        onCancel={() => onClose()}
        onSubmited={(type, title, message) => onSubmited(type, title, message)}
        onError={(type, title, message) => onError(type, title, message)}
        onLoading={(type, title, message) => onLoading(type, title, message)}
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
        onConfirm={() => onDelete(prevData.id, prevData.uid)}
      >
        <p>Apakah anda yakin ingin menghapus data yang dipilih?</p>
      </Modal>
    </>
  );
};

export default HomestayEditModal;
