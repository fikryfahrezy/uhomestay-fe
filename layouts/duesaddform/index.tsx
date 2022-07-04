import { useForm } from "react-hook-form";
import { yyyyMm } from "@/lib/fmt";
import { addDues } from "@/services/dues";
import { Input, Button, Toast } from "cmnjg-sb";
import { useToast } from "cmnjg-sb";
import ToastComponent from "@/layouts/toastcomponent";
import InputErrMsg from "@/layouts/inputerrmsg";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type DuesAddFormProps = {
  onSubmited: () => void;
  onCancel: () => void;
};

const DuesAddForm = ({
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
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
  const { toast, props } = useToast();

  const onSubmit = handleSubmit((data) => {
    const newData = {
      ...data,
      date: `${data.date}-01`,
    };

    addDues(newData)
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
      <Toast {...props} />
    </>
  );
};

export default DuesAddForm;
