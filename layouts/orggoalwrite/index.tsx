import { useRef } from "react";
import dynamic from "next/dynamic";
import { RiCheckFill } from "react-icons/ri";
import { getPlainText } from "@/lib/blogmeta";
import { UniversalPortal } from "@/lib/react-portal-universal";
import Button from "@/components/button";
import styles from "./Styles.module.css";

const RichText = dynamic(() => import("@/layouts/richtext/write"));

const defaultFunc = () => {};

type OrgGoalAddProps = {
  isOpen: boolean;
  prevData: Record<string, string> | null;
  onSave: (goal: Record<string, string>) => void;
};

const OrgGoalAdd = ({
  prevData,
  isOpen = false,
  onSave = defaultFunc,
}: OrgGoalAddProps) => {
  const editorVisionStateRef = useRef();
  const editorMissionStateRef = useRef();

  const onClick = () => {
    const mission = editorMissionStateRef.current
      ? JSON.stringify(editorMissionStateRef.current)
      : "";

    let missionText = "";
    if (editorMissionStateRef.current) {
      missionText = getPlainText(editorMissionStateRef.current);
    }

    const vision = editorVisionStateRef.current
      ? JSON.stringify(editorVisionStateRef.current)
      : "";

    let visionText = "";
    if (editorVisionStateRef.current) {
      visionText = getPlainText(editorVisionStateRef.current);
    }

    const goal = {
      mission,
      vision,
      mission_text: missionText,
      vision_text: visionText,
    };
    onSave(goal);
  };

  return isOpen ? (
    <UniversalPortal selector="#modal">
      <div className={styles.modal}>
        <div className={styles.modalBody}>
          <Button
            colorScheme="green"
            leftIcon={<RiCheckFill />}
            onClick={() => onClick()}
            className={styles.addBtn}
            data-testid="org-goal-save-btn"
          >
            Simpan
          </Button>
          <h2 className={styles.pageTitle}>Visi</h2>
          <RichText
            editorStateRef={editorVisionStateRef}
            editorStateJSON={prevData ? prevData.vision : null}
          />
          <h2 className={styles.pageTitle}>Misi</h2>
          <RichText
            editorStateRef={editorMissionStateRef}
            editorStateJSON={prevData ? prevData.mission : null}
          />
        </div>
      </div>
    </UniversalPortal>
  ) : (
    <></>
  );
};

export default OrgGoalAdd;
