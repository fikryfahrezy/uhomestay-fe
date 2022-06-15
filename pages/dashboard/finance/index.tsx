import type { ReactElement } from "react";
import type { CashflowOut } from "@/services/cashflow";
import { useState } from "react";
import {
  RiAddLine,
  RiMoneyDollarCircleLine,
  RiMore2Line,
} from "react-icons/ri";
import { idrCurrency } from "@/lib/fmt";
import { useCashflowsQuery } from "@/services/cashflow";
import { CASHFLOW_TYPE } from "@/services/cashflow";
import Button from "@/components/button";
import IconButton from "@/components/iconbutton";
import Drawer from "@/components/drawer";
import AdminLayout from "@/layout/adminpage";
import CashflowAddForm from "@/layout/cashflowaddform";
import CashflowEditForm from "@/layout/cashfloweditform";
import EmptyMsg from "@/layout/emptymsg";
import CashflowSummary from "@/layout/cashflowsummary";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const Finance = () => {
  const [open, setOpen] = useState(false);

  const [cashflowStatus, setCashflowStatus] = useState(CASHFLOW_TYPE.INCOME);
  const [tempData, setTempData] = useState<CashflowOut | null>(null);
  const cashflowsQuery = useCashflowsQuery();

  //   const { data: c } = cashflowsQuery;
  //   const cashflowsData = c ? c.data : {};

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

  const onModiefied = () => {
    setTempData(null);
    setOpen(false);
    cashflowsQuery.refetch();
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
        >
          Buat Transaksi
        </Button>
        {cashflowsQuery.isLoading ? (
          "Loading..."
        ) : cashflowsQuery.error ? (
          <ErrMsg />
        ) : (
          <CashflowSummary
            // income={idrCurrency.format(cashflowsData["income_cash"])}
            // outcome={idrCurrency.format(cashflowsData["outcome_cash"])}
            // total={idrCurrency.format(cashflowsData["total_cash"])}
            income={idrCurrency.format(
              Number(cashflowsQuery.data?.data["income_cash"])
            )}
            outcome={idrCurrency.format(
              Number(cashflowsQuery.data?.data["outcome_cash"])
            )}
            total={idrCurrency.format(
              Number(cashflowsQuery.data?.data["total_cash"])
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
          >
            Pemasukan
          </button>
          <button
            className={`${styles.buttonTab} ${
              cashflowStatus === CASHFLOW_TYPE.OUTCOME ? styles.tabActive : ""
            }`}
            onClick={() => activateOutcomeTab()}
          >
            Pengeluaran
          </button>
        </div>
        <div className={styles.contentContainer}>
          {cashflowsQuery.isLoading ? (
            "Loading..."
          ) : cashflowsQuery.error ? (
            <ErrMsg />
          ) : cashflowsQuery.data?.data.cashflows.length === 0 ? (
            <EmptyMsg />
          ) : (
            cashflowsQuery.data?.data.cashflows
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
                            ? styles.green
                            : styles.red
                        }`}
                      >
                        {/* {idrCurrency.format(idr_amount)} */}
                        {idrCurrency.format(Number(idr_amount))}
                      </span>
                    </div>
                    <IconButton
                      className={styles.moreBtn}
                      onClick={() => onOptClick(val)}
                    >
                      <RiMore2Line />
                    </IconButton>
                  </div>
                );
              })
          )}
        </div>
      </div>
      <Drawer isOpen={open} onClose={() => onClose()}>
        {tempData === null ? (
          <CashflowAddForm
            onCancel={() => onClose()}
            onSubmited={() => onModiefied()}
          />
        ) : (
          <CashflowEditForm
            prevData={tempData}
            onCancel={() => onClose()}
            onEdited={() => onModiefied()}
          />
        )}
      </Drawer>
    </>
  );
};

Finance.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout className={styles.contentLayout}>{page}</AdminLayout>;
};

export default Finance;
