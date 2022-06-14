import Select from "@/components/select";
import SlidePagination from "@/components/slidepagination";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type TableControllerProps = JSX.IntrinsicElements["div"] & {
  onFirstPaginate?: () => void;
  onPrevPaginate?: () => void;
  onNextPaginate?: () => void;
  onLastPaginate?: () => void;
  onLimitChange?: (e: import("react").ChangeEvent<HTMLSelectElement>) => void;
  limitList: number[];
  currentLimit: number;
  currentPage: number;
  totalPage: number;
  totalData: number;
};

const TableController = ({
  className,
  onFirstPaginate = defaultFunc,
  onPrevPaginate = defaultFunc,
  onNextPaginate = defaultFunc,
  onLastPaginate = defaultFunc,
  onLimitChange = defaultFunc,
  limitList = [],
  currentLimit = 0,
  currentPage = 0,
  totalData = 0,
  ...restProps
}: TableControllerProps) => (
  <div
    {...restProps}
    className={`${styles.container} ${className ? className : ""}`}
  >
    <SlidePagination
      onFirstPaginate={onFirstPaginate}
      onPrevPaginate={onPrevPaginate}
      onNextPaginate={onNextPaginate}
      onLastPaginate={onLastPaginate}
    >
      <p>
        Halaman {currentPage} dari{" "}
        {currentLimit > 0 ? Math.ceil(totalData / currentLimit) : 0}
      </p>
    </SlidePagination>
    <div>
      <p>Hasil per halaman:</p>
      <Select onChange={onLimitChange} className={styles.select}>
        {limitList.map((val, i) => (
          <option key={i} value={val}>
            {val}
          </option>
        ))}
      </Select>
    </div>
    <div>
      <p>
        Menampilkan {(currentPage - 1) * currentLimit + 1}-
        {currentPage * currentLimit} dari {totalData} data
      </p>
    </div>
  </div>
);

export default TableController;
