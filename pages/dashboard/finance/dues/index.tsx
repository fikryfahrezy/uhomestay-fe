import type { ReactElement } from "react";
import type { DuesOut } from "@/services/dues";
import type { DuesAddFormType } from "@/layouts/duesaddform";
import type { DuesEditFormType } from "@/layouts/dueseditform";
import { useState, useEffect, Fragment, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  RiMoneyDollarCircleLine,
  RiMore2Line,
  RiPrinterLine,
} from "react-icons/ri";
import { idrCurrency } from "@/lib/fmt";
import { debounce } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import { useDuesQuery } from "@/services/dues";
import { useInfiniteMembersDuesQuery } from "@/services/member-dues";
import Drawer from "cmnjg-sb/dist/drawer";
import Button from "cmnjg-sb/dist/button";
import IconButton from "cmnjg-sb/dist/iconbutton";
import Select from "cmnjg-sb/dist/select";
import LinkButton from "cmnjg-sb/dist/linkbutton";
import Toast from "cmnjg-sb/dist/toast";
import useToast from "cmnjg-sb/dist/toast/useToast";
import AdminLayout from "@/layouts/adminpage";
import DuesAddForm from "@/layouts/duesaddform";
import DuesEditForm from "@/layouts/dueseditform";
import EmptyMsg from "@/layouts/emptymsg";
import MemberDuesItem from "@/layouts/memberduesitem";
import ErrMsg from "@/layouts/errmsg";
import ToastComponent from "@/layouts/toastcomponent";
import styles from "./Styles.module.css";

type FormType = DuesAddFormType | DuesEditFormType;

const Dues = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedDues, setSelectedDues] = useState<number>(0);
  const [tempData, setTempData] = useState<DuesOut | null>(null);
  const router = useRouter();

  const duesQuery = useDuesQuery();
  const membersDuesQuery = useInfiniteMembersDuesQuery(selectedDues, {
    enabled: !!selectedDues,
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
    if (membersDuesQuery.hasNextPage) {
      membersDuesQuery.fetchNextPage();
    }
  };

  const onOpen = () => {
    setDrawerOpen(true);
  };

  const onDrawerClose = () => {
    setTempData(null);
    setDrawerOpen(false);
  };

  const openDrawer = (data: DuesOut | null) => {
    setTempData(data);
    setDrawerOpen(true);
  };

  const onModified = (type: FormType, title?: string, message?: string) => {
    setTempData(null);
    setDrawerOpen(false);
    membersDuesQuery.refetch();
    duesQuery.refetch();

    updateToast(toastId.current[type], {
      status: "success",
      render: () => <ToastComponent title={title} message={message} />,
    });
  };

  const onDuesSelect = (val: string) => {
    const numVal = Number(val);

    const dues = duesQuery.data?.data.dues.find((v) => {
      return v.id === numVal;
    });

    if (dues !== undefined) {
      setSelectedDues(dues.id);
    }
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

  useEffect(() => {
    const duesData = duesQuery.data;
    if (duesData !== undefined && duesData.data.dues.length != 0) {
      setSelectedDues(duesData.data.dues[0].id);
    }
  }, [duesQuery.data]);

  return (
    <>
      <h1 className={styles.pageTitle}>Daftar Iuran Anggota</h1>
      <Button
        colorScheme="green"
        leftIcon={<RiMoneyDollarCircleLine />}
        onClick={() => onOpen()}
        className={styles.addBtn}
        data-testid="add-dues-btn"
      >
        Buat Tagihan
      </Button>
      <div className={styles.tableContainer}>
        <Link
          href={{
            pathname: `${router.pathname}/print/[id]`,
            query: { id: selectedDues },
          }}
          passHref
        >
          <LinkButton leftIcon={<RiPrinterLine />} className={styles.printBtn}>
            Cetak
          </LinkButton>
        </Link>
        <div className={styles.groupHeader}>
          <div className={styles.groupTitle}>
            <div className={styles.groupTitleBody}>
              <div>
                <p className={styles.groupSubtitle}>Tanggal</p>
                {duesQuery.isLoading ? (
                  "Loading..."
                ) : duesQuery.error ? (
                  <Select className={styles.select}>
                    <option disabled value="">
                      - Tidak Memiliki Tagihan -
                    </option>
                  </Select>
                ) : duesQuery.data ? (
                  <Select
                    className={styles.select}
                    onChange={(e) => onDuesSelect(e.currentTarget.value)}
                    value={selectedDues ? selectedDues : ""}
                  >
                    {duesQuery.data.data.dues.length === 0 ? (
                      <option disabled value="">
                        - Tidak Memiliki Tagihan -
                      </option>
                    ) : (
                      duesQuery.data.data.dues.map((val) => {
                        const { id, date } = val;
                        return (
                          <option key={id} value={id}>
                            {date}
                          </option>
                        );
                      })
                    )}
                  </Select>
                ) : (
                  <></>
                )}
              </div>
              <div>
                <p className={styles.groupSubtitle}>Jumlah Iuran</p>
                <p className={styles.groupSubvalue}>
                  {idrCurrency.format(
                    Number(
                      membersDuesQuery.data?.pages[0].data["dues_amount"] || 0
                    )
                  )}
                </p>
              </div>
            </div>
            <div className={styles.currencyFlowContainer}>
              <div>
                <h3 className={styles.currencyFlowTitle}>Jumlah Terbayar</h3>
                <p className={`${styles.currency} ${styles.green}`}>
                  {idrCurrency.format(
                    Number(
                      membersDuesQuery.data?.pages[0].data["paid_dues"] || 0
                    )
                  )}
                </p>
              </div>
              <div>
                <h3 className={styles.currencyFlowTitle}>Belum Terbayar</h3>
                <p className={`${styles.currency} ${styles.red}`}>
                  {idrCurrency.format(
                    Number(
                      membersDuesQuery.data?.pages[0].data["unpaid_dues"] || 0
                    )
                  )}
                </p>
              </div>
            </div>
          </div>
          <IconButton
            className={styles.moreBtn}
            onClick={() =>
              openDrawer({
                date: membersDuesQuery.data?.pages[0].data["dues_date"] || "",
                idr_amount:
                  membersDuesQuery.data?.pages[0].data["dues_amount"] || "",
                id: selectedDues,
              })
            }
            data-testid="option-dues-btn"
          >
            <RiMore2Line />
          </IconButton>
        </div>
        {membersDuesQuery.isIdle ? (
          "Pilih tanggal terlebih dahulu!"
        ) : membersDuesQuery.isLoading ? (
          "Loading..."
        ) : membersDuesQuery.error ? (
          <ErrMsg />
        ) : membersDuesQuery.data?.pages[0].data["member_dues"].length === 0 ? (
          <EmptyMsg />
        ) : (
          membersDuesQuery.data?.pages.map((page) => {
            return (
              <Fragment key={page.data.cursor}>
                {page.data["member_dues"].map((val) => {
                  return (
                    <MemberDuesItem
                      key={val.id}
                      member={val}
                      moreBtn={
                        <Link
                          href={{
                            pathname: `${router.pathname}/member/[id]`,
                            query: { id: val["member_id"] },
                          }}
                          passHref
                        >
                          <LinkButton
                            colorScheme="green"
                            leftIcon={<RiMore2Line />}
                            className={styles.moreBtn}
                          />
                        </Link>
                      }
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
        isOpen={isDrawerOpen}
        onClose={() => onDrawerClose()}
        data-testid="dues-drawer"
      >
        {tempData === null ? (
          <DuesAddForm
            onCancel={() => onDrawerClose()}
            onSubmited={(type, title, message) =>
              onModified(type, title, message)
            }
            onError={(type, title, message) => onError(type, title, message)}
            onLoading={(type, title, message) =>
              onLoading(type, title, message)
            }
          />
        ) : (
          <DuesEditForm
            prevData={tempData}
            onCancel={() => onDrawerClose()}
            onSubmited={(type, title, message) =>
              onModified(type, title, message)
            }
            onError={(type, title, message) => onError(type, title, message)}
            onLoading={(type, title, message) =>
              onLoading(type, title, message)
            }
          />
        )}
      </Drawer>
      <Toast {...props} />
    </>
  );
};

Dues.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Dues;
