import type { FindOrgPeriodGoalRes } from "@/services/period";
import dynamic from "next/dynamic";
import styles from "./Styles.module.css";

const RichText = dynamic(() => import("@/layouts/richtext/read"));

type GoalViewProps = {
  orgPeriodGoal: Pick<FindOrgPeriodGoalRes, "vision" | "mission">;
};

const GoalView = ({ orgPeriodGoal }: GoalViewProps) => {
  return (
    <div className={styles.missionsContainer}>
      <div className={styles.missionContainer}>
        <h3 className={styles.heading3}>Visi</h3>
        <RichText
          editorStateJSON={orgPeriodGoal.vision}
          placeholder={
            <div className={styles.richTextPlaceholder}>
              Tidak ada konten untuk sekarang...
            </div>
          }
        />
      </div>
      <div className={styles.missionContainer}>
        <h3 className={styles.heading3}>Misi</h3>
        <RichText
          editorStateJSON={orgPeriodGoal.mission}
          placeholder={
            <div className={styles.richTextPlaceholder}>
              Tidak ada konten untuk sekarang...
            </div>
          }
        />
      </div>
    </div>
  );
};

export default GoalView;
