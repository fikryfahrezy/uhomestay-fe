import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { yyyyMm } from "@/lib/fmt";
import { addDues } from "@/services/dues";
import Input from "cmnjg-sb/dist/input";
import Button from "cmnjg-sb/dist/button";
import Toast from "cmnjg-sb/dist/toast";
import useToast from "cmnjg-sb/dist/toast/useToast";
import ToastComponent from "@/layouts/toastcomponent";
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
  const { toast, updateToast, props } = useToast();

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

    const lastId = toast({
      status: "info",
      duration: 999999,
      render: () => <ToastComponent title="Loading membuat tagihan" />,
    });

    addDuesMutation
      .mutateAsync(newData)
      .then(() => {
        reset(defaultValues, { keepDefaultValues: true });
        onSubmited();
      })
      .catch((e) => {
        updateToast(lastId, {
          status: "error",
          render: () => (
            <ToastComponent
              title="Error membuat tagihan"
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
      <Toast {...props} />
    </>
  );
};

export default DuesAddForm;
