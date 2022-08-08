import type { MapMouseEvent, EventData } from "mapbox-gl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { idDate } from "@/lib/fmt";
import { useFindActivePeriod } from "@/services/period";
import { usePositionsQuery } from "@/services/position";
import { addMember } from "@/services/member";
import AvatarPicker from "@/components/avatarpicker";
import Select from "@/components/select";
import Checkbox from "@/components/checkbox";
import Input from "@/components/input";
import DynamicSelect from "@/components/dynamicselect";
import ImagePicker from "@/components/imagepicker";
import Button from "@/components/button";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

export type MemberAddFormType = "add";

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
  const [positionCache, setPositionCache] = useState<Record<number, number>>(
    {}
  );

  const defaultValues = {
    profile: [],
    id_card: [],
    username: "",
    password: "",
    name: "",
    wa_phone: "",
    other_phone: "",
    position_id: "",
    period_id: "",
    is_admin: false,
  };
  const {
    register,
    handleSubmit,
    reset,
    resetField,
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

  const onSubmit = (position: Record<number, number>) =>
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
      <form className={styles.drawerBody} onSubmit={onSubmit(positionCache)}>
        <div className={styles.drawerContent}>
          <AvatarPicker
            {...register("profile")}
            text="Ubah"
            defaultSrc={"/images/image/person.png"}
            className={styles.avatarPicker}
            onErr={() => onPickErr()}
            onRemove={() => resetField("profile")}
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
          <Button
            colorScheme="green"
            type="submit"
            className={styles.formBtn}
            data-testid="submit-member-btn"
          >
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
