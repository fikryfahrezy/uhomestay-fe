import type { MemberDuesOut } from "@/services/member-dues";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { yyyyMm } from "@/lib/fmt";
import { editDues, paidDues, DUES_STATUS } from "@/services/member-dues";
import Button from "cmnjg-sb/dist/button";
import Input from "cmnjg-sb/dist/input";
import InputFile from "cmnjg-sb/dist/inputfile";
import Toast from "cmnjg-sb/dist/toast";
import useToast from "cmnjg-sb/dist/toast/useToast";
import ToastComponent from "@/layouts/toastcomponent";
import InputErrMsg from "@/layouts/inputerrmsg";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type MemberDuesEditFormProps = {
  prevData: MemberDuesOut;
  onEdited: () => void;
  onCancel: () => void;
};

const MemberDuesEditForm = ({
  prevData,
  onEdited = defaultFunc,
  onCancel = defaultFunc,
}: MemberDuesEditFormProps) => {
  const [isEditable, setEditable] = useState(false);

  const defaultValues = {
    date: "",
    idr_amount: "",
    file: [],
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });
  const { toast, updateToast, props } = useToast();

  const paidDuesMutation = useMutation<
    unknown,
    unknown,
    {
      id: Parameters<typeof paidDues>[0];
      data: Parameters<typeof paidDues>[1];
    }
  >(({ id, data }) => {
    return paidDues(id, data);
  });

  const editDuesMutation = useMutation<
    unknown,
    unknown,
    {
      id: Parameters<typeof editDues>[0];
      data: Parameters<typeof editDues>[1];
    }
  >(({ id, data }) => {
    return editDues(id, data);
  });

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
        }
      });

      const lastId = toast({
        status: "info",
        duration: 999999,
        render: () => (
          <ToastComponent title="Loading mengubah tagihan anggota" />
        ),
      });

      editDuesMutation
        .mutateAsync({ id, data: formData })
        .then(() => {
          onReset();
        })
        .catch((e) => {
          updateToast(lastId, {
            status: "error",
            render: () => (
              <ToastComponent
                title="Error mengubah tagihan anggota"
                message={e.message}
                data-testid="toast-modal"
              />
            ),
          });
        });
    });

  const onApprove = (id: number) => {
    const lastId = toast({
      status: "info",
      duration: 999999,
      render: () => (
        <ToastComponent title="Loading menyetujui tagihan anggota" />
      ),
    });

    paidDuesMutation
      .mutateAsync({
        id,
        data: {
          is_paid: true,
        },
      })
      .then(() => {
        onReset();
      })
      .catch((e) => {
        updateToast(lastId, {
          status: "error",
          render: () => (
            <ToastComponent
              title="Error menyetujui tagihan anggota"
              message={e.message}
              data-testid="toast-modal"
            />
          ),
        });
      });
  };

  const onSetEditable = () => {
    setEditable(true);
  };

  const onClose = () => {
    reset(defaultValues, { keepDefaultValues: true });
    onCancel();
  };

  useEffect(() => {
    if (prevData !== null) {
      const { date, idr_amount: idrAmount } = prevData;
      const newDate = date.split("-").splice(0, 2).join("-");

      reset(
        {
          idr_amount: idrAmount,
          date: newDate,
        },
        { keepDefaultValues: true }
      );
    }
  }, [prevData, reset]);

  return (
    <>
      {isEditable ? (
        <h2 className={styles.drawerTitle}>Ubah Iuran Anggota</h2>
      ) : (
        <h2 className={styles.drawerTitle}>Detail Iuran Anggota</h2>
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
              required={true}
              label="Tanggal:"
              id="date"
              readOnly={true}
              isInvalid={errors.date !== undefined}
            />
            {errors.date ? (
              <InputErrMsg>Tidak boleh kosong</InputErrMsg>
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
              readOnly={true}
              isInvalid={errors["idr_amount"] !== undefined}
            />
            {errors["idr_amount"] ? (
              <InputErrMsg>Tidak boleh kosong</InputErrMsg>
            ) : (
              <></>
            )}
          </div>
          <div className={styles.inputGroup}>
            <InputFile
              {...register("file", {
                required: true,
              })}
              label="Bukti:"
              id="file"
              multiple={false}
              value={isEditable ? "" : prevData["prove_file_url"]}
              src={isEditable ? "" : prevData["prove_file_url"]}
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
        </div>
        <div>
          {!isEditable &&
          (prevData.status === DUES_STATUS.UNPAID ||
            prevData.status === DUES_STATUS.WAITING) ? (
            <>
              <Button
                className={styles.formBtn}
                type="button"
                onClick={() => onApprove(prevData.id)}
                data-testid="approve-paid-btn"
              >
                Lunas
              </Button>
              <Button
                key="edit_btn"
                colorScheme="green"
                type="button"
                className={styles.formBtn}
                onClick={() => onSetEditable()}
                data-testid="editable-member-dues-btn"
              >
                Ubah
              </Button>
            </>
          ) : (
            <></>
          )}
          {isEditable ? (
            <>
              <Button
                key="save_edit_btn"
                colorScheme="green"
                type="submit"
                className={styles.formBtn}
                data-testid="edit-member-dues-btn"
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
          ) : (
            <></>
          )}
        </div>
      </form>
      <Toast {...props} />
    </>
  );
};

export default MemberDuesEditForm;
