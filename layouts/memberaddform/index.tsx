import type { MapMouseEvent, EventData } from "mapbox-gl";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { idDate } from "@/lib/fmt";
import { useFindActivePeriod } from "@/services/period";
import { usePositionsQuery } from "@/services/position";
import { addMember } from "@/services/member";
import AvatarPicker from "cmnjg-sb/dist/avatarpicker";
import Select from "cmnjg-sb/dist/select";
import Checkbox from "cmnjg-sb/dist/checkbox";
import Input from "cmnjg-sb/dist/input";
import TextArea from "cmnjg-sb/dist/textarea";
import DynamicSelect from "cmnjg-sb/dist/dynamicselect";
import Button from "cmnjg-sb/dist/button";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

export type MemberAddFormType = "add";

const Map = dynamic(() => import("@/layouts/map"), {
  loading: () => <p>...</p>,
});

const defLng = 107.79054317790919;
const defLat = -7.153238933398519;

const defaultFunc = () => {};

type OnEvent = (
  type: MemberAddFormType,
  title?: string,
  message?: string
) => void;

type MemberAddFormProps = {
  onCancel: () => void;
  onSubmited: OnEvent;
  onError: OnEvent;
  onLoading: OnEvent;
};

const MemberAddForm = ({
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
}: MemberAddFormProps) => {
  const [lng, setLng] = useState(107.79054317790919);
  const [lat, setLat] = useState(-7.153238933398519);
  const [positionCache, setPositionCache] = useState<Record<number, number>>(
    {}
  );

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
    getValues,
    formState: { errors },
  } = useForm({ defaultValues });

  const periodQuery = useFindActivePeriod();
  const positionsQuery = usePositionsQuery();

  const addMemberMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof addMember>[0]
  >((data) => {
    return addMember(data);
  });

  const onSubmit = (
    position: Record<number, number>,
    { lat, lng }: { lat: number; lng: number }
  ) =>
    handleSubmit((data) => {
      const { position_id: posId, ...restData } = data;
      const formData = new FormData();

      Object.entries(restData).forEach(([k, v]) => {
        const uv = v as unknown;
        if (uv instanceof FileList && uv.length !== 0) {
          formData.append(k, uv[0]);
        } else {
          formData.append(k, String(v));
        }
      });

      Object.entries(position).forEach(([_, v]) => {
        formData.append("position_ids", String(v));
      });

      formData.set("homestay_latitude", String(lat));
      formData.set("homestay_longitude", String(lng));

      onLoading("add", "Loading menambahkan anggota");

      addMemberMutation
        .mutateAsync(formData)
        .then(() => {
          reset(defaultValues, { keepDefaultValues: true });
          setPositionCache({});
          onSubmited("add", "Sukses menambahkan anggota");
        })
        .catch((e) => {
          onError("add", "Error menambahkan anggota", e.message);
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
  };

  const onSelectPosition = (currentValue: number, prevValue: number) => {
    setPositionCache((prevState) => {
      const newState = { ...prevState };

      delete newState[prevValue];
      newState[currentValue] = currentValue;

      return newState;
    });
  };

  const onDeletePosition = (val: number) => {
    setPositionCache((prevState) => {
      const newState = { ...prevState };
      delete newState[val];

      return newState;
    });
  };

  const onPickErr = () => {
    onError("add", "Error tipe file", "File bukan bertipe gambar");
  };

  return (
    <>
      <h2 className={styles.drawerTitle}>Tambah Anggota</h2>
      <form
        className={styles.drawerBody}
        onSubmit={onSubmit(positionCache, { lat, lng })}
      >
        <div className={styles.drawerContent}>
          <AvatarPicker
            {...register("profile")}
            text="Ubah"
            defaultSrc={"/images/image/person.png"}
            className={styles.avatarPicker}
            onErr={() => onPickErr()}
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
              errMsg={errors.username ? "Tidak boleh kosong" : ""}
            />
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
              errMsg={errors.password ? "Tidak boleh kosong" : ""}
            />
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
            {periodQuery.isLoading ? (
              "Loading..."
            ) : periodQuery.error ? (
              <Select
                {...register("period_id", {
                  required: true,
                  valueAsNumber: true,
                })}
                label="Periode Organisasi:"
                id="period"
                required={true}
                isInvalid={errors["period_id"] !== undefined}
                errMsg={errors["period_id"] ? "Tidak boleh kosong" : ""}
              >
                <option disabled value="">
                  - Tidak Ada Periode Aktif -
                </option>
              </Select>
            ) : (
              <Select
                {...register("period_id", {
                  required: true,
                  valueAsNumber: true,
                })}
                label="Periode Organisasi:"
                id="period"
                required={true}
                isInvalid={errors["period_id"] !== undefined}
                errMsg={errors["period_id"] ? "Tidak boleh kosong" : ""}
              >
                {periodQuery.data?.data.id !== 0 ? (
                  <>
                    <option disabled value="">
                      Pilih Periode
                    </option>
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
                  </>
                ) : (
                  <option disabled value="">
                    - Tidak Ada Periode Aktif -
                  </option>
                )}
              </Select>
            )}
          </div>
          <div className={styles.inputGroup}>
            {positionsQuery.isLoading ? (
              "Loading..."
            ) : positionsQuery.error ? (
              <ErrMsg />
            ) : (
              <DynamicSelect
                {...register("position_id", {
                  required: true,
                })}
                id="position_id"
                label="Jabatan Organisasi:"
                required={true}
                isInvalid={errors["position_id"] !== undefined}
                errMsg={errors["position_id"] ? "Tidak boleh kosong" : ""}
                onFieldDelete={(v) => onDeletePosition(Number(v))}
                onFieldChange={(cv, pv) =>
                  onSelectPosition(Number(cv), Number(pv))
                }
                selects={Object.keys(positionCache).map((key) => {
                  return {
                    key,
                    value: key,
                    defaultValue: key,
                  };
                })}
              >
                <option value="">Pilih Jabatan</option>
                {positionsQuery.data?.data.positions
                  .sort((a, b) => a.level - b.level)
                  .map(({ id, name }) => (
                    <option
                      key={id}
                      value={id}
                      disabled={positionCache[id] !== undefined}
                    >
                      {name}
                    </option>
                  ))}
              </DynamicSelect>
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
              errMsg={errors["homestay_name"] ? "Tidak boleh kosong" : ""}
            />
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
              required={true}
              onChange={(e) => {
                const val = Number(e.target.value);
                setLng(val ? val : defLng);
              }}
              isInvalid={errors["homestay_longitude"] !== undefined}
              errMsg={errors["homestay_longitude"] ? "Tidak boleh kosong" : ""}
            />
          </div>
          <div className={styles.inputGroup}>
            <Checkbox
              {...register("is_admin")}
              id="is_admin"
              isInvalid={errors["is_admin"] !== undefined}
              errMsg={errors["is_admin"] ? "Tidak boleh kosong" : ""}
            >
              Admin
            </Checkbox>
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
    </>
  );
};

export default MemberAddForm;
