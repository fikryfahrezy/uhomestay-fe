import type { DuesOut, EditDuesIn } from "@/services/dues";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yyyyMm } from "@/lib/fmt";
import { editDues, removeDues, useCheckPaidDuesQuery } from "@/services/dues";
import Input from "@/components/input";
import Button from "@/components/button";
import Toast, { useToast } from "@/components/toast";
import Modal from "@/layout/modal";
import ToastComponent from "@/layout/toastcomponent";
import InputErrMsg from "@/layout/inputerrmsg";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type DuesEditFormProps = {
  prevData: DuesOut;
  onEdited: () => void;
  onCancel: () => void;
};

const DuesEditForm = ({
  prevData,
  onEdited = defaultFunc,
  onCancel = defaultFunc,
}: DuesEditFormProps) => {
  const [isEditable, setEditable] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const paidDuesQuery = useCheckPaidDuesQuery(prevData ? prevData.id : 0, {
    enabled: !!prevData,
  });

  const defaultValues = {
    date: "",
    idr_amount: "",
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

  const onDelete = (id: number) => {
    removeDues(id)
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

  const onSubmit = (id: number) =>
    handleSubmit((data) => {
      const newData = {
        ...data,
        date: `${data.date}-01`,
      };

      editDues(id, newData)
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
      const newDate = restData.date.split("-").splice(0, 2).join("-");

      reset(
        {
          ...restData,
          date: newDate,
        },
        { keepDefaultValues: true }
      );
    }
  }, [prevData, reset]);

  return (
    <>
      {isEditable ? (
        <h2 className={styles.drawerTitle}>Ubah Tagihan Iuran</h2>
      ) : (
        <h2 className={styles.drawerTitle}>Detail Tagihan Iuran</h2>
      )}
      <form className={styles.drawerBody} onSubmit={onSubmit(prevData.id)}>
        <div className={styles.drawerContent}>
          <div className={styles.inputGroup}>
            <Input
              {...register("date", {
                required: true,
              })}
              autoComplete="off"
              type="month"
              min={yyyyMm(new Date(prevData.date))}
              label="Tanggal:"
              id="date"
              required={true}
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
              })}
              autoComplete="off"
              label="Jumlah:"
              type="number"
              id="idr_amount"
              required={true}
              readOnly={!isEditable}
              isInvalid={errors["idr_amount"] !== undefined}
            />
            {errors["idr_amount"] ? (
              <InputErrMsg>This field is required</InputErrMsg>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div>
          {!isEditable ? (
            <>
              {paidDuesQuery.isLoading || paidDuesQuery.isIdle ? (
                "Loading..."
              ) : paidDuesQuery.error ? (
                <ErrMsg />
              ) : paidDuesQuery.data.data["is_paid"] ? (
                <p>
                  <em>
                    Seseorang telah membayar iurang bulanan, tidak dapat diubah
                    atau hapus
                  </em>
                </p>
              ) : (
                <>
                  <Button
                    key="edit_btn"
                    colorScheme="green"
                    type="button"
                    className={styles.formBtn}
                    onClick={() => onSetEditable()}
                  >
                    Ubah
                  </Button>
                  <Button
                    colorScheme="red"
                    type="button"
                    className={styles.formBtn}
                    onClick={() => onConfirmDelete()}
                  >
                    Hapus
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Button
                key="save_edit_btn"
                colorScheme="green"
                type="submit"
                className={styles.formBtn}
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

export default DuesEditForm;
