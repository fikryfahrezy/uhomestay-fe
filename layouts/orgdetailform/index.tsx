import type { PeriodRes } from "@/services/period";
import { useState } from "react";
import { useMutation } from "react-query";
import Input from "cmnjg-sb/dist/input";
import Button from "cmnjg-sb/dist/button";
import Label from "cmnjg-sb/dist/label";
import { yyyyMm } from "@/lib/fmt";
import {
  usePeriodStructureQuery,
  removePeriod,
  changePeriodStatus,
} from "@/services/period";
import Modal from "@/layouts/modal";
import OrgGoalView from "@/layouts/orggoalview";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

export type OrgDetailFormType = "delete" | "active";

const defaultFunc = () => {};

type OrgEditFormProps = {
  prevData: PeriodRes;
  onEdited: () => void;
  onError: (type: OrgDetailFormType, title?: string, message?: string) => void;
  onLoading: (type: OrgDetailFormType, title?: string, message?: string) => void;
};

const OrgEditForm = ({
  prevData,
  onEdited = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
}: OrgEditFormProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [goalModalOpen, setGoalMoalOpen] = useState(false);
  const periodStructureQuery = usePeriodStructureQuery(prevData.id, {
    enabled: !!prevData.id,
  });

  const changePeriodStatusMutation = useMutation<
    unknown,
    unknown,
    {
      id: Parameters<typeof changePeriodStatus>[0];
      data: Parameters<typeof changePeriodStatus>[1];
    }
  >(({ id, data }) => {
    return changePeriodStatus(id, data);
  });

  const removePeriodMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof removePeriod>[0]
  >((id) => {
    return removePeriod(id);
  });

  const onDelete = (id: number) => {
    onLoading("delete", "Loading menghapus periode");

    removePeriodMutation
      .mutateAsync(id)
      .then(() => {
        onEdited();
      })
      .catch((e) => {
        onError("delete", "Error menghapus periode", e.message);
      });
  };

  const onChangeStatus = (prevData: PeriodRes) => {
    const data = {
      is_active: !prevData["is_active"],
    };

    onLoading("active", "Loading mengubah status periode");

    changePeriodStatusMutation
      .mutateAsync({ data, id: prevData.id })
      .then(() => {
        onEdited();
      })
      .catch((e) => {
        onError("active", "Error mengubah status periode", e.message);
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
              data-testid="activate-org-struct-btn"
            >
              Aktifasi
            </Button>
          </>
          <Button
            colorScheme="red"
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
            mission: periodStructureQuery.data.data.mission,
            vision: periodStructureQuery.data.data.vision,
          }}
          onClose={() => onGoalModalClose()}
        />
      )}
    </>
  );
};

export default OrgEditForm;
