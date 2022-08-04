import type { PeriodRes } from "@/services/period";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { usePeriodStructureQuery, removePeriod } from "@/services/period";
import Input from "@/components/input";
import Button from "@/components/button";
import Label from "@/components/label";
import Drawer from "@/components/drawer";
import Modal from "@/layouts/modal";
import OrgStructDetail from "@/layouts/orgstructdetail";
import OrgGoalView from "@/layouts/orggoalview";
import styles from "./Styles.module.css";

export type OrgEditFormType = "edit" | "delete";

const defaultFunc = () => {};

type OnEvent = (
  type: OrgEditFormType,
  title?: string,
  message?: string
) => void;

type OrgEditFormProps = {
  prevData: PeriodRes;
  onCancel: () => void;
  onSubmited: OnEvent;
  onError: OnEvent;
  onLoading: OnEvent;
};

const OrgEditForm = ({
  prevData,
  onSubmited = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
}: OrgEditFormProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [structFormOpen, setStructFormOpen] = useState(false);
  const [goalModalOpen, setGoalMoalOpen] = useState(false);

  const defaultValues = {
    start_date: "",
    end_date: "",
  };
  const {
    register,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const periodStructureQuery = usePeriodStructureQuery(prevData.id, {
    enabled: !!prevData.id,
  });

  const removePeriodMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof removePeriod>[0]
  >((id) => {
    return removePeriod(id);
  });

  const onReset = (type: OrgEditFormType, title: string) => {
    reset(defaultValues, { keepDefaultValues: true });
    onSubmited(type, title);
  };

  const onDelete = (id: number) => {
    onLoading("delete", "Loading menghapus periode");

    removePeriodMutation
      .mutateAsync(id)
      .then(() => {
        onReset("delete", "Sukses menghapus periode");
      })
      .catch((e) => {
        onError("delete", "Error menghapus periode", e.message);
      });
  };

  const onConfirmDelete = () => {
    setModalOpen(true);
  };

  const onCancelDelete = () => {
    setModalOpen(false);
  };

  const onStructFormClose = () => {
    setStructFormOpen(false);
  };

  const onStructFormOpen = () => {
    setStructFormOpen(true);
  };

  const onGoalModalOpen = () => {
    setGoalMoalOpen(true);
  };

  const onGoalModalClose = () => {
    setGoalMoalOpen(false);
  };

  useEffect(() => {
    if (prevData !== null) {
      const { start_date: startDate, end_date: endDate } = prevData;

      reset(
        {
          start_date: startDate,
          end_date: endDate,
        },
        { keepDefaultValues: true }
      );
    }
  }, [prevData, reset]);

  return (
    <>
      <h2 className={styles.drawerTitle}>Detail Periode Organisasi</h2>
      <form className={styles.drawerBody} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.drawerContent}>
          <div className={styles.inputGroup}>
            <Input
              {...register("start_date", {
                required: true,
              })}
              autoComplete="off"
              label="Awal Periode:"
              id="start_date"
              type="month"
              min={prevData["start_date"]}
              required={true}
              readOnly={true}
              isInvalid={errors["start_date"] !== undefined}
              errMsg={errors["start_date"] ? "Tidak boleh kosong" : ""}
            />
          </div>
          <div className={styles.inputGroup}>
            <Input
              {...register("end_date", {
                required: true,
              })}
              autoComplete="off"
              label="Akhir Periode:"
              id="end_date"
              type="month"
              required={true}
              readOnly={true}
              isInvalid={errors["end_date"] !== undefined}
              errMsg={errors["end_date"] ? "Tidak boleh kosong" : ""}
            />
          </div>
          <div className={styles.inputGroup}>
            <Label>Struktur Organisasi</Label>
            <Button
              className={styles.formBtn}
              type="button"
              onClick={() => onStructFormOpen()}
            >
              Lihat
            </Button>
          </div>
          <div className={styles.inputGroup}>
            <Label>Visi &amp; Misi</Label>
            <Button
              className={styles.formBtn}
              type="button"
              onClick={() => onGoalModalOpen()}
            >
              Lihat
            </Button>
          </div>
        </div>
        <div>
          <Button
            colorScheme="red"
            type="button"
            className={styles.formBtn}
            onClick={() => onConfirmDelete()}
            data-testid="remove-period-btn"
          >
            Hapus
          </Button>
        </div>
      </form>
      <Drawer
        isOpen={structFormOpen}
        onClose={() => onStructFormClose()}
        withBackdrop={false}
        data-testid="drawer-org-struct"
      >
        {structFormOpen ? (
          periodStructureQuery.isLoading || periodStructureQuery.isIdle ? (
            "Loading..."
          ) : periodStructureQuery.error ? (
            "An error has occurred: " + periodStructureQuery.error.message
          ) : (
            <OrgStructDetail
              prevData={periodStructureQuery.data.data.positions}
            />
          )
        ) : (
          <></>
        )}
      </Drawer>
      {periodStructureQuery.isLoading || periodStructureQuery.isIdle ? (
        "Loading..."
      ) : periodStructureQuery.error ? (
        "An error has occurred: " + periodStructureQuery.error.message
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

export default OrgEditForm;
