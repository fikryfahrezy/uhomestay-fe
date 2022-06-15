import type { MapMouseEvent, EventData } from "mapbox-gl";
import type { MemberOut } from "@/services/member";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { idDate } from "@/lib/fmt";
import {
  useMemberDetailQuery,
  editMember,
  removeMember,
  approveMember,
} from "@/services/member";
import { useFindActivePeriod } from "@/services/period";
import { usePositionsQuery } from "@/services/position";
import AvatarPicker from "@/components/avatarpicker";
import Select from "@/components/select";
import Checkbox from "@/components/checkbox";
import Input from "@/components/input";
import TextArea from "@/components/textarea";
import Button from "@/components/button";
import Toast, { useToast } from "@/components/toast";
import Modal from "@/layout/modal";
import ToastComponent from "@/layout/toastcomponent";
import InputErrMsg from "@/layout/inputerrmsg";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const Map = dynamic(() => import("@/layout/map"), {
  loading: () => <p>...</p>,
});

const defLng = 107.79054317790919;
const defLat = -7.153238933398519;

const limLng = 180;
const limLat = 90;

const defaultFunc = () => {};

type MemberEditFormProps = {
  prevData: MemberOut;
  onEdited: () => void;
  onCancel: () => void;
};

const MemberEditForm = ({
  prevData,
  onEdited = defaultFunc,
  onCancel = defaultFunc,
}: MemberEditFormProps) => {
  const prevLng = Number(prevData["homestay_longitude"]);
  const prevLat = Number(prevData["homestay_latitude"]);

  const [lng, setLng] = useState(
    !isNaN(prevLng) && prevLng >= -1 * limLng && prevLng <= limLng
      ? prevLng
      : defLng
  );
  const [lat, setLat] = useState(
    !isNaN(prevLat) && prevLat >= -1 * limLat && prevLat <= limLat
      ? prevLat
      : defLat
  );

  const [isEditable, setEditable] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

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
    is_admin: false,
  };
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues });

  const periodQuery = useFindActivePeriod();
  const positionsQuery = usePositionsQuery();
  const memberDetailQuery = useMemberDetailQuery(prevData.id, {
    enabled: !!prevData.id,
  });
  const { toast, props } = useToast();

  const onReset = () => {
    reset(defaultValues, { keepDefaultValues: true });
    onEdited();
  };

  const onDelete = (id: string) => {
    removeMember(id)
      .then(() => {
        onReset();
      })
      .catch((e) => {
        toast({
          status: "error",
          render: () => <ToastComponent title="Error" message={e.message} />,
        });
      });
  };

  const onApprove = (id: string) => {
    approveMember(id)
      .then(() => {
        onReset();
      })
      .catch((e) => {
        toast({
          status: "error",
          render: () => <ToastComponent title="Error" message={e.message} />,
        });
      });
  };

  const onSubmit = (id: string) =>
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

      editMember(id, formData)
        .then(() => {
          onReset();
        })
        .catch((e) => {
          toast({
            status: "error",
            render: () => <ToastComponent title="Error" message={e.message} />,
          });
        });
    });

  const onSetEditable = () => {
    setEditable(true);
  };

  const onMapClick = (e: MapMouseEvent & EventData) => {
    const { lng, lat } = e.lngLat;

    setLng(lng);
    setLat(lat);

    setValue("homestay_latitude", String(lat));
    setValue("homestay_longitude", String(lng));
  };

  const onConfirmDelete = () => {
    setModalOpen(true);
  };

  const onCancelDelete = () => {
    setModalOpen(false);
  };

  const onClose = () => {
    setEditable(false);
    reset(defaultValues, { keepDefaultValues: true });
    onCancel();
  };

  useEffect(() => {
    if (memberDetailQuery.data !== undefined) {
      const {
        id,
        position,
        period,
        is_approved,
        profile_pic_url: profile,
        ...restData
      } = memberDetailQuery.data.data;

      reset({ profile, ...restData }, { keepDefaultValues: true });
    }
  }, [memberDetailQuery.data, reset]);

  return (
    <>
      {isEditable ? (
        <h2 className={styles.drawerTitle}>Ubah Anggota</h2>
      ) : (
        <h2 className={styles.drawerTitle}>Detail Anggota</h2>
      )}
      <form className={styles.drawerBody} onSubmit={onSubmit(prevData.id)}>
        <div className={styles.drawerContent}>
          <AvatarPicker
            {...register("profile")}
            text="Ubah"
            defaultSrc={"/images/image/grey.png"}
            className={styles.avatarPicker}
            disabled={!isEditable}
            src={prevData["profile_pic_url"]}
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
              readOnly={!isEditable}
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
              readOnly={!isEditable}
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
              readOnly={!isEditable}
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
              readOnly={!isEditable}
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
              readOnly={!isEditable}
              isInvalid={errors["other_phone"] !== undefined}
            />
            {errors["wa_phone"] ? (
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
                  disabled={!isEditable}
                  isInvalid={errors["position_id"] !== undefined}
                >
                  {memberDetailQuery.isLoading ? (
                    "Loading..."
                  ) : memberDetailQuery.error ? (
                    <ErrMsg />
                  ) : (
                    <option value={memberDetailQuery.data?.data["position_id"]}>
                      {memberDetailQuery.data?.data.position}
                    </option>
                  )}
                  {positionsQuery.data?.data
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
                  isInvalid={errors["period_id"] !== undefined}
                >
                  {memberDetailQuery.isLoading ? (
                    "Loading..."
                  ) : memberDetailQuery.error ? (
                    <ErrMsg />
                  ) : (
                    <option value={memberDetailQuery.data?.data["period_id"]}>
                      {idDate.format(
                        new Date(
                          (memberDetailQuery.data?.data.period as string).split(
                            "|"
                          )[0]
                        )
                      )}{" "}
                      /{" "}
                      {idDate.format(
                        new Date(
                          (memberDetailQuery.data?.data.period as string).split(
                            "|"
                          )[1]
                        )
                      )}
                    </option>
                  )}
                  <option
                    key={periodQuery.data?.data.id}
                    value={periodQuery.data?.data.id}
                  >
                    {idDate.format(
                      new Date(periodQuery.data?.data["start_date"] as string)
                    )}{" "}
                    /{" "}
                    {idDate.format(
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
              readOnly={!isEditable}
              isInvalid={errors["homestay_name"] !== undefined}
            />
            {errors["homestay_name"] ? (
              <InputErrMsg>This field is required</InputErrMsg>
            ) : (
              <></>
            )}
          </div>
          <div className={styles.inputGroup}>
            <TextArea
              {...register("homestay_address", {
                required: true,
              })}
              label="Alamat Homestay:"
              id="homestay_address"
              required={true}
              readOnly={!isEditable}
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
              readOnly={!isEditable}
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
              readOnly={!isEditable}
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
              disabled={!isEditable}
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
          {!prevData["is_approved"] ? (
            <Button
              className={styles.formBtn}
              type="button"
              onClick={() => onApprove(prevData.id)}
            >
              Setujui
            </Button>
          ) : (
            <></>
          )}
          {!isEditable ? (
            <>
              <Button
                key="edit_btn"
                colorScheme="green"
                type="button"
                className={styles.formBtn}
                onClick={() => onSetEditable()}
              >
                Ubah
              </Button>
              <Button
                colorScheme="red"
                type="button"
                className={styles.formBtn}
                onClick={() => onConfirmDelete()}
              >
                Hapus
              </Button>
            </>
          ) : (
            <>
              <Button
                key="save_edit_btn"
                colorScheme="green"
                type="submit"
                className={styles.formBtn}
              >
                Ubah
              </Button>
              <Button
                colorScheme="red"
                type="reset"
                className={styles.formBtn}
                onClick={() => onClose()}
              >
                Batal
              </Button>
            </>
          )}
        </div>
      </form>
      <Modal
        isOpen={isModalOpen}
        heading="Peringatan!"
        onCancel={() => onCancelDelete()}
        onConfirm={() => onDelete(prevData.id)}
      >
        <p>Apakah anda yakin ingin menghapus data yang dipilih?</p>
      </Modal>
      <Toast {...props} />
    </>
  );
};

export default MemberEditForm;
