import type { ChangeEvent } from "react";
import type { PeriodRes, EditPeriodIn, PositionIn } from "@/services/period";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { yyyyMm } from "@/lib/fmt";
import {
  usePeriodStructureQuery,
  editPeriod,
  removePeriod,
} from "@/services/period";
import Input from "cmnjg-sb/dist/input";
import Button from "cmnjg-sb/dist/button";
import Label from "cmnjg-sb/dist/label";
import Drawer from "cmnjg-sb/dist/drawer";
import Toast from "cmnjg-sb/dist/toast";
import useToast from "cmnjg-sb/dist/toast/useToast";
import Modal from "@/layouts/modal";
import OrgStructForm from "@/layouts/orgstructform";
import ToastComponent from "@/layouts/toastcomponent";
import OrgGoalWrite from "@/layouts/orggoalwrite";
import OrgGoalView from "@/layouts/orggoalview";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type OrgEditFormProps = {
  prevData: PeriodRes;
  onEdited: () => void;
  onCancel: () => void;
};

const OrgEditForm = ({
  prevData,
  onEdited = defaultFunc,
  onCancel = defaultFunc,
}: OrgEditFormProps) => {
  const [isEditable, setEditable] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [endDate, setEndDate] = useState(yyyyMm(new Date()));
  const [structFormOpen, setStructFormOpen] = useState(false);
  const [goalModalOpen, setGoalMoalOpen] = useState(false);
  const [positions, setPositions] = useState<PositionIn[] | null>(null);
  const [goal, setGoal] = useState<Record<string, string> | null>(null);

  const defaultValues = {
    start_date: "",
    end_date: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });
  const { toast, updateToast, props } = useToast();

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

  const editPeriodMutation = useMutation<
    unknown,
    unknown,
    {
      id: Parameters<typeof editPeriod>[0];
      data: Parameters<typeof editPeriod>[1];
    }
  >(({ id, data }) => {
    return editPeriod(id, data);
  });

  const onReset = () => {
    reset(defaultValues, { keepDefaultValues: true });
    onEdited();
  };

  const onDelete = (id: number) => {
    const lastId = toast({
      status: "info",
      duration: 999999,
      render: () => <ToastComponent title="Loading menghapus periode" />,
    });

    removePeriodMutation
      .mutateAsync(id)
      .then(() => {
        onReset();
      })
      .catch((e) => {
        updateToast(lastId, {
          status: "error",
          render: () => (
            <ToastComponent
              title="Error menghapus periode"
              message={e.message}
              data-testid="toast-modal"
            />
          ),
        });
      });
  };

  const onSubmit = (
    id: number,
    positions: PositionIn[] | null,
    goal: Record<string, string> | null
  ) =>
    handleSubmit((data) => {
      const newData: EditPeriodIn = {
        start_date: `${data.start_date}-01`,
        end_date: `${data.end_date}-01`,
        positions: [],
        mission: "",
        vision: "",
      };

      if (positions !== null && positions.length !== 0) {
        newData.positions = positions;
      }

      if (goal !== null && goal.mission !== undefined) {
        newData.mission = goal.mission;
      }

      if (goal !== null && goal.vision !== undefined) {
        newData.vision = goal.vision;
      }

      const lastId = toast({
        status: "info",
        duration: 999999,
        render: () => <ToastComponent title="Loading mengubah periode" />,
      });

      editPeriodMutation
        .mutateAsync({ id, data: newData })
        .then(() => {
          reset(defaultValues, { keepDefaultValues: true });
          onEdited();
        })
        .catch((e) => {
          updateToast(lastId, {
            status: "error",
            render: () => (
              <ToastComponent
                title="Error mengubah periode"
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

  const onConfirmDelete = () => {
    setModalOpen(true);
  };

  const onCancelDelete = () => {
    setModalOpen(false);
  };

  const onClose = () => {
    reset(defaultValues, { keepDefaultValues: true });
    onCancel();
  };

  const onStructFormClose = () => {
    setStructFormOpen(false);
  };

  const onStructFormOpen = () => {
    setStructFormOpen(true);
  };

  const onStructFormModified = (positions: PositionIn[]) => {
    setPositions(positions);
    setStructFormOpen(false);
  };

  const onGoalModalOpen = () => {
    setGoalMoalOpen(true);
  };

  const onGoalModalClose = () => {
    setGoalMoalOpen(false);
  };

  const onGoalModalModified = (goal: Record<string, string>) => {
    setGoal(goal);
    setGoalMoalOpen(false);
  };

  const onStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.currentTarget.value);
  };

  useEffect(() => {
    if (prevData !== null) {
      const { start_date: startDate, end_date: endDate } = prevData;

      reset(
        {
          start_date: yyyyMm(new Date(startDate)),
          end_date: yyyyMm(new Date(endDate)),
        },
        { keepDefaultValues: true }
      );
    }
  }, [prevData, reset]);

  return (
    <>
      {isEditable ? (
        <h2 className={styles.drawerTitle}>Ubah Periode Organisasi</h2>
      ) : (
        <h2 className={styles.drawerTitle}>Detail Periode Organisasi</h2>
      )}
      <form
        className={styles.drawerBody}
        onSubmit={onSubmit(prevData.id, positions, goal)}
      >
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
              min={yyyyMm(new Date(prevData["start_date"]))}
              onChange={onStartDateChange}
              required={true}
              readOnly={!isEditable}
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
              min={endDate}
              required={true}
              readOnly={!isEditable}
              isInvalid={errors["end_date"] !== undefined}
              errMsg={errors["end_date"] ? "Tidak boleh kosong" : ""}
            />
          </div>
          <div className={styles.inputGroup}>
            <Label note="(Lewati jika ingin dibuat atau diubah nanti)">
              Struktur Organisasi
            </Label>
            {isEditable ? (
              <Button
                className={styles.formBtn}
                type="button"
                onClick={() => onStructFormOpen()}
                data-testid="edit-orgstruct-btn"
              >
                Ubah
              </Button>
            ) : (
              <Button
                className={styles.formBtn}
                type="button"
                onClick={() => onStructFormOpen()}
              >
                Lihat
              </Button>
            )}
          </div>
          <div className={styles.inputGroup}>
            <Label note="(Lewati jika ingin dibuat atau diubah nanti)">
              Visi &amp; Misi
            </Label>
            {isEditable ? (
              <Button
                className={styles.formBtn}
                type="button"
                onClick={() => onGoalModalOpen()}
                data-testid="edit-goal-btn"
              >
                Ubah
              </Button>
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
          {!isEditable ? (
            <>
              <Button
                key="edit_btn"
                colorScheme="green"
                type="button"
                className={styles.formBtn}
                onClick={() => onSetEditable()}
                data-testid="editable-period-btn"
              >
                Ubah
              </Button>
              <Button
                colorScheme="red"
                type="button"
                className={styles.formBtn}
                onClick={() => onConfirmDelete()}
                data-testid="remove-period-btn"
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
                data-testid="edit-period-btn"
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
      <Drawer
        isOpen={structFormOpen}
        onClose={() => onStructFormClose()}
        withBackdrop={false}
        data-testid="drawer-org-struct"
      >
        {periodStructureQuery.isLoading || periodStructureQuery.isIdle ? (
          "Loading..."
        ) : periodStructureQuery.error ? (
          "An error has occurred: " + periodStructureQuery.error.message
        ) : (
          <OrgStructForm
            isEditable={isEditable}
            isPositionSaved={positions !== null && positions.length !== 0}
            onSave={(positions) => onStructFormModified(positions)}
            prevData={periodStructureQuery.data.data.positions}
          />
        )}
      </Drawer>
      {periodStructureQuery.isLoading || periodStructureQuery.isIdle ? (
        "Loading..."
      ) : periodStructureQuery.error ? (
        "An error has occurred: " + periodStructureQuery.error.message
      ) : isEditable ? (
        <OrgGoalWrite
          isOpen={goalModalOpen}
          prevData={
            goal !== null
              ? goal
              : {
                  mission: periodStructureQuery.data.data.mission,
                  vision: periodStructureQuery.data.data.vision,
                }
          }
          onSave={(goal) => onGoalModalModified(goal)}
        />
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
      <Toast {...props} />
    </>
  );
};

export default OrgEditForm;
