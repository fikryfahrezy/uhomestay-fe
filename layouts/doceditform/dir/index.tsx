import type { DocumentOut } from "@/services/document";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Button from "@/components/button";
import Input from "@/components/input";
import Checkbox from "@/components/checkbox";
import { editDirDocument, removeDocument } from "@/services/document";
import Modal from "@/layouts/modal";
import styles from "./Styles.module.css";

export type DocDirEditFormType = "editdir" | "deletedir";

const defaultFunc = () => {};

type OnEvent = (
  type: DocDirEditFormType,
  title?: string,
  message?: string
) => void;

type DocDirEditFormProps = {
  prevData: DocumentOut;
  onCancel: () => void;
  onSubmited: OnEvent;
  onError: OnEvent;
  onLoading: OnEvent;
};

const DocDirEditForm = ({
  prevData,
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
}: DocDirEditFormProps) => {
  const [isEditable, setEditable] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const defaultValues = {
    name: "",
    is_private: false,
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const removeDocumentMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof removeDocument>[0]
  >((id) => {
    return removeDocument(id);
  });

  const editDirDocumentMutation = useMutation<
    unknown,
    unknown,
    {
      id: Parameters<typeof editDirDocument>[0];
      data: Parameters<typeof editDirDocument>[1];
    }
  >(({ id, data }) => {
    return editDirDocument(id, data);
  });

  const onReset = (type: DocDirEditFormType, title: string) => {
    reset(defaultValues, { keepDefaultValues: true });
    onSubmited(type, title);
  };

  const onDelete = (id: number) => {
    onLoading("deletedir", "Loading menghapus folder");

    removeDocumentMutation
      .mutateAsync(id)
      .then(() => {
        onReset("deletedir", "Sukses menghapus folder");
      })
      .catch((e) => {
        onError("deletedir", "Error menghapus folder", e.message);
      });
  };

  const onSubmit = (id: number) =>
    handleSubmit((data) => {
      onLoading("editdir", "Loading mengubah folder");

      editDirDocumentMutation
        .mutateAsync({ id, data })
        .then(() => {
          onReset("editdir", "Sukses mengubah folder");
        })
        .catch((e) => {
          onError("editdir", "Error mengubah folder", e.message);
        });
    });

  const onSetEditable = () => {
    setEditable(true);
  };

  const onConfirmDelete = () => {
    setModalOpen(true);
  };

  const onCancelDelete = () => {
    setModalOpen(false);
  };

  const onClose = () => {
    reset(defaultValues, { keepDefaultValues: true });
    onCancel();
  };

  useEffect(() => {
    if (prevData !== null) {
      const { name, is_private: isPrivate } = prevData;
      reset({ name, is_private: isPrivate });
    }
  }, [prevData, reset]);

  return (
    <>
      <h2 className={styles.drawerTitle}>Ubah Folder</h2>
      <form className={styles.drawerBody} onSubmit={onSubmit(prevData.id)}>
        <div className={styles.drawerContent}>
          <div className={styles.inputGroup}>
            <Input
              {...register("name", {
                required: true,
              })}
              autoComplete="off"
              id="name"
              label="Nama Folder:"
              required={true}
              readOnly={!isEditable}
              isInvalid={errors.name !== undefined}
              errMsg={errors.name ? "Tidak boleh kosong" : ""}
            />
          </div>
          <div className={styles.inputGroup}>
            <Checkbox
              {...register("is_private")}
              id="is_private"
              disabled={!isEditable}
              isInvalid={errors["is_private"] !== undefined}
              errMsg={errors["is_private"] ? "Tidak boleh kosong" : ""}
            >
              Private
            </Checkbox>
          </div>
        </div>
        <div>
          {!isEditable ? (
            <>
              <Button
                key="edit_btn"
                colorScheme="green"
                type="button"
                className={styles.formBtn}
                onClick={() => onSetEditable()}
                data-testid="editable-dir-btn"
              >
                Ubah
              </Button>
              <Button
                colorScheme="red"
                type="button"
                className={styles.formBtn}
                onClick={() => onConfirmDelete()}
                data-testid="remove-dir-btn"
              >
                Hapus
              </Button>
            </>
          ) : (
            <>
              <Button
                key="save_edit_btn"
                colorScheme="green"
                type="submit"
                className={styles.formBtn}
                data-testid="edit-dir-btn"
              >
                Ubah
              </Button>
              <Button
                colorScheme="red"
                type="reset"
                className={styles.formBtn}
                onClick={() => onClose()}
              >
                Batal
              </Button>
            </>
          )}
        </div>
      </form>
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

export default DocDirEditForm;
