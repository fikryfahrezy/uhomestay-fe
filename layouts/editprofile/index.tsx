import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { RiCloseLine, RiCheckFill } from "react-icons/ri";
import { useMemberDetailQuery, updateProfile } from "@/services/member";
import AvatarPicker from "@/components/avatarpicker";
import Input from "@/components/input";
import Button from "@/components/button";
import Toast, { useToast } from "@/components/toast";
import ImagePicker from "@/components/imagepicker";
import Label from "@/components/label";
import ToastComponent from "@/layouts/toastcomponent";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const UpdateProfile = () => {
  const [isEditIdCard, setEditIdCard] = useState(false);
  const [muid, setMuid] = useState("");
  const router = useRouter();

  const memberDetailQuery = useMemberDetailQuery(muid, {
    enabled: !!muid,
  });

  const defaultValues = {
    profile: "",
    id_card: "",
    username: "",
    password: "",
    name: "",
    wa_phone: "",
    other_phone: "",
    position_id: 0,
    period_id: 0,
  };
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    resetField,
    formState: { errors },
  } = useForm({ defaultValues });

  const { toast, updateToast, props } = useToast();

  const updateProfileMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof updateProfile>[0]
  >((data) => {
    return updateProfile(data);
  });

  const onSubmit = () =>
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

      const lastId = toast({
        status: "info",
        duration: 999999,
        render: () => <ToastComponent title="Loading update profile" />,
      });

      updateProfileMutation
        .mutateAsync(formData)
        .then(() => {
          updateToast(lastId, {
            status: "success",
            render: () => (
              <ToastComponent
                title="Sukses"
                message="Melakukan update profile."
              />
            ),
          });
          setEditIdCard(false);
        })
        .catch((e) => {
          updateToast(lastId, {
            status: "error",
            render: () => (
              <ToastComponent
                title="Error update profile"
                message={e.message}
                data-testid="toast-modal"
              />
            ),
          });
        });
    });

  const onCancelUpdate = () => {
    router.back();
  };

  const onPickErr = () => {
    toast({
      status: "error",
      duration: 5000,
      render: () => (
        <ToastComponent
          title="Error tipe file"
          message="File bukan bertipe gambar"
        />
      ),
    });
  };

  const onEditIdCard = () => {
    setValue("id_card", "");
    setEditIdCard(true);
  };

  const onCancelEditIdCard = (idCardUrl: string) => {
    setValue("id_card", idCardUrl);
    setEditIdCard(false);
  };

  useEffect(() => {
    if (memberDetailQuery.data !== undefined) {
      const {
        id,
        period,
        is_approved,
        profile_pic_url: profile,
        id_card_url: idCard,
        ...restData
      } = memberDetailQuery.data.data;

      reset(
        { profile, id_card: idCard, ...restData },
        { keepDefaultValues: true }
      );
    }
  }, [memberDetailQuery.data, reset]);

  useEffect(() => {
    const lmuid = window.localStorage.getItem("muid");
    if (lmuid !== null) {
      setMuid(lmuid);
    }
  }, []);

  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.drawerTitle}>Ubah Profile</h2>
      <form className={styles.drawerBody} onSubmit={onSubmit()}>
        <div className={styles.avatarContainer}>
          {memberDetailQuery.isLoading || memberDetailQuery.isIdle ? (
            "Loading..."
          ) : memberDetailQuery.error ? (
            <ErrMsg />
          ) : (
            <AvatarPicker
              {...register("profile")}
              text="Ubah"
              defaultSrc={"/images/image/person.png"}
              onErr={() => onPickErr()}
              onRemove={() => resetField("profile")}
              className={styles.avatarPicker}
              src={memberDetailQuery.data.data["profile_pic_url"]}
            />
          )}
        </div>
        <div className={styles.drawerContent}>
          <div className={styles.inputGroups}>
            <div className={styles.inputGroup}>
              <Input
                {...register("username", {
                  required: true,
                })}
                autoComplete="off"
                label="Username:"
                id="username"
                required={true}
                isInvalid={errors.username !== undefined}
                errMsg={errors.username ? "Tidak boleh kosong" : ""}
              />
            </div>
            <div className={styles.inputGroup}>
              <Input
                {...register("password", {})}
                autoComplete="off"
                label="Password:"
                type="password"
                id="password"
                isInvalid={errors.password !== undefined}
              />
            </div>
          </div>
          <div className={styles.inputGroups}>
            <div className={styles.inputGroup}>
              <Input
                {...register("name", {
                  required: true,
                })}
                autoComplete="off"
                label="Nama:"
                id="name"
                required={true}
                isInvalid={errors.name !== undefined}
                errMsg={errors.name ? "Tidak boleh kosong" : ""}
              />
            </div>
            <div className={styles.inputGroup}>
              <Input
                {...register("wa_phone", {
                  required: true,
                })}
                autoComplete="off"
                label="Nomor WA:"
                id="wa_phone"
                required={true}
                isInvalid={errors["wa_phone"] !== undefined}
                errMsg={errors["wa_phone"] ? "Tidak boleh kosong" : ""}
              />
            </div>
          </div>
          <div className={styles.inputGroups}>
            <div className={styles.inputGroup}>
              <Input
                {...register("other_phone", {
                  required: true,
                })}
                autoComplete="off"
                label="Nomor Lainnya:"
                note="(samakan dengan WA bila tidak ada)"
                id="other_phone"
                required={true}
                isInvalid={errors["other_phone"] !== undefined}
                errMsg={errors["other_phone"] ? "Tidak boleh kosong" : ""}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            {isEditIdCard ? (
              <ImagePicker
                {...register("id_card")}
                label="Foto KTP:"
                id="id_card"
                multiple={false}
                onErr={() => onPickErr()}
                isInvalid={errors["id_card"] !== undefined}
                errMsg={errors["id_card"] ? "Tidak boleh kosong" : ""}
                className={styles.borderBox}
                data-testid="image-picker-input"
              >
                Pilih File
              </ImagePicker>
            ) : (
              <>
                <Label>Foto KTP:</Label>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={memberDetailQuery.data?.data["id_card_url"] || ""}
                  className={styles.link}
                >
                  {memberDetailQuery.data?.data["id_card_url"] || ""}
                </a>
              </>
            )}
          </div>
          <div className={styles.inputGroup}>
            {isEditIdCard ? (
              <Button
                className={styles.formBtn}
                type="button"
                onClick={() =>
                  onCancelEditIdCard(
                    String(memberDetailQuery.data?.data["id_card_url"] || "")
                  )
                }
              >
                Batal Ubah KTP
              </Button>
            ) : (
              <Button
                className={styles.formBtn}
                type="button"
                onClick={() => onEditIdCard()}
              >
                Ubah KTP
              </Button>
            )}
          </div>
          <div className={styles.editableButtons}>
            <Button
              key="save_edit_btn"
              colorScheme="green"
              type="submit"
              leftIcon={<RiCheckFill />}
              className={styles.formBtn}
            >
              Ubah
            </Button>
            <Button
              colorScheme="red"
              type="reset"
              leftIcon={<RiCloseLine />}
              className={styles.formBtn}
              onClick={() => onCancelUpdate()}
            >
              Batal
            </Button>
          </div>
        </div>
      </form>
      <Toast {...props} />
    </div>
  );
};

export default UpdateProfile;
