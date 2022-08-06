import type { ReactElement } from "react";
import type { CashflowOut } from "@/services/cashflow";
import type { CashflowAddFormType } from "@/layouts/cashflowaddform";
import type { CasflowEditFormType } from "@/layouts/cashfloweditform";
import { useState, useRef, Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  RiAddLine,
  RiMoneyDollarCircleLine,
  RiMore2Line,
  RiPrinterLine,
} from "react-icons/ri";
import { debounce } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import { idrCurrency } from "@/lib/fmt";
import {
  useInfiniteCashflowsQuery,
  useCashflowStatsQuery,
} from "@/services/cashflow";
import { CASHFLOW_TYPE } from "@/services/cashflow";
import Button from "@/components/button";
import IconButton from "@/components/iconbutton";
import Drawer from "@/components/drawer";
import Toast, { useToast } from "@/components/toast";
import LinkButton from "@/components/linkbutton";
import AdminLayout from "@/layouts/adminpage";
import CashflowAddForm from "@/layouts/cashflowaddform";
import CashflowEditForm from "@/layouts/cashfloweditform";
import EmptyMsg from "@/layouts/emptymsg";
import CashflowSummary from "@/layouts/cashflowsummary";
import ErrMsg from "@/layouts/errmsg";
import ToastComponent from "@/layouts/toastcomponent";
import styles from "./Styles.module.css";

type FormType = CashflowAddFormType | CasflowEditFormType;

const inOutCashField = Object.freeze({
  income: "income_cash",
  outcome: "outcome_cash",
});

const inOutTotalField = Object.freeze({
  income: "income_total",
  outcome: "outcome_total",
});

const Finance = () => {
  const [open, setOpen] = useState(false);

  const [cashflowStatus, setCashflowStatus] = useState<
    typeof CASHFLOW_TYPE[keyof typeof CASHFLOW_TYPE]
  >(CASHFLOW_TYPE.INCOME);
  const [tempData, setTempData] = useState<CashflowOut | null>(null);

  const cashflowStatsQuery = useCashflowStatsQuery();
  const cashflowsQuery = useInfiniteCashflowsQuery({
    getPreviousPageParam: (firstPage) => firstPage.data.cursor || undefined,
    getNextPageParam: (lastPage) => lastPage.data.cursor || undefined,
  });

  const { toast, updateToast, props } = useToast();
  const toastId = useRef<{ [key in FormType]: number }>({
    add: 0,
    delete: 0,
    edit: 0,
  });

  const router = useRouter();

  const observeCallback = () => {
    if (cashflowsQuery.hasNextPage) {
      cashflowsQuery.fetchNextPage();
    }
  };

  const onClose = () => {
    setTempData(null);
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(true);
  };

  const onOptClick = (val: CashflowOut) => {
    setTempData(val);
    setOpen(true);
  };

  const onModified = (type: FormType, title?: string, message?: string) => {
    setTempData(null);
    setOpen(false);
    cashflowsQuery.refetch();
    cashflowStatsQuery.refetch();

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

  const activateIncomeTab = () => {
    setCashflowStatus(CASHFLOW_TYPE.INCOME);
  };

  const activateOutcomeTab = () => {
    setCashflowStatus(CASHFLOW_TYPE.OUTCOME);
  };

  return (
    <>
      <div className={styles.contentHeadSection}>
        <Button
          colorScheme="green"
          leftIcon={<RiAddLine />}
          onClick={() => onOpen()}
          className={styles.addBtn}
          data-testid="add-transaction-btn"
        >
          Buat Transaksi
        </Button>
        <Link href={`${router.pathname}/print`} passHref>
          <LinkButton leftIcon={<RiPrinterLine />} className={styles.printBtn}>
            Cetak
          </LinkButton>
        </Link>
        {cashflowStatsQuery.isLoading ? (
          "Loading..."
        ) : cashflowStatsQuery.error ? (
          <ErrMsg />
        ) : (
          <CashflowSummary
            income={idrCurrency.format(
              Number(cashflowStatsQuery.data?.data["income_cash"])
            )}
            outcome={idrCurrency.format(
              Number(cashflowStatsQuery.data?.data["outcome_cash"])
            )}
            total={idrCurrency.format(
              Number(cashflowStatsQuery.data?.data["total_cash"])
            )}
          />
        )}
      </div>
      <div className={styles.contentBodySection}>
        <div className={styles.buttonTabs}>
          <button
            className={`${styles.buttonTab} ${
              cashflowStatus === CASHFLOW_TYPE.INCOME ? styles.tabActive : ""
            }`}
            onClick={() => activateIncomeTab()}
            data-testid="income-tab-btn"
          >
            Pemasukan
          </button>
          <button
            className={`${styles.buttonTab} ${
              cashflowStatus === CASHFLOW_TYPE.OUTCOME ? styles.tabActive : ""
            }`}
            onClick={() => activateOutcomeTab()}
            data-testid="outcome-tab-btn"
          >
            Pengeluaran
          </button>
        </div>
        <div className={styles.contentContainer}>
          {cashflowStatsQuery.isLoading ? (
            "Loading..."
          ) : cashflowStatsQuery.error ? (
            <ErrMsg />
          ) : cashflowStatus === CASHFLOW_TYPE.INCOME ? (
            <h3>
              Jumlah Total Pemasukan:{" "}
              {cashflowStatsQuery.data?.data[inOutTotalField[cashflowStatus]]}{" "}
              pemasukan
            </h3>
          ) : (
            <h3>
              Jumlah Total Pengeluran:{" "}
              {cashflowStatsQuery.data?.data[inOutTotalField[cashflowStatus]]}{" "}
              pengeluaran
            </h3>
          )}
          {cashflowsQuery.isLoading || cashflowStatsQuery.isLoading ? (
            "Loading..."
          ) : cashflowsQuery.error || cashflowStatsQuery.error ? (
            <ErrMsg />
          ) : cashflowsQuery.data?.pages[0].data.cashflows.length === 0 ||
            cashflowStatsQuery.data?.data[inOutCashField[cashflowStatus]] ===
              "0" ? (
            <EmptyMsg />
          ) : (
            cashflowsQuery.data?.pages.map((page) => {
              return (
                <Fragment key={page.data.cursor}>
                  {page.data.cashflows
                    .filter(({ type }) => type === cashflowStatus)
                    .map((val) => {
                      const { id, date, idr_amount, note } = val;
                      return (
                        <div key={id} className={styles.listItem}>
                          <span className={styles.listIcon}>
                            <RiMoneyDollarCircleLine />
                          </span>
                          <div className={styles.listContent}>
                            <div className={styles.listBody}>
                              <span className={styles.listText}>{date}</span>
                              <p className={styles.listText}>{note}</p>
                            </div>
                            <span
                              className={`${styles.listCurrency} ${
                                cashflowStatus === CASHFLOW_TYPE.INCOME
                                  ? `${styles.green} test__income__color`
                                  : `${styles.red} test__outcome__color`
                              }`}
                              data-testid="cashflow-item"
                            >
                              {idrCurrency.format(Number(idr_amount))}
                            </span>
                          </div>
                          <IconButton
                            className={styles.moreBtn}
                            onClick={() => onOptClick(val)}
                            data-testid="cashflow-item-btn"
                          >
                            <RiMore2Line />
                          </IconButton>
                        </div>
                      );
                    })}
                </Fragment>
              );
            })
          )}
        </div>
      </div>
      <Observe callback={debounce(observeCallback, 500)} />
      <Drawer
        isOpen={open}
        onClose={() => onClose()}
        data-testid="cashflow-drawer"
      >
        {open ? (
          tempData === null ? (
            <CashflowAddForm
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
            <CashflowEditForm
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

Finance.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout className={styles.contentLayout}>{page}</AdminLayout>;
};

export default Finance;
