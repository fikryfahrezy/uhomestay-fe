import type { ReactElement } from "react";
import Image from "next/image";
import { idrCurrency, idrNumToWord } from "@/lib/fmt";
import { CASHFLOW_TYPE, useCashflowsQuery } from "@/services/cashflow";
import PrintLayout from "@/layouts/printpage";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Finance = () => {
  const cashflowsQuery = useCashflowsQuery();

  return cashflowsQuery.isLoading ? (
    "Loading..."
  ) : cashflowsQuery.error ? (
    <ErrMsg />
  ) : (
    <div>
      <header className={styles.header}>
        <Image
          src="/images/image/logo.png"
          layout="fixed"
          width="300"
          height="35"
          alt="Logo Img"
        />
        <div>
          <h1 className={styles.title}>Rakap Uang Kas</h1>
          <p className={styles.date}>
            Per-tanggal {new Date().toLocaleString("id-ID")}
          </p>
        </div>
      </header>
      <h2>Total Uang Kas</h2>
      <p>
        {idrCurrency.format(
          Number(cashflowsQuery.data?.data["total_cash"] || 0)
        )}
      </p>
      <span>Terbilang:</span>
      <p>
        <em>
          <strong>
            {idrNumToWord(cashflowsQuery.data?.data["total_cash"] || "0")}
            rupiah
          </strong>
        </em>
      </p>
      <h3>Total Pemasukan</h3>
      <p>
        {idrCurrency.format(
          Number(cashflowsQuery.data?.data["income_cash"] || 0)
        )}
      </p>
      <span>Terbilang:</span>
      <p>
        <em>
          <strong>
            {idrNumToWord(cashflowsQuery.data?.data["income_cash"] || "0")}
            rupiah
          </strong>
        </em>
      </p>
      <h3>Total Pengeluaran</h3>
      <p>
        {idrCurrency.format(
          Number(cashflowsQuery.data?.data["outcome_cash"] || 0)
        )}
      </p>
      <span>Terbilang:</span>
      <p>
        <em>
          <strong>
            {idrNumToWord(cashflowsQuery.data?.data["outcome_cash"] || "0")}
            rupiah
          </strong>
        </em>
      </p>
      <h2 className={styles.contentTitle}>Riwayat Uang Kas</h2>
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
