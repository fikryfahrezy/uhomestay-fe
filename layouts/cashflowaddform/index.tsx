import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Select from "cmnjg-sb/dist/select";
import InputFile from "cmnjg-sb/dist/inputfile";
import Button from "cmnjg-sb/dist/button";
import Input from "cmnjg-sb/dist/input";
import TextArea from "cmnjg-sb/dist/textarea";
import Toast from "cmnjg-sb/dist/toast";
import useToast from "cmnjg-sb/dist/toast/useToast";
import { addCashflow, CASHFLOW_TYPE } from "@/services/cashflow";
import ToastComponent from "@/layouts/toastcomponent";
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

  const { toast, updateToast, props } = useToast();

  const addCashflowMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof addCashflow>[0]
  >((data) => {
    return addCashflow(data);
  });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v instanceof FileList && v.length !== 0) {
        formData.append(k, v[0]);
      } else {
        formData.append(k, String(v));
      }
    });

    const lastId = toast({
      status: "info",
      duration: 999999,
      render: () => <ToastComponent title="Loading membuat cashflow" />,
    });

    addCashflowMutation
      .mutateAsync(formData)
      .then(() => {
        reset(defaultValues, { keepDefaultValues: true });
        onSubmited();
      })
      .catch((e) => {
        updateToast(lastId, {
          status: "error",
          render: () => (
            <ToastComponent
              title="Error membuat cashflow"
              message={e.message}
              data-testid="toast-modal"
            />
          ),
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
              isInvalid={errors.note !== undefined}
              errMsg={errors.note ? "Tidak boleh kosong" : ""}
            />
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
