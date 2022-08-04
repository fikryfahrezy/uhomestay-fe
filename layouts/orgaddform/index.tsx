import type { ChangeEvent } from "react";
import type { AddPeriodIn, PositionIn } from "@/services/period";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Input from "@/components/input";
import Button from "@/components/button";
import Drawer from "@/components/drawer";
import Label from "@/components/label";
import { yyyyMm } from "@/lib/fmt";
import { addPeriod } from "@/services/period";
import OrgStructForm from "@/layouts/orgstructform";
import OrgGoalWrite from "@/layouts/orggoalwrite";
import styles from "./Styles.module.css";

export type OrgAddFormType = "add";

const defaultFunc = () => {};

type OnEvent = (type: OrgAddFormType, title?: string, message?: string) => void;

type OrgAddFormProps = {
  isOpen: boolean;
  onCancel: () => void;
  onSubmited: OnEvent;
  onError: OnEvent;
  onLoading: OnEvent;
};

const OrgAddForm = ({
  isOpen = false,
  onSubmited = defaultFunc,
  onCancel = defaultFunc,
  onError = defaultFunc,
  onLoading = defaultFunc,
}: OrgAddFormProps) => {
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

  const addPeriodMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof addPeriod>[0]
  >((data) => {
    return addPeriod(data);
  });

  const onSubmit = (
    positions: PositionIn[] | null,
    goal: Record<string, string> | null
  ) =>
    handleSubmit((data) => {
      const newData: AddPeriodIn = {
        start_date: `${data.start_date}-01`,
        end_date: `${data.end_date}-01`,
        mission: "",
        mission_text: "",
        vision_text: "",
        vision: "",
        positions: [],
      };

      if (positions !== null) {
        newData.positions = positions;
      }

      if (goal !== null) {
        if (goal.mission !== undefined) {
          newData.mission = goal.mission;
        }

        if (goal["mission_text"] !== undefined) {
          newData["mission_text"] = goal["mission_text"];
        }

        if (goal.vision !== undefined) {
          newData.vision = goal.vision;
        }

        if (goal["vision_text"] !== undefined) {
          newData["vision_text"] = goal["vision_text"];
        }
      }

      onLoading("add", "Loading membuat periode");

      addPeriodMutation
        .mutateAsync(newData)
        .then(() => {
          reset(defaultValues, { keepDefaultValues: true });
          onSubmited("add", "Sukses membuat periode");
        })
        .catch((e) => {
          onError("add", "Error membuat periode", e.message);
        });
    });

  const onClose = () => {
    setPositions(null);
    reset(defaultValues, { keepDefaultValues: true });
    onCancel();
  };

  const onStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.currentTarget.value);
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

  const onGoalModalModified = (goal: Record<string, string>) => {
    setGoal(goal);
    setGoalMoalOpen(false);
  };

  useEffect(() => {
    if (isOpen === false) {
      setStructFormOpen(false);
      setPositions(null);
    }
  }, [isOpen]);

  return (
    <>
      <h2 className={styles.drawerTitle}>Buat Periode Organisasi</h2>
      <form className={styles.drawerBody} onSubmit={onSubmit(positions, goal)}>
        <div className={styles.drawerContent}>
          <div className={styles.inputGroup}>
            <Input
              {...register("start_date", {
                required: true,
              })}
              autoComplete="off"
              label="Awal Periode:"
              required={true}
              id="start_date"
              type="month"
              min={yyyyMm(new Date())}
              onChange={onStartDateChange}
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
              required={true}
              id="end_date"
              type="month"
              min={endDate}
              isInvalid={errors["end_date"] !== undefined}
              errMsg={errors["end_date"] ? "Tidak boleh kosong" : ""}
            />
          </div>
          <div className={styles.inputGroup}>
            <Label note="(Lewati jika ingin dibuat atau diubah nanti)">
              Struktur Organisasi
            </Label>
            {positions !== null && positions.length !== 0 ? (
              <Button
                className={styles.formBtn}
                type="button"
                onClick={() => onStructFormOpen()}
              >
                Lihat
              </Button>
            ) : (
              <Button
                className={styles.formBtn}
                type="button"
                onClick={() => onStructFormOpen()}
                data-testid="add-orgstruct-btn"
              >
                Buat
              </Button>
            )}
          </div>
          <div className={styles.inputGroup}>
            <Label note="(Lewati jika ingin dibuat atau diubah nanti)">
              Visi &amp; Misi
            </Label>
            {goal !== null && goal.vision !== "" && goal.mission !== "" ? (
              <Button
                className={styles.formBtn}
                type="button"
                onClick={() => onGoalModalOpen()}
              >
                Lihat
              </Button>
            ) : (
              <Button
                className={styles.formBtn}
                type="button"
                onClick={() => onGoalModalOpen()}
                data-testid="add-goal-btn"
              >
                Buat
              </Button>
            )}
          </div>
        </div>
        <div>
          <Button
            className={styles.formBtn}
            colorScheme="green"
            type="submit"
            data-testid="create-period-btn"
          >
            Buat
          </Button>
          <Button
            colorScheme="red"
            type="reset"
            className={styles.formBtn}
            onClick={() => onClose()}
          >
            Batal
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
          <OrgStructForm
            onSave={(positions) => onStructFormModified(positions)}
          />
        ) : (
          <></>
        )}
      </Drawer>
      <OrgGoalWrite
        isOpen={goalModalOpen}
        prevData={goal}
        onSave={(goal) => onGoalModalModified(goal)}
      />
    </>
  );
};

export default OrgAddForm;
