import type { PeriodRes } from "@/services/period";
import { useState } from "react";
import { yyyyMm } from "@/lib/fmt";
import {
  usePeriodStructureQuery,
  removePeriod,
  changePeriodStatus,
} from "@/services/period";
import Input from "@/components/input";
import Button from "@/components/button";
import Toast, { useToast } from "@/components/toast";
import Modal from "@/layout/modal";
import Label from "@/components/label";
import ToastComponent from "@/layout/toastcomponent";
import OrgGoalView from "@/layout/orggoalview";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type OrgEditFormProps = {
  prevData: PeriodRes;
  onEdited: () => void;
};

const OrgEditForm = ({
  prevData,
  onEdited = defaultFunc,
}: OrgEditFormProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [goalModalOpen, setGoalMoalOpen] = useState(false);
  const periodStructureQuery = usePeriodStructureQuery(prevData.id, {
    enabled: !!prevData.id,
  });

  //   const { data: ps } = periodStructureQuery;
  //   const periodData = ps ? ps.data : {};

  const { toast, props } = useToast();

  const onDelete = (id: number) => {
    removePeriod(id)
      .then(() => {
        onEdited();
      })
      .catch((e) => {
        toast({
          status: "error",
          render: () => <ToastComponent title="Error" message={e.message} />,
        });
      });
  };

  const onChangeStatus = (prevData: PeriodRes) => {
    const data = {
      is_active: !prevData["is_active"],
    };

    changePeriodStatus(prevData.id, data)
      .then(() => {
        onEdited();
      })
      .catch((e) => {
        toast({
          status: "error",
          render: () => <ToastComponent title="Error" message={e.message} />,
        });
      });
  };

  const onConfirmDelete = () => {
    setModalOpen(true);
  };

  const onCancelDelete = () => {
    setModalOpen(false);
  };

  const onGoalModalOpen = () => {
    setGoalMoalOpen(true);
  };

  const onGoalModalClose = () => {
    setGoalMoalOpen(false);
  };

  return (
    <>
      <h2 className={styles.drawerTitle}>Detail Periode Organisasi</h2>
      <div className={styles.drawerBody}>
        <div className={styles.drawerContent}>
          <div className={styles.inputGroup}>
            <Input
              autoComplete="off"
              label="Awal Periode:"
              id="start_date"
              type="month"
              value={yyyyMm(new Date(prevData["start_date"]))}
              required={true}
              readOnly={true}
            />
          </div>
          <div className={styles.inputGroup}>
            <Input
              autoComplete="off"
              label="Akhir Periode:"
              id="end_date"
              type="month"
              value={yyyyMm(new Date(prevData["end_date"]))}
              required={true}
              readOnly={true}
            />
          </div>
          <div className={styles.inputGroup}>
            <Label note="(Lewati jika ingin dibuat atau diubah nanti)">
              Visi &amp; Misi
            </Label>
            {periodStructureQuery.isLoading || periodStructureQuery.isIdle ? (
              "Loading..."
            ) : periodStructureQuery.error ? (
              <ErrMsg />
            ) : (
              <Button
                className={styles.formBtn}
                type="button"
                onClick={() => onGoalModalOpen()}
              >
                Lihat
              </Button>
            )}
          </div>
        </div>
        <div>
          <>
            <p>
              <em>
                Periode organisasi sudah tidak aktif, tidak dapat diubah lagi
              </em>
            </p>
            <Button
              className={styles.formBtn}
              type="button"
              onClick={() => onChangeStatus(prevData)}
            >
              Aktifasi
            </Button>
          </>
          <Button
            colorScheme="red"
            // type="Button"
            type="button"
            className={styles.formBtn}
            onClick={() => onConfirmDelete()}
          >
            Hapus
          </Button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        heading="Peringatan!"
        onCancel={() => onCancelDelete()}
        onConfirm={() => onDelete(prevData.id)}
      >
        <p>Apakah anda yakin ingin menghapus data yang dipilih?</p>
      </Modal>
      {periodStructureQuery.isLoading || periodStructureQuery.isIdle ? (
        "Loading..."
      ) : periodStructureQuery.error ? (
        <ErrMsg />
      ) : (
        <OrgGoalView
          isOpen={goalModalOpen}
          prevData={{
            // mission: periodData.mission,
            // vision: periodData.vision,
            mission: periodStructureQuery.data.data.mission,
            vision: periodStructureQuery.data.data.vision,
          }}
          onClose={() => onGoalModalClose()}
        />
      )}

      <Toast {...props} />
    </>
  );
};

export default OrgEditForm;
