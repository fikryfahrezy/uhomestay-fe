import type { ReactElement } from "react";
import type { PeriodRes } from "@/services/period";
import type { OrgAddFormType } from "@/layouts/orgaddform";
import type { OrgEditFormType } from "@/layouts/orgeditform";
import { useState, Fragment, useRef } from "react";
import { RiAddLine, RiCalendar2Fill, RiMore2Line } from "react-icons/ri";
import { idDate } from "@/lib/fmt";
import { debounce } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import { usePeriodsQuery } from "@/services/period";
import Button from "@/components/button";
import Drawer from "@/components/drawer";
import Badge from "@/components/badge";
import Toast, { useToast } from "@/components/toast";
import IconButton from "@/components/iconbutton";
import AdminLayout from "@/layouts/adminpage";
import OrgAddForm from "@/layouts/orgaddform";
import OrgEditForm from "@/layouts/orgeditform";
import BadgeList from "@/layouts/badgelist";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import ToastComponent from "@/layouts/toastcomponent";
import styles from "./Styles.module.css";

type FormType = OrgAddFormType | OrgEditFormType;

const Organization = () => {
  const [tempData, setTempData] = useState<PeriodRes | null>(null);
  const [open, setOpen] = useState(false);
  const periodsQuery = usePeriodsQuery({
    getPreviousPageParam: (firstPage) => firstPage.data.cursor || undefined,
    getNextPageParam: (lastPage) => lastPage.data.cursor || undefined,
  });

  const { toast, updateToast, props } = useToast();
  const toastId = useRef<{ [key in FormType]: number }>({
    add: 0,
    delete: 0,
    edit: 0,
  });

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

  const onModified = (type: FormType, title?: string, message?: string) => {
    setTempData(null);
    setOpen(false);
    periodsQuery.refetch();

    updateToast(toastId.current[type], {
      status: "success",
      render: () => <ToastComponent title={title} message={message} />,
    });
  };

  const onError = (type: FormType, title?: string, message?: string) => {
    updateToast(toastId.current[type], {
      status: "error",
      render: () => (
        <ToastComponent
          title={title}
          message={message}
          data-testid="toast-modal"
        />
      ),
    });
  };

  const onLoading = (type: FormType, title?: string, __?: string) => {
    toastId.current[type] = toast({
      status: "info",
      duration: 999999,
      render: () => <ToastComponent title={title} />,
    });
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
          <>
            <h3>
              Jumlah Total Periode Organisasi:{" "}
              {periodsQuery.data?.pages[0].data.total} periode
            </h3>
            {periodsQuery.data?.pages.map((page) => {
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
                      <BadgeList
                        key={id}
                        icon={<RiCalendar2Fill />}
                        badge={
                          isActive ? (
                            <Badge colorScheme="green">Periode Aktif</Badge>
                          ) : (
                            <></>
                          )
                        }
                        moreBtn={
                          <IconButton
                            className={styles.moreBtn}
                            onClick={() => onChipClick(val)}
                            data-testid="period-chip"
                          >
                            <RiMore2Line />
                          </IconButton>
                        }
                      >
                        {idDate(new Date(startDate))} /{" "}
                        {idDate(new Date(endDate))}
                      </BadgeList>
                    );
                  })}
                </Fragment>
              );
            })}
          </>
        )}
      </div>
      <Observe callback={debounce(observeCallback, 500)} />
      <Drawer isOpen={open} onClose={() => onClose()}>
        {open ? (
          tempData === null ? (
            <OrgAddForm
              isOpen={open}
              onCancel={() => onClose()}
              onSubmited={(type, title, message) =>
                onModified(type, title, message)
              }
              onError={(type, title, message) => onError(type, title, message)}
              onLoading={(type, title, message) =>
                onLoading(type, title, message)
              }
            />
          ) : (
            <OrgEditForm
              prevData={tempData}
              onCancel={() => onClose()}
              onSubmited={(type, title, message) =>
                onModified(type, title, message)
              }
              onError={(type, title, message) => onError(type, title, message)}
              onLoading={(type, title, message) =>
                onLoading(type, title, message)
              }
            />
          )
        ) : (
          <></>
        )}
      </Drawer>
      <Toast {...props} />
    </>
  );
};

Organization.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Organization;
