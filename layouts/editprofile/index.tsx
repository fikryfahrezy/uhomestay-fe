import type { MapMouseEvent, EventData } from "mapbox-gl";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { RiCloseLine, RiCheckFill } from "react-icons/ri";
import { useMemberDetailQuery, updateProfile } from "@/services/member";
import AvatarPicker from "cmnjg-sb/dist/avatarpicker";
import Input from "cmnjg-sb/dist/input";
import TextArea from "cmnjg-sb/dist/textarea";
import Button from "cmnjg-sb/dist/button";
import Toast from "cmnjg-sb/dist/toast";
import useToast from "cmnjg-sb/dist/toast/useToast";
import ToastComponent from "@/layouts/toastcomponent";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Map = dynamic(() => import("@/layouts/map"), {
  loading: () => <p>...</p>,
});

const defLng = 107.79054317790919;
const defLat = -7.153238933398519;

const UpdateProfile = () => {
  const [muid, setMuid] = useState("");
  const [lng, setLng] = useState(defLng);
  const [lat, setLat] = useState(defLat);

  const router = useRouter();

  const memberDetailQuery = useMemberDetailQuery(muid, {
    enabled: !!muid,
  });

  const defaultValues = {
    profile: "",
    username: "",
    password: "",
    name: "",
    wa_phone: "",
    other_phone: "",
    position_id: 0,
    period_id: 0,
    homestay_name: "",
    homestay_address: "",
    homestay_latitude: String(lat),
    homestay_longitude: String(lng),
  };
  const {
    register,
    handleSubmit,
    reset,
    setValue,
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

  /**
   *
   * @return {typeof handleSubmit}
   */
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

  const onMapClick = (e: MapMouseEvent & EventData) => {
    const { lng, lat } = e.lngLat;

    setLng(lng);
    setLat(lat);

    setValue("homestay_latitude", String(lat));
    setValue("homestay_longitude", String(lng));
  };

  const onCancelUpdate = () => {
    router.back();
  };

  useEffect(() => {
    if (memberDetailQuery.data !== undefined) {
      const {
        id,
        position,
        period,
        is_approved,
        profile_pic_url: profile,
        homestay_latitude: lat,
        homestay_longitude: lng,
        ...restData
      } = memberDetailQuery.data.data;

      setLng(Number(lng));
      setLat(Number(lat));
      reset({ profile, ...restData }, { keepDefaultValues: true });
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
              defaultSrc={"/images/image/grey.png"}
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
            <div className={styles.inputGroup}>
              <Input
                {...register("homestay_name", {
                  required: true,
                })}
                autoComplete="off"
                label="Nama Homestay:"
                id="homestay_name"
                required={true}
                isInvalid={errors["homestay_name"] !== undefined}
                errMsg={errors["homestay_name"] ? "Tidak boleh kosong" : ""}
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <TextArea
              {...register("homestay_address", {
                required: true,
              })}
              label="Alamat Homestay:"
              id="homestay_address"
              required={true}
              isInvalid={errors["homestay_address"] !== undefined}
              errMsg={errors["homestay_address"] ? "Tidak boleh kosong" : ""}
            />
          </div>
          <Map lat={lat} lng={lng} onClick={onMapClick} />
          <div className={styles.inputGroup}>
            <Input
              {...register("homestay_latitude", {})}
              autoComplete="off"
              label="Homestay Latitude:"
              id="homestay_latitude"
              type="hidden"
              value={lat}
              required={true}
              onChange={(e) => {
                const val = Number(e.target.value);
                setLat(val ? val : defLat);
              }}
              isInvalid={errors["homestay_latitude"] !== undefined}
              errMsg={errors["homestay_latitude"] ? "Tidak boleh kosong" : ""}
            />
          </div>
          <div className={styles.inputGroup}>
            <Input
              {...register("homestay_longitude", {})}
              autoComplete="off"
              label="Homestay Longitude:"
              id="homestay_longitude"
              type="hidden"
              value={lng}
              required={true}
              onChange={(e) => {
                const val = Number(e.target.value);
                setLng(val ? val : defLng);
              }}
              isInvalid={errors["homestay_longitude"] !== undefined}
              errMsg={errors["homestay_longitude"] ? "Tidak boleh kosong" : ""}
            />
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
