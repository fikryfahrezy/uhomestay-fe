import type { CashflowOut } from "@/services/cashflow";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Button from "@/components/button";
import Input from "@/components/input";
import TextArea from "@/components/textarea";
import InputFile from "@/components/inputfile";
import Select from "@/components/select";
import {
  editCashflow,
  removeCashflow,
  CASHFLOW_TYPE,
} from "@/services/cashflow";
import Modal from "@/layouts/modal";
import styles from "./Styles.module.css";

export type CasflowEditFormType = "edit" | "delete";

const defaultFunc = () => {};

type OnEvent = (
  type: CasflowEditFormType,
  title?: string,
  message?: string
) => void;

type CasflowEditFormProps = {
  prevData: CashflowOut;
  onCancel: () => void;
  onSubmited: OnEvent;
  onError: OnEvent;
  onLoading: OnEvent;
};

const CasflowEditForm = ({
  prevData,
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
}: CasflowEditFormProps) => {
  const [isEditable, setEditable] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const defaultValues = {
    date: "",
    idr_amount: "",
    type: "",
    note: "",
    file: [],
  };
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues });

  const removeCashflowMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof removeCashflow>[0]
  >((id) => {
    return removeCashflow(id);
  });

  const editCashflowMutation = useMutation<
    unknown,
    unknown,
    {
      id: Parameters<typeof editCashflow>[0];
      data: Parameters<typeof editCashflow>[1];
    }
  >(({ id, data }) => {
    return editCashflow(id, data);
  });

  const onReset = (type: CasflowEditFormType, title: string) => {
    reset(defaultValues, { keepDefaultValues: true });
    onSubmited(type, title);
  };

  const onSubmit = (id: number) =>
    handleSubmit((data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v instanceof FileList && v.length !== 0) {
          formData.append(k, v[0]);
        } else {
          formData.append(k, String(v));
        }
      });

      onLoading("edit", "Loading mengubah cashflow");

      editCashflowMutation
        .mutateAsync({ id, data: formData })
        .then(() => {
          onReset("edit", "Sukses mengubah cashflow");
        })
        .catch((e) => {
          onError("edit", "Error mengubah cashflow", e.message);
        });
    });

  const onDelete = (id: number) => {
    onLoading("delete", "Loading menghapus cashflow");

    removeCashflowMutation
      .mutateAsync(id)
      .then(() => {
        onReset("delete", "Sukses menghapus cashflow");
      })
      .catch((e) => {
        onError("delete", "Error menghapus cashflow", e.message);
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
      const { id, prove_file_url, ...restData } = prevData;
      reset(restData, { keepDefaultValues: true });
    }
  }, [prevData, reset]);

  return (
    <>
      {isEditable ? (
        <h2 className={styles.drawerTitle}>Ubah Transaksi</h2>
      ) : (
        <h2 className={styles.drawerTitle}>Detail Transaksi</h2>
      )}
      <form className={styles.drawerBody} onSubmit={onSubmit(prevData.id)}>
        <div className={styles.drawerContent}>
          <div className={styles.inputGroup}>
            <Input
              {...register("date", {
                required: true,
              })}
              autoComplete="off"
              type="date"
              required={true}
              label="Tanggal:"
              id="date"
              readOnly={!isEditable}
              isInvalid={errors.date !== undefined}
              errMsg={errors.date ? "Tidak boleh kosong" : ""}
            />
          </div>
          <div className={styles.inputGroup}>
            <Input
              {...register("idr_amount", {
                required: true,
                valueAsNumber: true,
              })}
              autoComplete="off"
              type="number"
              required={true}
              label="Jumlah:"
              id="idr_amount"
              readOnly={!isEditable}
              isInvalid={errors["idr_amount"] !== undefined}
              errMsg={errors["idr_amount"] ? "Tidak boleh kosong" : ""}
            />
          </div>
          <div className={styles.inputGroup}>
            <Select
              {...register("type", {
                required: true,
              })}
              label="Tipe:"
              id="type"
              required={true}
              disabled={!isEditable}
              isInvalid={errors.type !== undefined}
              errMsg={errors.type ? "Tidak boleh kosong" : ""}
            >
              <option value={CASHFLOW_TYPE.INCOME}>Pemasukan</option>
              <option value={CASHFLOW_TYPE.OUTCOME}>Pengeluaran</option>
            </Select>
          </div>
          <div className={styles.inputGroup}>
            <TextArea
              {...register("note")}
              label="Catatan:"
              id="note"
              readOnly={!isEditable}
              isInvalid={errors.note !== undefined}
              errMsg={errors.note ? "Tidak boleh kosong" : ""}
            />
          </div>
          <div className={styles.inputGroup}>
            <InputFile
              {...register("file")}
              label="Bukti:"
              id="file"
              multiple={false}
              disabled={!isEditable}
              value={
                isEditable
                  ? getValues().file.length === 0
                    ? prevData["prove_file_url"]
                    : (getValues().file as File[])[0].name
                  : prevData["prove_file_url"]
              }
              src={
                isEditable
                  ? getValues().file.length === 0
                    ? prevData["prove_file_url"]
                    : ""
                  : prevData["prove_file_url"]
              }
              isInvalid={errors.file !== undefined}
              errMsg={errors.file ? "Tidak boleh kosong" : ""}
            >
              Pilih File
            </InputFile>
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
                data-testid="editable-cashflow-btn"
              >
                Ubah
              </Button>
              <Button
                colorScheme="red"
                type="button"
                className={styles.formBtn}
                onClick={() => onConfirmDelete()}
                data-testid="remove-cashflow-btn"
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
                data-testid="edit-cashflow-btn"
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

export default CasflowEditForm;
