import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { yyyyMm } from "@/lib/fmt";
import { addDues } from "@/services/dues";
import Input from "@/components/input";
import Button from "@/components/button";
import styles from "./Styles.module.css";

export type DuesAddFormType = "add";

const defaultFunc = () => {};

type OnEvent = (
  type: DuesAddFormType,
  title?: string,
  message?: string
) => void;

type DuesAddFormProps = {
  onCancel: () => void;
  onSubmited: OnEvent;
  onError: OnEvent;
  onLoading: OnEvent;
};

const DuesAddForm = ({
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
}: DuesAddFormProps) => {
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

  const addDuesMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof addDues>[0]
  >((data) => {
    return addDues(data);
  });

  const onSubmit = handleSubmit((data) => {
    const newData = {
      ...data,
      date: `${data.date}-01`,
    };

    onLoading("add", "Loading membuat tagihan");

    addDuesMutation
      .mutateAsync(newData)
      .then(() => {
        reset(defaultValues, { keepDefaultValues: true });
        onSubmited("add", "Sukses membuat tagihan");
      })
      .catch((e) => {
        onError("add", "Error membuat tagihan", e.message);
      });
  });

  const onClose = () => {
    reset(defaultValues, { keepDefaultValues: true });
    onCancel();
  };

  return (
    <>
      <h2 className={styles.drawerTitle}>Buat Tagihan Iuran</h2>
      <form className={styles.drawerBody} onSubmit={onSubmit}>
        <div className={styles.drawerContent}>
          <div className={styles.inputGroup}>
            <Input
              {...register("date", {
                required: true,
              })}
              autoComplete="off"
              type="month"
              min={yyyyMm(new Date())}
              label="Tanggal:"
              id="date"
              required={true}
              isInvalid={errors.date !== undefined}
              errMsg={errors.date ? "Tidak boleh kosong" : ""}
            />
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
              isInvalid={errors["idr_amount"] !== undefined}
              errMsg={errors["idr_amount"] ? "Tidak boleh kosong" : ""}
            />
          </div>
        </div>
        <div>
          <Button
            colorScheme="green"
            type="submit"
            className={styles.formBtn}
            data-testid="create-dues-btn"
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

export default DuesAddForm;
