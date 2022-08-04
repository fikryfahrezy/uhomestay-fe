import type { PositionOut } from "@/services/position";
import Chip from "@/components/chip";
import styles from "./Styles.module.css";

type PositionListProps = {
  position: PositionOut;
  onClick?: () => void;
};

const PositionList = ({ position, onClick }: PositionListProps) => {
  return (
    <Chip
      className={styles.chip}
      onClick={onClick}
      data-testid="position-list-item"
    >
      {position.name}
    </Chip>
  );
};

export default PositionList;
