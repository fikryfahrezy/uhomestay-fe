import type { MemberDuesOut } from "@/services/member-dues";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yyyyMm } from "@/lib/fmt";
import { payDues } from "@/services/member-dues";
import Button from "@/components/button";
import Input from "@/components/input";
import InputFile from "@/components/inputfile";
import Toast, { useToast } from "@/components/toast";
import ToastComponent from "@/layout/toastcomponent";
import InputErrMsg from "@/layout/inputerrmsg";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type MemberDuesPayFormProps = {
  prevData: MemberDuesOut;
  onEdited: () => void;
};

const MemberDuesPayForm = ({
  prevData,
  onEdited = defaultFunc,
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
        }
      });

      payDues(id, formData)
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
      <h2 className={styles.drawerTitle}>Detail Iuran Anggota</h2>
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
              readOnly={true}
              isInvalid={errors["idr_amount"] !== undefined}
            />
            {errors["idr_amount"] ? (
              <InputErrMsg>This field is required</InputErrMsg>
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
              required={true}
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
          <Button colorScheme="green" type="submit" className={styles.formBtn}>
            Bayar
          </Button>
        </div>
      </form>
      <Toast {...props} />
    </>
  );
};

export default MemberDuesPayForm;
