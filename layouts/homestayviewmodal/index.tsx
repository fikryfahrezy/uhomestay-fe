import type { MapMouseEvent, EventData } from "mapbox-gl";
import type { MemberHomestaysRes } from "@/services/member-homestay";
import type { SelectProp } from "@/components/dynamicsimageselect";
import type { HomestayImgModalType } from "@/layouts/homestayimgmodal";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { useMutation } from "react-query";
import { useFindHomestay, editHomestay } from "@/services/member-homestay";
import { RiCloseLine } from "react-icons/ri";
import { UniversalPortal } from "@/lib/react-portal-universal";
import IconButton from "@/components/iconbutton";
import DynamicImageSelect from "@/components/dynamicsimageselect";
import Input from "@/components/input";
import TextArea from "@/components/textarea";
import Label from "@/components/label";
import Button from "@/components/button";
import HomestayImageUpload from "@/layouts/homestayimgmodal";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Map = dynamic(() => import("@/layouts/map"), {
  loading: () => <p>...</p>,
});

const defaultFunc = () => {};

export type HomestayAddModalType = "edit" | HomestayImgModalType;
type OnEvent = (
  type: HomestayAddModalType,
  title?: string,
  message?: string
) => void;

type HomestayViewProps = {
  prevData: MemberHomestaysRes & { uid: string };
  removeBtn?: JSX.Element;
  isOpen: boolean;
  onCancel: () => void;
  onSubmited?: OnEvent;
  onError?: OnEvent;
  onLoading?: OnEvent;
};

const HomestayViewModal = ({
  prevData,
  removeBtn,
  isOpen = false,
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
}: HomestayViewProps) => {
  const [lng, setLng] = useState(107.79054317790919);
  const [lat, setLat] = useState(-7.153238933398519);
  const [isEditable, setEditable] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [imageIds, setImageIds] = useState<SelectProp[]>([]);

  const uploadFileCbFunc = useRef((_: string) => {});
  const uploadFileCloseFunc = useRef(() => {});

  const memberHomestay = useFindHomestay(prevData.id, prevData.uid, {
    enabled: !!prevData.uid && isOpen,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const defaultValues = {
    name: "",
    address: "",
    image_ids: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const editHomestayMutation = useMutation<
    unknown,
    unknown,
    {
      id: Parameters<typeof editHomestay>[0];
      uid: Parameters<typeof editHomestay>[1];
      data: Parameters<typeof editHomestay>[2];
    }
  >(({ id, uid, data }) => {
    return editHomestay(id, uid, data);
  });

  const onSetEditable = () => {
    setEditable(true);
  };

  const onUnsetEditable = () => {
    setEditable(false);
  };

  const onClose = () => {
    onCancel();
  };

  const onMapClick = (e: MapMouseEvent & EventData) => {
    const { lng, lat } = e.lngLat;

    setLng(lng);
    setLat(lat);
  };

  const onSubmit = (
    id: number,
    uid: string,
    { lat, lng }: { lat: number; lng: number },
    imageIds: SelectProp[]
  ) =>
    handleSubmit((data) => {
      onLoading("edit", "Loading mengubah homestay");

      editHomestayMutation
        .mutateAsync({
          id,
          uid,
          data: {
            ...data,
            latitude: String(lat),
            longitude: String(lng),
            image_ids: imageIds.map(({ key }) => Number(key)),
          },
        })
        .then(() => {
          reset(defaultValues, { keepDefaultValues: true });
          onSubmited("edit", "Sukses mengubah homestay");
        })
        .catch((e) => {
          onError("edit", "Error mengubah homestay", e.message);
        });
    });

  const onRemove = (idx: number, cb: () => void) => {
    cb();
    setImageIds((imageIds) => {
      const newSelection = Array.from(imageIds);
      newSelection.splice(idx, 1);
      return newSelection;
    });
  };

  useEffect(() => {
    if (memberHomestay.data !== undefined) {
      const { address, name, latitude, longitude, images } =
        memberHomestay.data.data;

      setImageIds(images.map(({ id, url }) => ({ key: id, value: url })));
      setLng(Number(longitude));
      setLat(Number(latitude));
      reset({ name, address }, { keepDefaultValues: true });
    }
  }, [memberHomestay.data, reset]);

  return isOpen ? (
    <>
      <UniversalPortal selector="#modal">
        <div className={styles.modal}>
          <div className={styles.modalBody}>
            {isEditable ? <h2>Ubah Homestay</h2> : <h2>Detail Homestay</h2>}
            {memberHomestay.isLoading || memberHomestay.isFetching ? (
              "Loading..."
            ) : memberHomestay.error ? (
              <ErrMsg />
            ) : (
              <form
                onSubmit={onSubmit(
                  prevData.id,
                  prevData.uid,
                  { lat, lng },
                  imageIds
                )}
              >
                <div className={styles.inputGroup}>
                  <Input
                    {...register("name", {
                      required: true,
                    })}
                    autoComplete="off"
                    label="Nama Homestay:"
                    id="name"
                    required={true}
                    readOnly={!isEditable}
                    isInvalid={errors.name !== undefined}
                    errMsg={errors.name ? "Tidak boleh kosong" : ""}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <TextArea
                    {...register("address", {
                      required: true,
                    })}
                    required={true}
                    label="Alamat:"
                    id="address"
                    className={styles.borderBox}
                    readOnly={!isEditable}
                    isInvalid={errors.address !== undefined}
                    errMsg={errors.address ? "Tidak boleh kosong" : ""}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <DynamicImageSelect
                    {...register("image_ids", {
                      required: true,
                    })}
                    required={true}
                    label="Foto-foto homestay:"
                    id="image_ids"
                    disabled={!isEditable}
                    uploadComponent={(isOpen, onClose, cb) => {
                      setAddModalOpen(isOpen);
                      uploadFileCloseFunc.current = onClose;
                      uploadFileCbFunc.current = cb;
                    }}
                    onFieldDelete={(idx, cb) => onRemove(idx, cb)}
                    selects={imageIds}
                    isInvalid={errors["image_ids"] !== undefined}
                    errMsg={errors["image_ids"] ? "Tidak boleh kosong" : ""}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <Label required={true}>Peta:</Label>
                  <Map
                    lat={lat}
                    lng={lng}
                    onClick={onMapClick}
                    isEditable={isEditable}
                  />
                </div>
                <div className={styles.buttonContainer}>
                  <div className={styles.actionBtnContainer}>
                    {!isEditable ? (
                      <>
                        <Button
                          key="edit_btn"
                          colorScheme="green"
                          type="button"
                          className={styles.formBtn}
                          onClick={() => onSetEditable()}
                          data-testid="editable-file-btn"
                        >
                          Ubah
                        </Button>
                        {removeBtn ? removeBtn : <></>}
                      </>
                    ) : (
                      <>
                        <Button
                          key="save_edit_btn"
                          colorScheme="green"
                          type="submit"
                          className={styles.formBtn}
                          data-testid="edit-file-btn"
                        >
                          Ubah
                        </Button>
                        <Button
                          colorScheme="red"
                          type="reset"
                          className={styles.formBtn}
                          onClick={() => onUnsetEditable()}
                        >
                          Batal
                        </Button>
                      </>
                    )}
                  </div>
                  <IconButton type="button" onClick={() => onClose()}>
                    <RiCloseLine />
                  </IconButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </UniversalPortal>
      <HomestayImageUpload
        isOpen={isAddModalOpen}
        onCancel={() => uploadFileCloseFunc.current()}
        onSubmited={(type, title, message) => {
          onSubmited(type, title, "");

          if (message !== undefined) {
            const parsed = JSON.parse(message);
            uploadFileCbFunc.current(parsed.url);

            setImageIds((imageIds) => {
              return [...imageIds, { key: parsed.id, value: parsed.url }];
            });
          }
        }}
        onError={(type, title, message) => onError(type, title, message)}
        onLoading={(type, title, message) => onLoading(type, title, message)}
      />
    </>
  ) : (
    <></>
  );
};

export default HomestayViewModal;
