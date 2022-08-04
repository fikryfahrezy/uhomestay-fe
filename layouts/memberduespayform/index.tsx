import type { MemberDuesOut } from "@/services/member-dues";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { payDues } from "@/services/member-dues";
import Button from "@/components/button";
import Input from "@/components/input";
import InputFile from "@/components/inputfile";
import styles from "./Styles.module.css";

export type MemberDuesPayType = "pay";

const defaultFunc = () => {};

type OnEvent = (
  type: MemberDuesPayType,
  title?: string,
  message?: string
) => void;

type MemberDuesPayFormProps = {
  prevData: MemberDuesOut;
  onSubmited: OnEvent;
  onError: OnEvent;
  onLoading: OnEvent;
};

const MemberDuesPayForm = ({
  prevData,
  onSubmited = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
}: MemberDuesPayFormProps) => {
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

  const payDuesMutation = useMutation<
    unknown,
    unknown,
    {
      id: Parameters<typeof payDues>[0];
      data: Parameters<typeof payDues>[1];
    }
  >(({ id, data }) => {
    return payDues(id, data);
  });

  const onReset = (type: MemberDuesPayType, title: string) => {
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

      onLoading("pay", "Loading mengunggah bukti tagihan");

      payDuesMutation
        .mutateAsync({ id, data: formData })
        .then(() => {
          onReset("pay", "Sukses mengunggah bukti tagihan");
        })
        .catch((e) => {
          onError("pay", "Error mengunggah bukti tagihan", e.message);
        });
    });

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
      <h2 className={styles.drawerTitle} data-testid="pay-dues-title">
        Detail Iuran Anggota
      </h2>
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
              multiple={false}
              required={true}
              isInvalid={errors.file !== undefined}
              errMsg={errors.file ? "Tidak boleh kosong" : ""}
            >
              Pilih File
            </InputFile>
          </div>
        </div>
        <div>
          <Button
            colorScheme="green"
            type="submit"
            className={styles.formBtn}
            data-testid="pay-dues-btn"
          >
            Bayar
          </Button>
        </div>
      </form>
    </>
  );
};

export default MemberDuesPayForm;
