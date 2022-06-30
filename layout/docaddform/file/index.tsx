import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { addFileDocument } from "@/services/document";
import Button from "@/components/button";
import InputFile from "@/components/inputfile";
import Checkbox from "@/components/checkbox";
import Toast, { useToast } from "@/components/toast";
import ToastComponent from "@/layout/toastcomponent";
import InputErrMsg from "@/layout/inputerrmsg";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type DocFileAddFormProps = {
  onSubmited: () => void;
  onCancel: () => void;
};

const DocFileAddForm = ({
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
}: DocFileAddFormProps) => {
  const router = useRouter();
  const dirIdQ = "dir_id";

  const defaultValues = {
    file: [],
    is_private: false,
  };
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues });
  const { toast, props } = useToast();

  /**
   * @return {void}
   */
  const onClose = () => {
    reset(defaultValues, { keepDefaultValues: true });
    onCancel();
  };

  const onSubmit = (dirId: number) =>
    handleSubmit((data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        const uv = v as unknown;
        if (uv instanceof FileList && uv.length !== 0) {
          formData.append(k, uv[0]);
        } else {
          formData.append(k, String(v));
        }
      });

      formData.append(dirIdQ, String(dirId));

      addFileDocument(formData)
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

  return (
    <>
      <h2 className={styles.drawerTitle}>Tambah Dokumen</h2>
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
            <InputFile
              {...register("file", {
                required: true,
              })}
              label="File:"
              id="file"
              multiple={false}
              required={true}
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
          <div className={styles.inputGroup}>
            <Checkbox
              {...register("is_private")}
              id="is_private"
              isInvalid={errors["is_private"] !== undefined}
            >
              Private
            </Checkbox>
            {errors["is_private"] ? (
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
            data-testid="add-file-btn"
          >
            Tambah
          </Button>
          <Button
            colorScheme="red"
            type="reset"
            className={styles.formBtn}
            onClick={() => onClose()}
            data-testid="cancel-add-file-btn"
          >
            Batal
          </Button>
        </div>
      </form>
      <Toast {...props} />
    </>
  );
};

export default DocFileAddForm;
