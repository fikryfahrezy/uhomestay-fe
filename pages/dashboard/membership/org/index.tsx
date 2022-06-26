import type { ReactElement } from "react";
import type { PeriodRes } from "@/services/period";
import { useState, Fragment } from "react";
import { RiAddLine } from "react-icons/ri";
import { idDate } from "@/lib/fmt";
import { debounce } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import { usePeriodsQuery } from "@/services/period";
import Button from "@/components/button";
import Drawer from "@/components/drawer";
import Chip from "@/components/chip";
import AdminLayout from "@/layout/adminpage";
import OrgAddForm from "@/layout/orgaddform";
import OrgEditForm from "@/layout/orgeditform";
import OrgDetailForm from "@/layout/orgdetailform";
import EmptyMsg from "@/layout/emptymsg";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const Organization = () => {
  const [tempData, setTempData] = useState<PeriodRes | null>(null);
  const [open, setOpen] = useState(false);
  const periodsQuery = usePeriodsQuery();

  const observeCallback = () => {
    if (periodsQuery.hasNextPage) {
      periodsQuery.fetchNextPage();
    }
  };

  const onChipClick = (val: PeriodRes) => {
    setTempData(val);
    setOpen(true);
  };

  const onClose = () => {
    setTempData(null);
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(true);
  };

  const onModified = () => {
    setTempData(null);
    setOpen(false);
    periodsQuery.refetch();
  };

  return (
    <>
      <Button
        colorScheme="green"
        leftIcon={<RiAddLine />}
        onClick={() => onOpen()}
        className={styles.addBtn}
        data-testid="period-drawer-btn"
      >
        Buat
      </Button>
      <h1 className={styles.pageTitle}>Periode Organisasi</h1>
      <div className={styles.contentContainer}>
        {periodsQuery.isLoading ? (
          "Loading..."
        ) : periodsQuery.error ? (
          <ErrMsg />
        ) : periodsQuery.data?.pages[0].data.periods.length === 0 ? (
          <EmptyMsg />
        ) : (
          periodsQuery.data?.pages.map((page) => {
            return (
              <Fragment key={page.data.cursor}>
                {page.data.periods.map((val) => {
                  const {
                    id,
                    start_date: startDate,
                    end_date: endDate,
                    is_active: isActive,
                  } = val;
                  return (
                    <Chip
                      key={id}
                      isActive={isActive}
                      onClick={() => onChipClick(val)}
                      data-testid="period-chip"
                    >
                      {idDate(new Date(startDate))} /{" "}
                      {idDate(new Date(endDate))}
                    </Chip>
                  );
                })}
              </Fragment>
            );
          })
        )}
      </div>
      <Observe callback={debounce(observeCallback, 500)} />
      <Drawer isOpen={open} onClose={() => onClose()}>
        {tempData === null ? (
          <OrgAddForm
            isOpen={open}
            onCancel={() => onClose()}
            onSubmited={() => onModified()}
          />
        ) : (
          <>
            {tempData["is_active"] ? (
              <OrgEditForm
                prevData={tempData}
                onCancel={() => onClose()}
                onEdited={() => onModified()}
              />
            ) : (
              <OrgDetailForm
                prevData={tempData}
                onEdited={() => onModified()}
              />
            )}
          </>
        )}
      </Drawer>
    </>
  );
};

Organization.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Organization;
