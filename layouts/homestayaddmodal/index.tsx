import type { MapMouseEvent, EventData } from "mapbox-gl";
import type { HomestayImgModalType } from "@/layouts/homestayimgmodal";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { RiCloseLine } from "react-icons/ri";
import { UniversalPortal } from "@/lib/react-portal-universal";
import { addHomestay, removeHomestayImage } from "@/services/member-homestay";
import Button from "@/components/button";
import IconButton from "@/components/iconbutton";
import Input from "@/components/input";
import TextArea from "@/components/textarea";
import Label from "@/components/label";
import DynamicImageSelect from "@/components/dynamicsimageselect";
import HomestayImageUpload from "@/layouts/homestayimgmodal";
import styles from "./Styles.module.css";

const Map = dynamic(() => import("@/layouts/map"), {
  loading: () => <p>...</p>,
});

const defaultFunc = () => {};

export type HomestayAddModalType = "add" | HomestayImgModalType;
type OnEvent = (
  type: HomestayAddModalType,
  title?: string,
  message?: string
) => void;

type HomestayAddProps = {
  prevData: { uid: string };
  isOpen: boolean;
  onCancel: () => void;
  onSubmited: OnEvent;
  onError: OnEvent;
  onLoading: OnEvent;
};

const HomestayAddModal = ({
  prevData,
  isOpen = false,
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
}: HomestayAddProps) => {
  const [lng, setLng] = useState(107.79054317790919);
  const [lat, setLat] = useState(-7.153238933398519);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

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

  const uploadFileCbFunc = useRef((_: string) => {});
  const uploadFileCloseFunc = useRef(() => {});
  const emptyArr = useRef([]);
  const imageIds = useRef<number[]>([]);

  const addHomestayMutation = useMutation<
    unknown,
    unknown,
    {
      uid: Parameters<typeof addHomestay>[0];
      data: Parameters<typeof addHomestay>[1];
    }
  >(({ uid, data }) => {
    return addHomestay(uid, data);
  });

  const removeHomestayImageMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof removeHomestayImage>[0]
  >((data) => {
    return removeHomestayImage(data);
  });

  const onClose = () => {
    onCancel();
  };

  const onMapClick = (e: MapMouseEvent & EventData) => {
    const { lng, lat } = e.lngLat;

    setLng(lng);
    setLat(lat);
  };

  const onSubmit = (
    uid: string,
    { lat, lng }: { lat: number; lng: number },
    imageIds: number[]
  ) =>
    handleSubmit((data) => {
      onLoading("add", "Loading menambahkan homestay");

      addHomestayMutation
        .mutateAsync({
          uid,
          data: {
            ...data,
            latitude: String(lat),
            longitude: String(lng),
            image_ids: imageIds,
          },
        })
        .then(() => {
          reset(defaultValues, { keepDefaultValues: true });
          onSubmited("add", "Sukses menambahkan homestay");
        })
        .catch((e) => {
          onError("add", "Error menambahkan homestay", e.message);
        });
    });

  const onRemove = (idx: number, cb: () => void) => {
    onLoading("removeimage", "Loading menghapus foto homestay");

    removeHomestayImageMutation
      .mutateAsync(imageIds.current[idx])
      .then(() => {
        onSubmited("removeimage", "Sukses menghapus foto homestay");
        cb();

        const newSelection = Array.from(imageIds.current);
        newSelection.splice(idx, 1);
        imageIds.current = newSelection;
      })
      .catch((e) => {
        onError("removeimage", "Error menghapus foto homestay", e.message);
      });
  };

  return isOpen ? (
    <>
      <UniversalPortal selector="#modal">
        <div className={styles.modal}>
          <div className={styles.modalBody}>
            <h2>Tambah Homestay</h2>
            <form
              onSubmit={onSubmit(prevData.uid, { lat, lng }, imageIds.current)}
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
                  uploadComponent={(isOpen, onClose, cb) => {
                    setAddModalOpen(isOpen);
                    uploadFileCloseFunc.current = onClose;
                    uploadFileCbFunc.current = cb;
                  }}
                  onFieldDelete={(idx, cb) => onRemove(idx, cb)}
                  selects={emptyArr.current}
                  isInvalid={errors["image_ids"] !== undefined}
                  errMsg={errors["image_ids"] ? "Tidak boleh kosong" : ""}
                />
              </div>
              <div className={styles.inputGroup}>
                <Label required={true}>Peta:</Label>
                <Map lat={lat} lng={lng} onClick={onMapClick} />
              </div>
              <div className={styles.buttonContainer}>
                <Button colorScheme="green" type="submit">
                  Tambah
                </Button>
                <IconButton type="button" onClick={() => onClose()}>
                  <RiCloseLine />
                </IconButton>
              </div>
            </form>
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
            imageIds.current.push(parsed.id);
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

export default HomestayAddModal;
