import type { ReactElement } from "react";
import type { PositionOut } from "@/services/position";
import { useState, Fragment } from "react";
import { RiAddLine } from "react-icons/ri";
import { debounce } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import { useInfinitePositionsQuery } from "@/services/position";
import Button from "cmnjg-sb/dist/button";
import Drawer from "cmnjg-sb/dist/drawer";
import AdminLayout from "@/layouts/adminpage";
import PositionAddForm from "@/layouts/positionaddform";
import PositionEditForm from "@/layouts/positioneditform";
import EmptyMsg from "@/layouts/emptymsg";
import PositionListItem from "@/layouts/positionlistitem";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Position = () => {
  const [open, setOpen] = useState(false);
  const [tempData, setTempData] = useState<PositionOut | null>(null);
  const positionsQuery = useInfinitePositionsQuery();

  const observeCallback = () => {
    if (positionsQuery.hasNextPage) {
      positionsQuery.fetchNextPage();
    }
  };

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
        data-testid="add-btn"
      >
        Buat
      </Button>
      <h1 className={styles.pageTitle}>Jabatan Tersedia</h1>
      <div className={styles.contentContainer}>
        {positionsQuery.isLoading ? (
          "Loading..."
        ) : positionsQuery.error ? (
          <ErrMsg />
        ) : positionsQuery.data?.pages[0].data.positions.length === 0 ? (
          <EmptyMsg />
        ) : (
          positionsQuery.data?.pages.map((page) => {
            return (
              <Fragment key={page.data.cursor}>
                {page.data.positions.map((val) => {
                  return (
                    <PositionListItem
                      key={val.id}
                      position={val}
                      onClick={() => onChipClick(val)}
                    />
                  );
                })}
              </Fragment>
            );
          })
        )}
      </div>
      <Observe callback={debounce(observeCallback, 500)} />
      <Drawer
        isOpen={open}
        onClose={() => onClose()}
        data-testid="position-drawer"
      >
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
