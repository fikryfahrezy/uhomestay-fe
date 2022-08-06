import type { MemberDuesOut } from "@/services/member-dues";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { editDues, paidDues, DUES_STATUS } from "@/services/member-dues";
import Button from "@/components/button";
import Input from "@/components/input";
import InputFile from "@/components/inputfile";
import styles from "./Styles.module.css";

export type MemberDuesEditFormType = "edit" | "approve";

const defaultFunc = () => {};

type OnEvent = (
  type: MemberDuesEditFormType,
  title?: string,
  message?: string
) => void;

type MemberDuesEditFormProps = {
  prevData: MemberDuesOut;
  onCancel: () => void;
  onSubmited: OnEvent;
  onError: OnEvent;
  onLoading: OnEvent;
};

const MemberDuesEditForm = ({
  prevData,
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
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
	getValues,
    formState: { errors },
  } = useForm({ defaultValues });

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

  const onReset = (type: MemberDuesEditFormType, title: string) => {
    reset(defaultValues, { keepDefaultValues: true });
    onSubmited(type, title);
  };

  const onSubmit = (id: number) =>
    handleSubmit((data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v instanceof FileList && v.length !== 0) {
          formData.append(k, v[0]);
        }
      });

      onLoading("edit", "Loading mengubah pembayaran iuran anggota");

      editDuesMutation
        .mutateAsync({ id, data: formData })
        .then(() => {
          onReset("edit", "Sukses mengubah pembayaran iuran anggota");
        })
        .catch((e) => {
          onError("edit", "Error mengubah pembayaran iuran anggota", e.message);
        });
    });

  const onApprove = (id: number) => {
    onLoading("approve", "Loading menyetujui pembayaran iuran anggota");

    paidDuesMutation
      .mutateAsync({
        id,
        data: {
          is_paid: true,
        },
      })
      .then(() => {
        onReset("approve", "Sukses menyetujui pembayaran iuran anggota");
      })
      .catch((e) => {
        onError("approve", "Error menyetujui pembayaran iuran anggota", e.message);
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
              min={prevData.date}
              required={true}
              label="Tanggal:"
              id="date"
              readOnly={true}
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
              readOnly={true}
              isInvalid={errors["idr_amount"] !== undefined}
              errMsg={errors["idr_amount"] ? "Tidak boleh kosong" : ""}
            />
          </div>
          <div className={styles.inputGroup}>
            <InputFile
              {...register("file", {
                required: true,
              })}
              label="Bukti:"
              id="file"
              required={true}
              multiple={false}
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
              disabled={!isEditable}
              isInvalid={errors.file !== undefined}
              errMsg={errors.file ? "Tidak boleh kosong" : ""}
            >
              Pilih File
            </InputFile>
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
    </>
  );
};

export default MemberDuesEditForm;
