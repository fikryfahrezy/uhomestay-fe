import type { CashflowOut } from "@/services/cashflow";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  editCashflow,
  removeCashflow,
  CASHFLOW_TYPE,
} from "@/services/cashflow";
import Button from "@/components/button";
import Input from "@/components/input";
import TextArea from "@/components/textarea";
import InputFile from "@/components/inputfile";
import Select from "@/components/select";
import Toast, { useToast } from "@/components/toast";
import ToastComponent from "@/layout/toastcomponent";
import InputErrMsg from "@/layout/inputerrmsg";
import Modal from "@/layout/modal";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type CasflowEditFormProps = {
  prevData: CashflowOut;
  onEdited: () => void;
  onCancel: () => void;
};

const CasflowEditForm = ({
  prevData,
  onEdited = defaultFunc,
  onCancel = defaultFunc,
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
    formState: { errors },
  } = useForm({ defaultValues });
  const { toast, props } = useToast();

  const onReset = () => {
    reset(defaultValues, { keepDefaultValues: true });
    onEdited();
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

      editCashflow(id, formData)
        .then(() => {
          onReset();
        })
        .catch((e) => {
          toast({
            status: "error",
            render: () => <ToastComponent title="Error" message={e.message} />,
          });
        });
    });

  const onDelete = (id: number) => {
    removeCashflow(id)
      .then(() => {
        onReset();
      })
      .catch((e) => {
        toast({
          status: "error",
          render: () => <ToastComponent title="Error" message={e.message} />,
        });
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
            />
            {errors.date ? (
              <InputErrMsg>This field is required</InputErrMsg>
            ) : (
              <></>
            )}
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
            />
            {errors["idr_amount"] ? (
              <InputErrMsg>This field is required</InputErrMsg>
            ) : (
              <></>
            )}
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
            >
              <option value={CASHFLOW_TYPE.INCOME}>Pemasukan</option>
              <option value={CASHFLOW_TYPE.OUTCOME}>Pengeluaran</option>
            </Select>
            {errors.type ? (
              <InputErrMsg>This field is required</InputErrMsg>
            ) : (
              <></>
            )}
          </div>
          <div className={styles.inputGroup}>
            <TextArea
              {...register("note")}
              label="Catatan:"
              id="note"
              readOnly={!isEditable}
              isInvalid={errors.note !== undefined}
            />
            {errors.note ? (
              <InputErrMsg>This field is required</InputErrMsg>
            ) : (
              <></>
            )}
          </div>
          <div className={styles.inputGroup}>
            <InputFile
              {...register("file")}
              label="Bukti:"
              id="file"
              multiple={false}
              disabled={!isEditable}
              src={prevData["prove_file_url"]}
              value={prevData["prove_file_url"]}
              isInvalid={errors.file !== undefined}
            >
              Pilih File
            </InputFile>
            {errors.file ? (
              <InputErrMsg>This field is required</InputErrMsg>
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
      <Toast {...props} />
    </>
  );
};

export default CasflowEditForm;
