import type { MapMouseEvent, EventData } from "mapbox-gl";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// import Image from "next/image";
import { RiCloseLine, RiCheckFill } from "react-icons/ri";
import { useMemberDetailQuery, updateProfile } from "@/services/member";
import AvatarPicker from "@/components/avatarpicker";
import Input from "@/components/input";
import TextArea from "@/components/textarea";
import Button from "@/components/button";
import Toast, { useToast } from "@/components/toast";
import ToastComponent from "@/layout/toastcomponent";
import InputErrMsg from "@/layout/inputerrmsg";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const Map = dynamic(() => import("@/layout/map"), {
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

  const { toast, props } = useToast();

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

      updateProfile(formData)
        .then(() => {
          toast({
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
          toast({
            status: "error",
            render: () => <ToastComponent title="Error" message={e.message} />,
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
              //   imgElement={<Image layout="fill" alt="avatar picker" />}
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
              />
              {errors.username ? (
                <InputErrMsg>This field is required</InputErrMsg>
              ) : (
                <></>
              )}
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
              {errors.password ? (
                <InputErrMsg>This field is required</InputErrMsg>
              ) : (
                <></>
              )}
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
              />
              {errors.name ? (
                <InputErrMsg>This field is required</InputErrMsg>
              ) : (
                <></>
              )}
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
              />
              {errors["wa_phone"] ? (
                <InputErrMsg>This field is required</InputErrMsg>
              ) : (
                <></>
              )}
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
              />
              {errors["wa_phone"] ? (
                <InputErrMsg>This field is required</InputErrMsg>
              ) : (
                <></>
              )}
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
              />
              {errors["homestay_name"] ? (
                <InputErrMsg>This field is required</InputErrMsg>
              ) : (
                <></>
              )}
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
            />
            {errors["homestay_address"] ? (
              <InputErrMsg>This field is required</InputErrMsg>
            ) : (
              <></>
            )}
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
            />
            {errors["homestay_latitude"] ? (
              <InputErrMsg>This field is required</InputErrMsg>
            ) : (
              <></>
            )}
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
            />
            {errors["homestay_longitude"] ? (
              <InputErrMsg>This field is required</InputErrMsg>
            ) : (
              <></>
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
