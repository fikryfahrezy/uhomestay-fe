import type { ReactElement } from "react";
import type { PositionOut } from "@/services/position";
import { useState } from "react";
import { RiAddLine } from "react-icons/ri";
import { usePositionsQuery } from "@/services/position";
import Button from "@/components/button";
import Drawer from "@/components/drawer";
import AdminLayout from "@/layout/adminpage";
import PositionAddForm from "@/layout/positionaddform";
import PositionEditForm from "@/layout/positioneditform";
import EmptyMsg from "@/layout/emptymsg";
import PositionListItem from "@/layout/positionlistitem";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const Position = () => {
  const [open, setOpen] = useState(false);
  const [tempData, setTempData] = useState<PositionOut | null>(null);
  const positionsQuery = usePositionsQuery();

  const onClose = () => {
    setTempData(null);
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(true);
  };

  const onChipClick = (val: PositionOut) => {
    setTempData(val);
    setOpen(true);
  };

  const onModiefied = () => {
    setTempData(null);
    setOpen(false);
    positionsQuery.refetch();
  };

  return (
    <>
      <Button
        colorScheme="green"
        leftIcon={<RiAddLine />}
        onClick={() => onOpen()}
        className={styles.addBtn}
      >
        Buat
      </Button>
      <h1 className={styles.pageTitle}>Jabatan Tersedia</h1>
      <div className={styles.contentContainer}>
        {positionsQuery.isLoading ? (
          "Loading..."
        ) : positionsQuery.error ? (
          <ErrMsg />
        ) : positionsQuery.data?.data.length === 0 ? (
          <EmptyMsg />
        ) : (
          positionsQuery.data?.data.map((val) => {
            return (
              <PositionListItem
                key={val.id}
                position={val}
                onClick={() => onChipClick(val)}
              />
            );
          })
        )}
      </div>
      <Drawer isOpen={open} onClose={() => onClose()}>
        {tempData === null ? (
          <PositionAddForm
            onCancel={() => onClose()}
            onSubmited={() => onModiefied()}
          />
        ) : (
          <PositionEditForm
            prevData={tempData}
            onCancel={() => onClose()}
            onEdited={() => onModiefied()}
          />
        )}
      </Drawer>
    </>
  );
};

Position.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Position;
