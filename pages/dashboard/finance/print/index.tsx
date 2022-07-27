import type { ReactElement } from "react";
import Image from "next/image";
import { idrCurrency, idrNumToWord } from "@/lib/fmt";
import {
  CASHFLOW_TYPE,
  useCashflowsQuery,
  useCashflowStatsQuery,
} from "@/services/cashflow";
import PrintLayout from "@/layouts/adminprintpage";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Finance = () => {
  const cashflowsQuery = useCashflowsQuery();
  const cashflowStatsQuery = useCashflowStatsQuery();

  return cashflowsQuery.isLoading || cashflowStatsQuery.isLoading ? (
    "Loading..."
  ) : cashflowsQuery.error || cashflowStatsQuery.error ? (
    <ErrMsg />
  ) : (
    <div>
      <header className={styles.header}>
        <Image
          src="/images/image/logo.png"
          layout="fixed"
          width="300"
          height="35"
          alt="Website Logo"
        />
        <div>
          <h1 className={styles.title}>Rekap Uang Kas</h1>
          <p className={styles.date}>
            Per-tanggal {new Date().toLocaleString("id-ID")}
          </p>
        </div>
      </header>
      <h2>Total Uang Kas</h2>
      <p>
        {idrCurrency.format(
          Number(cashflowStatsQuery.data?.data["total_cash"] || 0)
        )}
      </p>
      <span>Terbilang:</span>
      <p>
        <em>
          <strong>
            {idrNumToWord(cashflowStatsQuery.data?.data["total_cash"] || "0")}
            rupiah
          </strong>
        </em>
      </p>
      <h3>Total Pemasukan</h3>
      <p>
        {idrCurrency.format(
          Number(cashflowStatsQuery.data?.data["income_cash"] || 0)
        )}
      </p>
      <span>Terbilang:</span>
      <p>
        <em>
          <strong>
            {idrNumToWord(cashflowStatsQuery.data?.data["income_cash"] || "0")}
            rupiah
          </strong>
        </em>
      </p>
      <h3>Total Pengeluaran</h3>
      <p>
        {idrCurrency.format(
          Number(cashflowStatsQuery.data?.data["outcome_cash"] || 0)
        )}
      </p>
      <span>Terbilang:</span>
      <p>
        <em>
          <strong>
            {idrNumToWord(cashflowStatsQuery.data?.data["outcome_cash"] || "0")}
            rupiah
          </strong>
        </em>
      </p>
      <h2 className={styles.contentTitle}>Riwayat Uang Kas</h2>
      <h4>
        Jumlah Total Pemasukan: {cashflowStatsQuery.data?.data["income_total"]}{" "}
        pemasukan
      </h4>
      <h4>
        Jumlah Total Pengeluran:{" "}
        {cashflowStatsQuery.data?.data["outcome_total"]} pengeluaran
      </h4>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Tipe</th>
            <th>Catatan</th>
            <th>Nominal Rupiah</th>
          </tr>
        </thead>
        <tbody>
          {cashflowsQuery.data?.data.cashflows.map((val) => {
            const { id, date, idr_amount, note, type } = val;
            return (
              <tr key={id}>
                <td>{date}</td>
                <td>
                  {type === CASHFLOW_TYPE.INCOME ? "Pemasukan" : "Pengeluaran"}
                </td>
                <td>{note}</td>
                <td>{idrCurrency.format(Number(idr_amount))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

Finance.getLayout = function getLayout(page: ReactElement) {
  return <PrintLayout>{page}</PrintLayout>;
};

export default Finance;
