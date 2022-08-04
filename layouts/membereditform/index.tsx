import type { MapMouseEvent, EventData } from "mapbox-gl";
import type { MemberOut, MemberPosition } from "@/services/member";
import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";
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
import Button from "@/components/button";
import TextArea from "@/components/textarea";
import Input from "@/components/input";
import Checkbox from "@/components/checkbox";
import Select from "@/components/select";
import DynamicSelect from "@/components/dynamicselect";
import AvatarPicker from "@/components/avatarpicker";
import Modal from "@/layouts/modal";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

export type MemberEditFormType = "edit" | "delete" | "approve";

const Map = dynamic(() => import("@/layouts/map"), {
  loading: () => <p>...</p>,
});

const defLng = 107.79054317790919;
const defLat = -7.153238933398519;

const limLng = 180;
const limLat = 90;

const defaultFunc = () => {};

type OnEvent = (
  type: MemberEditFormType,
  title?: string,
  message?: string
) => void;

type MemberEditFormProps = {
  prevData: MemberOut;
  onCancel: () => void;
  onSubmited: OnEvent;
  onError: OnEvent;
  onLoading: OnEvent;
};

const MemberEditForm = ({
  prevData,
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
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
  const [isEditOrg, setEditOrg] = useState(false);
  const [positionCache, setPositionCache] = useState<Record<number, number>>(
    {}
  );

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

  const prevPos = useMemo(() => {
    const data = memberDetailQuery.data;
    if (data === undefined) {
      return { str: "", obj: {} };
    }

    const prevPosObj: Record<number, number> = {};
    let prevPosStr = "";
    data.data.positions.forEach(({ id }) => {
      prevPosObj[id] = id;
      prevPosStr = `${prevPosStr}${id}, `;
    });

    return { str: prevPosStr, obj: prevPosObj };
  }, [memberDetailQuery.data]);

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

  const onReset = (type: MemberEditFormType, title: string) => {
    reset(defaultValues, { keepDefaultValues: true });
    onSubmited(type, title);
  };

  const onDelete = (id: string) => {
    onLoading("delete", "Loading menghapus anggota");

    removeMemberMutation
      .mutateAsync(id)
      .then(() => {
        onReset("delete", "Sukses menghapus anggota");
      })
      .catch((e) => {
        onError("delete", "Error menghapus anggota", e.message);
      });
  };

  const onApprove = (id: string) => {
    onLoading("approve", "Loading menyetujui anggota");

    approveMemberMutation
      .mutateAsync(id)
      .then(() => {
        onReset("approve", "Sukses menyetujui anggota");
      })
      .catch((e) => {
        onError("approve", "Error menyetujui anggota", e.message);
      });
  };

  const onSubmit = (
    id: string,
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

      onLoading("edit", "Loading mengubah anggota");

      editMemberMutation
        .mutateAsync({ id, data: formData })
        .then(() => {
          onReset("edit", "Sukses mengubah anggota");
        })
        .catch((e) => {
          onError("edit", "Error mengubah anggota", e.message);
        });
    });

  const onSetEditable = () => {
    setEditable(true);
  };

  const onMapClick = (e: MapMouseEvent & EventData) => {
    const { lng, lat } = e.lngLat;

    setLng(lng);
    setLat(lat);
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

  const onEditOrg = () => {
    setValue("period_id", "");
    setValue("position_id", "");
    setPositionCache({});
    setEditOrg(true);
  };

  const onCancelEditOrg = (periodId: string, { str, obj }: typeof prevPos) => {
    setValue("period_id", periodId);
    setValue("position_id", str);
    setPositionCache(obj);
    setEditOrg(false);
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
    onError("edit", "Error tipe file", "File bukan bertipe gambar");
  };

  useEffect(() => {
    if (memberDetailQuery.data !== undefined) {
      const {
        id,
        period,
        positions,
        is_approved: isApproved,
        profile_pic_url: profile,
        period_id: perId,
        ...restData
      } = memberDetailQuery.data.data;

      reset(
        {
          profile,
          position_id: positions.reduce(
            (prevValue, { id }) => `${prevValue}${id}, `,
            ""
          ),
          period_id: perId === 0 ? "" : String(perId),
          ...restData,
        },
        { keepDefaultValues: true }
      );
      setPositionCache(() => {
        const newCache: Record<number, number> = {};
        positions.forEach(({ id }) => {
          newCache[id] = id;
        });

        return newCache;
      });
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
        <form
          className={styles.drawerBody}
          onSubmit={onSubmit(prevData.id, positionCache, { lat, lng })}
        >
          <div className={styles.drawerContent}>
            <AvatarPicker
              {...register("profile")}
              text="Ubah"
              defaultSrc={"/images/image/person.png"}
              className={styles.avatarPicker}
              disabled={!isEditable}
              onErr={() => onPickErr()}
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
              {periodQuery.isLoading ? (
                "Loading..."
              ) : periodQuery.error ? (
                <Select
                  {...register("period_id", {
                    required: true,
                  })}
                  id="period_id"
                  label="Ubah Periode Organisasi:"
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
                  })}
                  id="period_id"
                  label="Ubah Periode Organisasi:"
                  disabled={!isEditOrg}
                  isInvalid={errors["period_id"] !== undefined}
                  errMsg={errors["period_id"] ? "Tidak boleh kosong" : ""}
                >
                  {isEditOrg && periodQuery.data?.data.id !== 0 ? (
                    <option disabled value="">
                      Pilih Periode
                    </option>
                  ) : periodQuery.data?.data.id !== 0 ? (
                    <option disabled value="">
                      - Tidak Dalam Organisasi -
                    </option>
                  ) : (
                    <option disabled value="">
                      - Tidak Ada Periode Aktif -
                    </option>
                  )}
                  {isEditOrg && periodQuery.data?.data.id !== 0 ? (
                    <option value={periodQuery.data?.data.id}>
                      {idDate(
                        new Date(periodQuery.data?.data["start_date"] || "")
                      )}{" "}
                      /{" "}
                      {idDate(
                        new Date(periodQuery.data?.data["end_date"] || "")
                      )}
                    </option>
                  ) : (
                    <></>
                  )}
                  {!isEditOrg &&
                  memberDetailQuery.data?.data["period_id"] !== 0 ? (
                    <option value={memberDetailQuery.data?.data["period_id"]}>
                      {idDate(
                        new Date(
                          memberDetailQuery.data?.data.period.split(" / ")[0] ||
                            ""
                        )
                      )}{" "}
                      /{" "}
                      {idDate(
                        new Date(
                          memberDetailQuery.data?.data.period.split(" / ")[1] ||
                            ""
                        )
                      )}
                    </option>
                  ) : (
                    <></>
                  )}
                </Select>
              )}
            </div>
            <div className={styles.inputGroup}>
              {isEditOrg ? (
                positionsQuery.isLoading ? (
                  "Loading..."
                ) : positionsQuery.error ? (
                  <ErrMsg />
                ) : (
                  <DynamicSelect
                    {...register("position_id", {
                      required: true,
                    })}
                    required={true}
                    id="position_id"
                    label="Ubah Jabatan Organisasi:"
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
                    <option key="disabled" value="">
                      Pilih Jabatan
                    </option>
                    {positionsQuery.data?.data.positions.map(({ id, name }) => {
                      return (
                        <option
                          key={id}
                          value={id}
                          disabled={positionCache[id] !== undefined}
                        >
                          {name}
                        </option>
                      );
                    })}
                  </DynamicSelect>
                )
              ) : (
                <DynamicSelect
                  {...register("position_id", {
                    required: true,
                  })}
                  disabled={true}
                  id="position_id"
                  label="Jabatan pada Periode Organiasi Sekarang atau Sebelumnya:"
                  isInvalid={errors["position_id"] !== undefined}
                  errMsg={errors["position_id"] ? "Tidak boleh kosong" : ""}
                  selects={
                    memberDetailQuery.data?.data.positions.length === 0
                      ? [{ key: 0, value: "", defaultValue: "" }]
                      : (memberDetailQuery.data?.data.positions || [])
                          .sort((a, b) => a.level - b.level)
                          .map(({ id }) => {
                            return {
                              key: id,
                              value: id,
                              defaultValue: id,
                            };
                          })
                  }
                >
                  {memberDetailQuery.data?.data.positions.length === 0 ? (
                    <option key="disabled" value="">
                      Tidak memiliki jabatan
                    </option>
                  ) : (
                    (memberDetailQuery.data?.data.positions || []).map(
                      ({ id, name }) => {
                        return (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        );
                      }
                    )
                  )}
                </DynamicSelect>
              )}
            </div>
            <div className={styles.inputGroup}>
              {isEditOrg ? (
                <Button
                  className={styles.formBtn}
                  type="button"
                  onClick={() =>
                    onCancelEditOrg(
                      String(memberDetailQuery.data?.data["period_id"] || ""),
                      prevPos
                    )
                  }
                >
                  Batal Ubah Organisasi
                </Button>
              ) : isEditable ? (
                <Button
                  className={styles.formBtn}
                  type="button"
                  onClick={() => onEditOrg()}
                >
                  Ubah Organisasi
                </Button>
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
    </>
  );
};

export default MemberEditForm;
