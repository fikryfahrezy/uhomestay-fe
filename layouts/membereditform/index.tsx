import type { MapMouseEvent, EventData } from "mapbox-gl";
import type { MemberOut } from "@/services/member";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { idDate } from "@/lib/fmt";
import {
  useMemberDetailQuery,
  editMember,
  removeMember,
  approveMember,
} from "@/services/member";
import { useFindActivePeriod } from "@/services/period";
import { usePositionsQuery } from "@/services/position";
import Button from "cmnjg-sb/dist/button";
import TextArea from "cmnjg-sb/dist/textarea";
import Input from "cmnjg-sb/dist/input";
import Checkbox from "cmnjg-sb/dist/checkbox";
import Select from "cmnjg-sb/dist/select";
import AvatarPicker from "cmnjg-sb/dist/avatarpicker";
import Toast from "cmnjg-sb/dist/toast";
import useToast from "cmnjg-sb/dist/toast/useToast";
import Modal from "@/layouts/modal";
import ToastComponent from "@/layouts/toastcomponent";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Map = dynamic(() => import("@/layouts/map"), {
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
    formState: { errors },
  } = useForm({ defaultValues });

  const periodQuery = useFindActivePeriod();
  const positionsQuery = usePositionsQuery();
  const memberDetailQuery = useMemberDetailQuery(prevData.id, {
    enabled: !!prevData.id,
  });
  const { toast, updateToast, props } = useToast();

  const approveMemberMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof approveMember>[0]
  >((id) => {
    return approveMember(id);
  });

  const removeMemberMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof removeMember>[0]
  >((id) => {
    return removeMember(id);
  });

  const editMemberMutation = useMutation<
    unknown,
    unknown,
    {
      id: Parameters<typeof editMember>[0];
      data: Parameters<typeof editMember>[1];
    }
  >(({ id, data }) => {
    return editMember(id, data);
  });

  const onReset = () => {
    reset(defaultValues, { keepDefaultValues: true });
    onEdited();
  };

  const onDelete = (id: string) => {
    const lastId = toast({
      status: "info",
      duration: 999999,
      render: () => <ToastComponent title="Loading menghapus anggota" />,
    });

    removeMemberMutation
      .mutateAsync(id)
      .then(() => {
        onReset();
      })
      .catch((e) => {
        updateToast(lastId, {
          status: "error",
          render: () => (
            <ToastComponent
              title="Error menghapus anggota"
              message={e.message}
              data-testid="toast-modal"
            />
          ),
        });
      });
  };

  const onApprove = (id: string) => {
    const lastId = toast({
      status: "info",
      duration: 999999,
      render: () => <ToastComponent title="Loading menyetujui anggota" />,
    });

    approveMemberMutation
      .mutateAsync(id)
      .then(() => {
        onReset();
      })
      .catch((e) => {
        updateToast(lastId, {
          status: "error",
          render: () => (
            <ToastComponent
              title="Error menyetujui anggota"
              message={e.message}
              data-testid="toast-modal"
            />
          ),
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

      const lastId = toast({
        status: "info",
        duration: 999999,
        render: () => <ToastComponent title="Loading mengubah anggota" />,
      });

      editMemberMutation
        .mutateAsync({ id, data: formData })
        .then(() => {
          onReset();
        })
        .catch((e) => {
          updateToast(lastId, {
            status: "error",
            render: () => (
              <ToastComponent
                title="Error mengubah anggota"
                message={e.message}
                data-testid="toast-modal"
              />
            ),
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
        position_id: posId,
        period_id: perId,
        ...restData
      } = memberDetailQuery.data.data;

      reset(
        {
          profile,
          position_id: posId === 0 ? "" : String(posId),
          period_id: perId === 0 ? "" : String(perId),
          ...restData,
        },
        { keepDefaultValues: true }
      );
    }
  }, [memberDetailQuery.data, reset]);

  return (
    <>
      {isEditable ? (
        <h2 className={styles.drawerTitle}>Ubah Anggota</h2>
      ) : (
        <h2 className={styles.drawerTitle}>Detail Anggota</h2>
      )}
      {memberDetailQuery.isLoading ? (
        "Loading..."
      ) : memberDetailQuery.error ? (
        <ErrMsg />
      ) : (
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
                readOnly={!isEditable}
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
                readOnly={!isEditable}
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
                readOnly={!isEditable}
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
                readOnly={!isEditable}
                isInvalid={errors["other_phone"] !== undefined}
                errMsg={errors["other_phone"] ? "Tidak boleh kosong" : ""}
              />
            </div>
            <div className={styles.inputGroup}>
              {positionsQuery.isLoading ? (
                "Loading..."
              ) : positionsQuery.error ? (
                <ErrMsg />
              ) : (
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
                  errMsg={errors["position_id"] ? "Tidak boleh kosong" : ""}
                >
                  {memberDetailQuery.data?.data["position_id"] === 0 ? (
                    <option value="">Pilih Jabatan</option>
                  ) : (
                    <option value={memberDetailQuery.data?.data["position_id"]}>
                      {memberDetailQuery.data?.data.position}
                    </option>
                  )}
                  {positionsQuery.data?.data.positions
                    .sort((a, b) => a.level - b.level)
                    .filter(
                      ({ id }) =>
                        id !== memberDetailQuery.data?.data["position_id"]
                    )
                    .map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                </Select>
              )}
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
                  label="Periode Jabatan:"
                  id="period"
                  required={true}
                  disabled={!isEditable}
                  isInvalid={errors["period_id"] !== undefined}
                  errMsg={errors["period_id"] ? "Tidak boleh kosong" : ""}
                ></Select>
              ) : (
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
                  errMsg={errors["period_id"] ? "Tidak boleh kosong" : ""}
                >
                  {memberDetailQuery.data?.data["period_id"] === 0 ? (
                    <option value="">Pilih Periode</option>
                  ) : (
                    <option value={memberDetailQuery.data?.data["period_id"]}>
                      {idDate(
                        new Date(
                          (memberDetailQuery.data?.data.period as string).split(
                            " / "
                          )[0]
                        )
                      )}{" "}
                      /{" "}
                      {idDate(
                        new Date(
                          (memberDetailQuery.data?.data.period as string).split(
                            " / "
                          )[1]
                        )
                      )}
                    </option>
                  )}
                  {memberDetailQuery.data?.data["period_id"] !==
                  periodQuery.data?.data.id ? (
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
                  ) : (
                    <></>
                  )}
                </Select>
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
                readOnly={!isEditable}
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
                readOnly={!isEditable}
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
                readOnly={!isEditable}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLng(val ? val : defLng);
                }}
                isInvalid={errors["homestay_longitude"] !== undefined}
                errMsg={
                  errors["homestay_longitude"] ? "Tidak boleh kosong" : ""
                }
              />
            </div>
            <div className={styles.inputGroup}>
              <Checkbox
                {...register("is_admin")}
                id="is_admin"
                disabled={!isEditable}
                isInvalid={errors["is_admin"] !== undefined}
                errMsg={errors["is_admin"] ? "Tidak boleh kosong" : ""}
              >
                Admin
              </Checkbox>
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
      )}
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
