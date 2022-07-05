import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { usePositionLevelsQuery, addPosition } from "@/services/position";
import Button from "cmnjg-sb/dist/button";
import Input from "cmnjg-sb/dist/input";
import Select from "cmnjg-sb/dist/select";
import Toast from "cmnjg-sb/dist/toast";
import useToast from "cmnjg-sb/dist/toast/useToast";
import ToastComponent from "@/layouts/toastcomponent";
import InputErrMsg from "@/layouts/inputerrmsg";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

/**
 *
 * @param {{
 * 	onSubmited: () => void;
 * 	onCancel: () => void;
 * }} PositionAddFormProps
 *
 * @returns {JSX.Element}
 */
const PositionAddForm = ({
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
}) => {
  const defaultValues = {
    name: "",
    level: 0,
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const positionLevelsQuery = usePositionLevelsQuery();
  const { toast, updateToast, props } = useToast();

  const addPositionMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof addPosition>[0]
  >((data) => {
    return addPosition(data);
  });

  const onSubmit = handleSubmit((data) => {
    const lastId = toast({
      status: "info",
      duration: 999999,
      render: () => <ToastComponent title="Loading menambahkan jabatan" />,
    });

    addPositionMutation
      .mutateAsync(data)
      .then(() => {
        reset(defaultValues, { keepDefaultValues: true });
        onSubmited();
      })
      .catch((e) => {
        updateToast(lastId, {
          status: "error",
          render: () => (
            <ToastComponent
              title="Error menambahkan jabatan"
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
      <h2 className={styles.drawerTitle}>Buat Jabatan</h2>
      <form className={styles.drawerBody} onSubmit={onSubmit}>
        <div className={styles.drawerContent}>
          <div className={styles.inputGroup}>
            <Input
              {...register("name", {
                required: true,
              })}
              autoComplete="off"
              required={true}
              label="Posisi:"
              id="name"
              isInvalid={errors.name !== undefined}
            />
            {errors.name ? (
              <InputErrMsg>Tidak boleh kosong</InputErrMsg>
            ) : (
              <></>
            )}
          </div>
          <div className={styles.inputGroup}>
            {positionLevelsQuery.isLoading ? (
              "Loading..."
            ) : positionLevelsQuery.error ? (
              <ErrMsg />
            ) : (
              <>
                <Select
                  {...register("level", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  label="Level:"
                  id="level"
                  required={true}
                  isInvalid={errors.level !== undefined}
                  defaultValue=""
                >
                  <option disabled value="">
                    Pilih Level
                  </option>
                  {positionLevelsQuery.data?.data.map(({ level }) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Select>
                {errors.level ? (
                  <InputErrMsg>Tidak boleh kosong</InputErrMsg>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </div>
        <div>
          <Button
            colorScheme="green"
            type="submit"
            className={styles.formBtn}
            data-testid="save-btn"
          >
            Buat
          </Button>
          <Button
            colorScheme="red"
            type="reset"
            className={styles.formBtn}
            onClick={() => onClose()}
            data-testid="cancel-btn"
          >
            Batal
          </Button>
        </div>
      </form>
      <Toast {...props} />
    </>
  );
};

export default PositionAddForm;
