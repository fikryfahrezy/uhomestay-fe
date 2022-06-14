import {
  RiArrowLeftSLine,
  RiArrowLeftSFill,
  RiArrowRightSFill,
  RiArrowRightSLine,
} from "react-icons/ri";
import IconButton from "@/components/iconbutton";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type TableControllerProps = JSX.IntrinsicElements["div"] & {
  onFirstPaginate?: () => void;
  onPrevPaginate?: () => void;
  onNextPaginate?: () => void;
  onLastPaginate?: () => void;
};

const SlidePagination = ({
  onFirstPaginate = defaultFunc,
  onPrevPaginate = defaultFunc,
  onNextPaginate = defaultFunc,
  onLastPaginate = defaultFunc,
  children,
  ...restProps
}: TableControllerProps) => (
  <div {...restProps}>
    <IconButton onClick={onFirstPaginate} className={styles.btn}>
      <RiArrowLeftSLine />
    </IconButton>
    <IconButton onClick={onPrevPaginate} className={styles.btn}>
      <RiArrowLeftSFill />
    </IconButton>
    {children}
    <IconButton onClick={onNextPaginate} className={styles.btn}>
      <RiArrowRightSFill />
    </IconButton>
    <IconButton onClick={onLastPaginate} className={styles.btn}>
      <RiArrowRightSLine />
    </IconButton>
  </div>
);

export default SlidePagination;
