import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { usePositionLevelsQuery, addPosition } from "@/services/position";
import Button from "@/components/button";
import Input from "@/components/input";
import Select from "@/components/select";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

export type PositionAddFormType = "add";

const defaultFunc = () => {};

type OnEvent = (
  type: PositionAddFormType,
  title?: string,
  message?: string
) => void;

type PositionAddFormProps = {
  onCancel: () => void;
  onSubmited: OnEvent;
  onError: OnEvent;
  onLoading: OnEvent;
};

const PositionAddForm = ({
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
}: PositionAddFormProps) => {
  const defaultValues = {
    name: "",
    level: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const queryClient = useQueryClient();
  const positionLevelsQuery = usePositionLevelsQuery();

  const addPositionMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof addPosition>[0]
  >((data) => {
    return addPosition(data);
  });

  const onSubmit = handleSubmit(({ name, level }) => {
    onLoading("add", "Loading membuat jabatan");

    addPositionMutation
      .mutateAsync({
        name,
        level: Number(level),
      })
      .then(() => {
        queryClient.invalidateQueries("positionLevelsQuery");
        reset(defaultValues, { keepDefaultValues: true });
        onSubmited("add", "Sukses membuat jabatan");
      })
      .catch((e) => {
        onError("add", "Error membuat jabatan", e.message);
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
              errMsg={errors.name ? "Tidak boleh kosong" : ""}
            />
          </div>
          <div className={styles.inputGroup}>
            {positionLevelsQuery.isLoading ? (
              "Loading..."
            ) : positionLevelsQuery.error ? (
              <ErrMsg />
            ) : (
              <Select
                {...register("level", {
                  required: true,
                  valueAsNumber: true,
                })}
                label="Level:"
                id="level"
                defaultValue=""
                required={true}
                isInvalid={errors.level !== undefined}
                errMsg={errors.level ? "Tidak boleh kosong" : ""}
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
            )}
            <p>
              <em>
                Level menunjukan ada pada tingkat keberapa suatu jabatan
                tersebut.
              </em>
            </p>
            <p>
              <em>
                Contoh jabatan <strong>Ketua</strong> memiliki{" "}
                <strong>level 1</strong> dan jabatan{" "}
                <strong>Wakil ketua</strong> memiliki <strong>level 2</strong>
              </em>
            </p>
            <p>
              <em>Sehingga hirarki yang terbentuk akan menjadi:</em>
            </p>
            <ol>
              <li>Ketua</li>
              <li>Wakil Ketua</li>
            </ol>
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
    </>
  );
};

export default PositionAddForm;
