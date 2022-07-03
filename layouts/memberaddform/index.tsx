import type { MapMouseEvent, EventData } from "mapbox-gl";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { idDate } from "@/lib/fmt";
import { useFindActivePeriod } from "@/services/period";
import { usePositionsQuery } from "@/services/position";
import { addMember } from "@/services/member";
import {
  AvatarPicker,
  Select,
  Checkbox,
  Input,
  Textarea,
  Button,
  Toast,
} from "cmnjg-sb";
import { useToast } from "@/components/toast";
import ToastComponent from "@/layouts/toastcomponent";
import InputErrMsg from "@/layouts/inputerrmsg";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Map = dynamic(() => import("@/layouts/map"), {
  loading: () => <p>...</p>,
});

const defLng = 107.79054317790919;
const defLat = -7.153238933398519;

const defaultFunc = () => {};

type MemberAddFormProps = {
  onSubmited: () => void;
  onCancel: () => void;
};

const MemberAddForm = ({
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
}: MemberAddFormProps) => {
  const [lng, setLng] = useState(107.79054317790919);
  const [lat, setLat] = useState(-7.153238933398519);

  const defaultValues = {
    profile: [],
    username: "",
    password: "",
    name: "",
    wa_phone: "",
    other_phone: "",
    position_id: "",
    period_id: "",
    homestay_name: "",
    homestay_address: "",
    homestay_latitude: String(lat),
    homestay_longitude: String(lng),
    is_admin: false,
  };
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues });

  const periodQuery = useFindActivePeriod();
  const positionsQuery = usePositionsQuery();
  const { toast, props } = useToast();

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      const uv = v as unknown;
      if (uv instanceof FileList && uv.length !== 0) {
        formData.append(k, uv[0]);
      } else {
        formData.append(k, String(v));
      }
    });

    addMember(formData)
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

  const onMapClick = (e: MapMouseEvent & EventData) => {
    const { lng, lat } = e.lngLat;

    setLng(lng);
    setLat(lat);

    setValue("homestay_latitude", String(lat));
    setValue("homestay_longitude", String(lng));
  };

  return (
    <>
      <h2 className={styles.drawerTitle}>Tambah Anggota</h2>
      <form className={styles.drawerBody} onSubmit={onSubmit}>
        <div className={styles.drawerContent}>
          <AvatarPicker
            {...register("profile")}
            text="Ubah"
            defaultSrc={"/images/image/grey.png"}
            className={styles.avatarPicker}
            value={
              getValues().profile.length === 0
                ? ""
                : (getValues().profile as File[])[0].name
            }
          />
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
              {...register("password", {
                required: true,
              })}
              autoComplete="off"
              label="Password:"
              type="password"
              id="password"
              required={true}
              isInvalid={errors.password !== undefined}
            />
            {errors.password ? (
              <InputErrMsg>This field is required</InputErrMsg>
            ) : (
              <></>
            )}
          </div>
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
            {errors["other_phone"] ? (
              <InputErrMsg>This field is required</InputErrMsg>
            ) : (
              <></>
            )}
          </div>
          <div className={styles.inputGroup}>
            {positionsQuery.isLoading ? (
              "Loading..."
            ) : positionsQuery.error ? (
              <ErrMsg />
            ) : (
              <>
                <Select
                  {...register("position_id", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  label="Jabatan:"
                  id="position"
                  required={true}
                  isInvalid={errors["position_id"] !== undefined}
                >
                  <option value="">Pilih Jabatan</option>
                  {positionsQuery.data?.data.positions
                    .sort((a, b) => a.level - b.level)
                    .map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                </Select>

                {errors["position_id"] ? (
                  <InputErrMsg>This field is required</InputErrMsg>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
          <div className={styles.inputGroup}>
            {periodQuery.isLoading ? (
              "Loading..."
            ) : periodQuery.error ? (
              <>
                <Select
                  {...register("period_id", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  label="Periode Jabatan:"
                  id="period"
                  required={true}
                  isInvalid={errors["period_id"] !== undefined}
                ></Select>
                {errors["period_id"] ? (
                  <InputErrMsg>This field is required</InputErrMsg>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                <Select
                  {...register("period_id", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  label="Periode Jabatan:"
                  id="period"
                  required={true}
                  isInvalid={errors["period_id"] !== undefined}
                >
                  <option value="">Pilih Periode</option>
                  <option
                    key={periodQuery.data?.data.id}
                    value={periodQuery.data?.data.id}
                  >
                    {idDate(
                      new Date(periodQuery.data?.data["start_date"] as string)
                    )}{" "}
                    /{" "}
                    {idDate(
                      new Date(periodQuery.data?.data["end_date"] as string)
                    )}
                  </option>
                </Select>
                {errors["period_id"] ? (
                  <InputErrMsg>This field is required</InputErrMsg>
                ) : (
                  <></>
                )}
              </>
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
          <div className={styles.inputGroup}>
            <Textarea
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
          <div className={styles.inputGroup}>
            <Checkbox
              {...register("is_admin")}
              id="is_admin"
              isInvalid={errors["is_admin"] !== undefined}
            >
              Admin
            </Checkbox>

            {errors["is_admin"] ? (
              <InputErrMsg>This field is required</InputErrMsg>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div>
          <Button colorScheme="green" type="submit" className={styles.formBtn}>
            Tambah
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

export default MemberAddForm;
