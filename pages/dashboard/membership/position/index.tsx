import type { ReactElement } from "react";
import type { PositionOut } from "@/services/position";
import type { PositionAddFormType } from "@/layouts/positionaddform";
import type { PositionEditFormType } from "@/layouts/positioneditform";
import { useState, Fragment, useRef } from "react";
import { RiAddLine, RiMedal2Fill, RiMore2Line } from "react-icons/ri";
import { debounce } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import { useInfinitePositionsQuery } from "@/services/position";
import Button from "@/components/button";
import Drawer from "@/components/drawer";
import Toast, { useToast } from "@/components/toast";
import IconButton from "@/components/iconbutton";
import AdminLayout from "@/layouts/adminpage";
import PositionAddForm from "@/layouts/positionaddform";
import PositionEditForm from "@/layouts/positioneditform";
import BadgeList from "@/layouts/badgelist";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import ToastComponent from "@/layouts/toastcomponent";
import styles from "./Styles.module.css";

type FormType = PositionAddFormType | PositionEditFormType;

const Position = () => {
  const [open, setOpen] = useState(false);
  const [tempData, setTempData] = useState<PositionOut | null>(null);
  const positionsQuery = useInfinitePositionsQuery({
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

  const onModified = (type: FormType, title?: string, message?: string) => {
    setTempData(null);
    setOpen(false);
    positionsQuery.refetch();

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
        data-testid="add-btn"
      >
        Buat
      </Button>
      <h1 className={styles.pageTitle}>Jabatan Tersedia</h1>
      {positionsQuery.isLoading ? (
        "Loading..."
      ) : positionsQuery.error ? (
        <ErrMsg />
      ) : positionsQuery.data?.pages[0].data.positions.length === 0 ? (
        <EmptyMsg />
      ) : (
        <>
          <h3>
            Jumlah Total Jabatan: {positionsQuery.data?.pages[0].data.total}{" "}
            jabatan
          </h3>
          <div className={styles.contentContainer}>
            {positionsQuery.data?.pages.map((page) => {
              return (
                <Fragment key={page.data.cursor}>
                  {Object.entries(
                    page.data.positions.reduce<{
                      [k: number]: PositionOut[];
                    }>((prevValue, currentValue) => {
                      const prev = prevValue[currentValue.level];
                      if (prev !== undefined) {
                        prev.push(currentValue);
                        return prevValue;
                      }

                      prevValue[currentValue.level] = [currentValue];
                      return prevValue;
                    }, {})
                  ).map(([level, positions]) => {
                    return (
                      <Fragment key={level}>
                        <h2 className={styles.levelSubtitle}>Level {level}</h2>
                        {positions.map((val) => {
                          const { id, name } = val;
                          return (
                            <BadgeList
                              key={id}
                              icon={<RiMedal2Fill />}
                              moreBtn={
                                <IconButton
                                  className={styles.moreBtn}
                                  onClick={() => onChipClick(val)}
                                  data-testid="position-list-item"
                                >
                                  <RiMore2Line />
                                </IconButton>
                              }
                            >
                              {name}
                            </BadgeList>
                          );
                        })}
                      </Fragment>
                    );
                  })}
                </Fragment>
              );
            })}
          </div>
        </>
      )}
      <Observe callback={debounce(observeCallback, 500)} />
      <Drawer
        isOpen={open}
        onClose={() => onClose()}
        data-testid="position-drawer"
      >
        {open ? (
          tempData === null ? (
            <PositionAddForm
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
            <PositionEditForm
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

Position.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Position;
