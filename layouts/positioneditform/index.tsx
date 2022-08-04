import type { PositionOut } from "@/services/position";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import {
  usePositionLevelsQuery,
  editPosition,
  removePosition,
} from "@/services/position";
import Button from "@/components/button";
import Input from "@/components/input";
import Select from "@/components/select";
import Modal from "@/layouts/modal";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

export type PositionEditFormType = "edit" | "delete";

const defaultFunc = () => {};

type OnEvent = (
  type: PositionEditFormType,
  title?: string,
  message?: string
) => void;

type PositionEditFormProps = {
  prevData: PositionOut;
  onCancel: () => void;
  onSubmited: OnEvent;
  onError: OnEvent;
  onLoading: OnEvent;
};

const PositionEditForm = ({
  prevData,
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
}: PositionEditFormProps) => {
  const [isEditable, setEditable] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const defaultValues = {
    name: "",
    level: 0,
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const queryClient = useQueryClient();
  const positionLevelsQuery = usePositionLevelsQuery();

  const removePositionMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof removePosition>[0]
  >((id) => {
    return removePosition(id);
  });

  const editPositionMutation = useMutation<
    unknown,
    unknown,
    {
      id: Parameters<typeof editPosition>[0];
      data: Parameters<typeof editPosition>[1];
    }
  >(({ id, data }) => {
    return editPosition(id, data);
  });

  const onReset = (type: PositionEditFormType, title: string) => {
    reset(defaultValues, { keepDefaultValues: true });
    onSubmited(type, title);
  };

  const onSubmit = (id: number) =>
    handleSubmit((data) => {
      onLoading("edit", "Loading mengubah jabatan");

      editPositionMutation
        .mutateAsync({ id, data })
        .then(() => {
          queryClient.invalidateQueries("positionLevelsQuery");
          onReset("edit", "Sukses mengubah jabatan");
        })
        .catch((e) => {
          onError("edit", "Error mengubah jabatan", e.message);
        });
    });

  const onDelete = (id: number) => {
    onLoading("delete", "Loading menghapus jabatan");

    removePositionMutation
      .mutateAsync(id)
      .then(() => {
        queryClient.invalidateQueries("positionLevelsQuery");
        onReset("delete", "Sukses menghapus jabatan");
      })
      .catch((e) => {
        onError("delete", "Error menghapus jabatan", e.message);
      });
  };

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
      const { id, ...restData } = prevData;
      reset(restData, { keepDefaultValues: true });
    }
  }, [prevData, reset]);

  return (
    <>
      {isEditable ? (
        <h2 className={styles.drawerTitle}>Ubah Jabatan</h2>
      ) : (
        <h2 className={styles.drawerTitle}>Detail Jabatan</h2>
      )}
      <form className={styles.drawerBody} onSubmit={onSubmit(prevData.id)}>
        <div className={styles.drawerContent}>
          <div className={styles.inputGroup}>
            <Input
              {...register("name", {
                required: true,
              })}
              autoComplete="off"
              required={true}
              label="Posisi:"
              id="name"
              readOnly={!isEditable}
              isInvalid={errors.name !== undefined}
              errMsg={errors.name ? "Tidak boleh kosong" : ""}
              data-testid="edit-position-name-field"
            />
          </div>
          <div className={styles.inputGroup}>
            {positionLevelsQuery.isLoading ? (
              "Loading..."
            ) : positionLevelsQuery.error ? (
              <ErrMsg />
            ) : (
              <Select
                {...register("level", {
                  required: true,
                  valueAsNumber: true,
                })}
                label="Level:"
                id="level"
                required={true}
                disabled={!isEditable}
                isInvalid={errors.level !== undefined}
                errMsg={errors.level ? "Tidak boleh kosong" : ""}
              >
                {positionLevelsQuery.data?.data.map(({ level }) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </Select>
            )}
            <p>
              <em>
                Level menunjukan ada pada tingkat keberapa suatu jabatan
                tersebut.
              </em>
            </p>
            <p>
              <em>
                Contoh jabatan <strong>Ketua</strong> memiliki{" "}
                <strong>level 1</strong> dan jabatan{" "}
                <strong>Wakil ketua</strong> memiliki <strong>level 2</strong>
              </em>
            </p>
            <p>
              <em>Sehingga hirarki yang terbentuk akan menjadi:</em>
            </p>
            <ol>
              <li>Ketua</li>
              <li>Wakil Ketua</li>
            </ol>
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
                data-testid="editable-position-btn"
              >
                Ubah
              </Button>
              <Button
                colorScheme="red"
                type="button"
                className={styles.formBtn}
                onClick={() => onConfirmDelete()}
                data-testid="position-remove-btn"
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
                data-testid="edit-position-btn"
              >
                Ubah
              </Button>
              <Button
                colorScheme="red"
                type="reset"
                className={styles.formBtn}
                onClick={() => onClose()}
                data-testid="cancel-edit-position-btn"
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

export default PositionEditForm;
