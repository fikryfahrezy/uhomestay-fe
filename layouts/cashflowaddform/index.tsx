import { useForm } from "react-hook-form";
import { Toast, Select, InputFile, Button, Input, Textarea } from "cmnjg-sb";
import { addCashflow, CASHFLOW_TYPE } from "@/services/cashflow";
import { useToast } from "@/components/toast";
import ToastComponent from "@/layouts/toastcomponent";
import InputErrMsg from "@/layouts/inputerrmsg";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type CashflowAddFormProps = {
  onSubmited: () => void;
  onCancel: () => void;
};

const CashflowAddForm = ({
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
}: CashflowAddFormProps) => {
  const defaultValues = {
    date: "",
    idr_amount: "",
    type: CASHFLOW_TYPE.INCOME,
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
  const { toast, props } = useToast();

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v instanceof FileList && v.length !== 0) {
        formData.append(k, v[0]);
      } else {
        formData.append(k, String(v));
      }
    });

    addCashflow(formData)
      .then(() => {
        reset(defaultValues, { keepDefaultValues: true });
        onSubmited();
      })
      .catch((e) => {
        toast({
          status: "error",
          render: () => <ToastComponent title="Error" message={e.message} />,
        });
      });
  });

  const onClose = () => {
    reset(defaultValues, { keepDefaultValues: true });
    onCancel();
  };

  return (
    <>
      <h2 className={styles.drawerTitle}>Buat Tansaksi</h2>
      <form className={styles.drawerBody} onSubmit={onSubmit}>
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
            <Textarea
              {...register("note")}
              label="Catatan:"
              id="note"
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
              value={
                getValues().file.length === 0
                  ? ""
                  : (getValues().file as File[])[0].name
              }
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
          <Button
            colorScheme="green"
            type="submit"
            className={styles.formBtn}
            data-testid="add-cashflow-btn"
          >
            Buat
          </Button>
          <Button
            colorScheme="red"
            type="reset"
            className={styles.formBtn}
            onClick={() => onClose()}
          >
            Batal
          </Button>
        </div>
      </form>
      <Toast {...props} />
    </>
  );
};

export default CashflowAddForm;
