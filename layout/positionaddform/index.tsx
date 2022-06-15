import { useForm } from "react-hook-form";
import { usePositionLevelsQuery, addPosition } from "@/services/position";
import Button from "@/components/button";
import Input from "@/components/input";
import Select from "@/components/select";
import Toast, { useToast } from "@/components/toast";
import ToastComponent from "@/layout/toastcomponent";
import InputErrMsg from "@/layout/inputerrmsg";
import ErrMsg from "@/layout/errmsg";
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
  const { toast, props } = useToast();

  const onSubmit = handleSubmit((data) => {
    addPosition(data)
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
              <InputErrMsg>This field is required</InputErrMsg>
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
                  <InputErrMsg>This field is required</InputErrMsg>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </div>
        <div>
          <Button colorScheme="green" type="submit" className={styles.formBtn}>
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

export default PositionAddForm;
