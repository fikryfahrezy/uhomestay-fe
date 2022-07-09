import type { ReactElement } from "react";
import type { PeriodRes } from "@/services/period";
import type { OrgAddFormType } from "@/layouts/orgaddform";
import type { OrgEditFormType } from "@/layouts/orgeditform";
import type { OrgDetailFormType } from "@/layouts/orgdetailform";
import { useState, Fragment, useRef } from "react";
import { RiAddLine } from "react-icons/ri";
import { idDate } from "@/lib/fmt";
import { debounce } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import { usePeriodsQuery } from "@/services/period";
import Button from "cmnjg-sb/dist/button";
import Drawer from "cmnjg-sb/dist/drawer";
import Chip from "cmnjg-sb/dist/chip";
import Toast from "cmnjg-sb/dist/toast";
import useToast from "cmnjg-sb/dist/toast/useToast";
import AdminLayout from "@/layouts/adminpage";
import OrgAddForm from "@/layouts/orgaddform";
import OrgEditForm from "@/layouts/orgeditform";
import OrgDetailForm from "@/layouts/orgdetailform";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import ToastComponent from "@/layouts/toastcomponent";
import styles from "./Styles.module.css";

type FormType = OrgAddFormType | OrgEditFormType | OrgDetailFormType;

const Organization = () => {
  const [tempData, setTempData] = useState<PeriodRes | null>(null);
  const [open, setOpen] = useState(false);
  const periodsQuery = usePeriodsQuery();

  const { toast, updateToast, props } = useToast();
  const toastId = useRef<{ [key in FormType]: number }>({
    active: 0,
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
            onSubmited={(type, title, message) =>
              onModified(type, title, message)
            }
            onError={(type, title, message) => onError(type, title, message)}
            onLoading={(type, title, message) =>
              onLoading(type, title, message)
            }
          />
        ) : (
          <>
            {tempData["is_active"] ? (
              <OrgEditForm
                prevData={tempData}
                onCancel={() => onClose()}
				onSubmited={(type, title, message) =>
				  onModified(type, title, message)
				}
                onError={(type, title, message) =>
                  onError(type, title, message)
                }
                onLoading={(type, title, message) =>
                  onLoading(type, title, message)
                }
              />
            ) : (
              <OrgDetailForm
                prevData={tempData}
				onSubmited={(type, title, message) =>
				  onModified(type, title, message)
				}
                onError={(type, title, message) =>
                  onError(type, title, message)
                }
                onLoading={(type, title, message) =>
                  onLoading(type, title, message)
                }
              />
            )}
          </>
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
