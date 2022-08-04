import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Select from "@/components/select";
import InputFile from "@/components/inputfile";
import Button from "@/components/button";
import Input from "@/components/input";
import TextArea from "@/components/textarea";
import { addCashflow, CASHFLOW_TYPE } from "@/services/cashflow";
import styles from "./Styles.module.css";

export type CashflowAddFormType = "add";

const defaultFunc = () => {};

type OnEvent = (
  type: CashflowAddFormType,
  title?: string,
  message?: string
) => void;

type CashflowAddFormProps = {
  onCancel: () => void;
  onSubmited: OnEvent;
  onError: OnEvent;
  onLoading: OnEvent;
};

const CashflowAddForm = ({
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
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

    onLoading("add", "Loading membuat cashflow");

    addCashflowMutation
      .mutateAsync(formData)
      .then(() => {
        reset(defaultValues, { keepDefaultValues: true });
        onSubmited("add", "Sukses membuat cashflow");
      })
      .catch((e) => {
        onError("add", "Error membuat cashflow", e.message);
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
    </>
  );
};

export default CashflowAddForm;
