import type { MemberHomestaysRes } from "@/services/member-homestay";
import type { SelectProp } from "@/components/dynamicsimageselect";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { useFindHomestay } from "@/services/member-homestay";
import { RiCloseLine } from "react-icons/ri";
import { UniversalPortal } from "@/lib/react-portal-universal";
import IconButton from "@/components/iconbutton";
import DynamicImageSelect from "@/components/dynamicsimageselect";
import Input from "@/components/input";
import TextArea from "@/components/textarea";
import Label from "@/components/label";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Map = dynamic(() => import("@/layouts/map"), {
  loading: () => <p>...</p>,
});

const defaultFunc = () => {};

type HomestayViewProps = {
  prevData: MemberHomestaysRes & { uid: string };
  isOpen: boolean;
  onCancel: () => void;
};

const HomestayViewModal = ({
  prevData,
  isOpen = false,
  onCancel = defaultFunc,
}: HomestayViewProps) => {
  const [lng, setLng] = useState(107.79054317790919);
  const [lat, setLat] = useState(-7.153238933398519);
  const [imageIds, setImageIds] = useState<SelectProp[]>([]);

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
  const { register, reset } = useForm({ defaultValues });

  const onClose = () => {
    onCancel();
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
    <UniversalPortal selector="#modal">
      <div className={styles.modal}>
        <div className={styles.modalBody}>
          <h2>Detail Homestay</h2>
          {memberHomestay.isLoading || memberHomestay.isFetching ? (
            "Loading..."
          ) : memberHomestay.error ? (
            <ErrMsg />
          ) : (
            <form onSubmit={(e) => e.preventDefault()}>
              <div className={styles.inputGroup}>
                <Input
                  {...register("name")}
                  autoComplete="off"
                  label="Nama Homestay:"
                  id="name"
                  readOnly={true}
                />
              </div>
              <div className={styles.inputGroup}>
                <TextArea
                  {...register("address")}
                  label="Alamat:"
                  id="address"
                  className={styles.borderBox}
                  readOnly={true}
                />
              </div>
              <div className={styles.inputGroup}>
                <DynamicImageSelect
                  {...register("image_ids")}
                  disabled={true}
                  label="Foto-foto homestay:"
                  id="image_ids"
                  selects={imageIds}
                />
              </div>
              <div className={styles.inputGroup}>
                <Label required={true}>Peta:</Label>
                <Map lat={lat} lng={lng} isEditable={false} />
              </div>
              <div className={styles.buttonContainer}>
                <IconButton type="button" onClick={() => onClose()}>
                  <RiCloseLine />
                </IconButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </UniversalPortal>
  ) : (
    <></>
  );
};

export default HomestayViewModal;
