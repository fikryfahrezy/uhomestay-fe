import type { DocumentOut } from "@/services/document";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { editFileDocument, removeDocument } from "@/services/document";
import Button from "cmnjg-sb/dist/button";
import InputFile from "cmnjg-sb/dist/inputfile";
import Checkbox from "cmnjg-sb/dist/checkbox";
import Toast from "cmnjg-sb/dist/toast";
import useToast from "cmnjg-sb/dist/toast/useToast";
import Modal from "@/layouts/modal";
import ToastComponent from "@/layouts/toastcomponent";
import InputErrMsg from "@/layouts/inputerrmsg";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type DocFileEditFormProps = {
  prevData: DocumentOut;
  onEdited: () => void;
  onCancel: () => void;
};

const DocFileEditForm = ({
  prevData,
  onEdited = defaultFunc,
  onCancel = defaultFunc,
}: DocFileEditFormProps) => {
  const [isEditable, setEditable] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const defaultValues = {
    file: [],
    is_private: false,
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });
  const { toast, updateToast, props } = useToast();

  const removeDocumentMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof removeDocument>[0]
  >((id) => {
    return removeDocument(id);
  });

  const editFileDocumentMutation = useMutation<
    unknown,
    unknown,
    {
      id: Parameters<typeof editFileDocument>[0];
      data: Parameters<typeof editFileDocument>[1];
    }
  >(({ id, data }) => {
    return editFileDocument(id, data);
  });

  const onReset = () => {
    reset(defaultValues, { keepDefaultValues: true });
    onEdited();
  };

  const onDelete = (id: number) => {
    const lastId = toast({
      status: "info",
      duration: 999999,
      render: () => <ToastComponent title="Loading menghapus file" />,
    });

    removeDocumentMutation
      .mutateAsync(id)
      .then(() => {
        onReset();
      })
      .catch((e) => {
        updateToast(lastId, {
          status: "error",
          render: () => (
            <ToastComponent
              title="Error menghapus file"
              message={e.message}
              data-testid="toast-modal"
            />
          ),
        });
      });
  };

  const onSubmit = (id: number) =>
    handleSubmit((data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        const uv = v as unknown;
        if (uv instanceof FileList && uv.length !== 0) {
          formData.append(k, uv[0]);
        } else {
          formData.append(k, String(v));
        }
      });

      const lastId = toast({
        status: "info",
        duration: 999999,
        render: () => <ToastComponent title="Loading mengubah file" />,
      });

      editFileDocumentMutation
        .mutateAsync({ id, data: formData })
        .then(() => {
          onReset();
        })
        .catch((e) => {
          updateToast(lastId, {
            status: "error",
            render: () => (
              <ToastComponent
                title="Error mengubah file"
                message={e.message}
                data-testid="toast-modal"
              />
            ),
          });
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
      const { is_private: isPrivate } = prevData;
      reset({ is_private: isPrivate }, { keepDefaultValues: true });
    }
  }, [prevData, reset]);

  return (
    <>
      <h2 className={styles.drawerTitle}>Ubah Dokumen</h2>
      <form className={styles.drawerBody} onSubmit={onSubmit(prevData.id)}>
        <div className={styles.drawerContent}>
          <div className={styles.inputGroup}>
            <InputFile
              {...register("file", {})}
              id="file"
              label="File:"
              multiple={false}
              required={true}
              value={isEditable ? "" : prevData.name}
              src={isEditable ? "" : prevData.url}
              disabled={!isEditable}
              isInvalid={errors.file !== undefined}
            >
              Pilih File
            </InputFile>
            {errors.file ? (
              <InputErrMsg>Tidak boleh kosong</InputErrMsg>
            ) : (
              <></>
            )}
          </div>
          <div className={styles.inputGroup}>
            <Checkbox
              {...register("is_private")}
              id="is_private"
              disabled={!isEditable}
              isInvalid={errors["is_private"] !== undefined}
            >
              Private
            </Checkbox>
            {errors["is_private"] ? (
              <InputErrMsg>Tidak boleh kosong</InputErrMsg>
            ) : (
              <></>
            )}
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
                data-testid="editable-file-btn"
              >
                Ubah
              </Button>
              <Button
                colorScheme="red"
                type="button"
                className={styles.formBtn}
                onClick={() => onConfirmDelete()}
                data-testid="remove-file-btn"
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
                data-testid="edit-file-btn"
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
      <Toast {...props} />
    </>
  );
};

export default DocFileEditForm;
