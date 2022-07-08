import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Button from "cmnjg-sb/dist/button";
import Input from "cmnjg-sb/dist/input";
import Checkbox from "cmnjg-sb/dist/checkbox";
import { addDirDocument } from "@/services/document";
import styles from "./Styles.module.css";

export type DocDirAddFormType = "adddir";

const defaultFunc = () => {};

type DocDirAddFormProps = {
  onSubmited: () => void;
  onCancel: () => void;
  onError: (type: DocDirAddFormType, title?: string, message?: string) => void;
  onLoading: (
    type: DocDirAddFormType,
    title?: string,
    message?: string
  ) => void;
};

const DocDirAddForm = ({
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
}: DocDirAddFormProps) => {
  const router = useRouter();
  const dirIdQ = "dir_id";

  const defaultValues = {
    name: "",
    is_private: false,
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const addDirDocumentMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof addDirDocument>[0]
  >((data) => {
    return addDirDocument(data);
  });

  /**
   * @return {void}
   */
  const onClose = () => {
    reset(defaultValues, { keepDefaultValues: true });
    onCancel();
  };

  const onSubmit = (dirId: number) =>
    handleSubmit((data) => {
      onLoading("adddir", "Loading menambahkan folder");

      addDirDocumentMutation
        .mutateAsync({ ...data, dir_id: dirId })
        .then(() => {
          reset(defaultValues, { keepDefaultValues: true });
          onSubmited();
        })
        .catch((e) => {
          onError("adddir", "Error menambahkan folder", e.message);
        });
    });

  return (
    <>
      <h2 className={styles.drawerTitle}>Buat Folder</h2>
      <form
        className={styles.drawerBody}
        onSubmit={onSubmit(
          typeof router.query[dirIdQ] === "string"
            ? Number(router.query[dirIdQ])
            : 0
        )}
      >
        <div className={styles.drawerContent}>
          <div className={styles.inputGroup}>
            <Input
              {...register("name", {
                required: true,
              })}
              autoComplete="off"
              id="name"
              label="Nama Folder:"
              required={true}
              isInvalid={errors.name !== undefined}
              errMsg={errors.name ? "Tidak boleh kosong" : ""}
            />
          </div>
          <div className={styles.inputGroup}>
            <Checkbox
              {...register("is_private")}
              id="is_private"
              isInvalid={errors["is_private"] !== undefined}
              errMsg={errors["is_private"] ? "Tidak boleh kosong" : ""}
            >
              Private
            </Checkbox>
          </div>
        </div>
        <div>
          <Button
            colorScheme="green"
            type="submit"
            className={styles.formBtn}
            data-testid="add-dir-btn"
          >
            Tambah
          </Button>
          <Button
            colorScheme="red"
            type="reset"
            className={styles.formBtn}
            onClick={() => onClose()}
            data-testid="cancel-add-dir-btn"
          >
            Batal
          </Button>
        </div>
      </form>
    </>
  );
};

export default DocDirAddForm;
