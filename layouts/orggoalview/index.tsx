import type { FindOrgPeriodGoalRes } from "@/services/period";
import dynamic from "next/dynamic";
import { RiCloseLine } from "react-icons/ri";
import { UniversalPortal } from "@/lib/react-portal-universal";
import Button from "@/components/button";
import styles from "./Styles.module.css";

const RichText = dynamic(() => import("@/layouts/richtext/read"));

const defaultFunc = () => {};

type OrgGoalAddProps = {
  isOpen: boolean;
  prevData: Pick<FindOrgPeriodGoalRes, "mission" | "vision"> | null;
  onClose: () => void;
};

const OrgGoalView = ({
  prevData,
  isOpen = false,
  onClose = defaultFunc,
}: OrgGoalAddProps) => {
  return isOpen ? (
    <UniversalPortal selector="#modal">
      <div className={styles.modal}>
        <div className={styles.modalBody}>
          <Button
            colorScheme="red"
            leftIcon={<RiCloseLine />}
            onClick={() => onClose()}
            className={styles.addBtn}
          >
            Tutup
          </Button>
          <h2 className={styles.pageTitle}>Visi</h2>
          <RichText editorStateJSON={prevData ? prevData.vision : null} />
          <h2 className={styles.pageTitle}>Misi</h2>

          <RichText editorStateJSON={prevData ? prevData.mission : null} />
        </div>
      </div>
    </UniversalPortal>
  ) : (
    <></>
  );
};

export default OrgGoalView;
