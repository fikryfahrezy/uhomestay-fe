import type { ReactElement } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { idrCurrency, idrNumToWord, yyyyMm } from "@/lib/fmt";
import { useMembersDuesQuery, DUES_STATUS } from "@/services/member-dues";
import PrintLayout from "@/layouts/adminprintpage";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Dues = () => {
  const router = useRouter();
  const { id, start_date: startDate, end_date: endDate } = router.query;

  const membersDuesQuery = useMembersDuesQuery(
    Number(id),
    String(startDate) || "",
    String(endDate) || "",
    {
      enabled: !!id && !!startDate && !!endDate,
      retry: false,
    }
  );

  return membersDuesQuery.isLoading || membersDuesQuery.isIdle ? (
    <EmptyMsg />
  ) : membersDuesQuery.error ? (
    <ErrMsg />
  ) : membersDuesQuery.data?.data["member_dues"].length === 0 ? (
    <EmptyMsg />
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
          <h1 className={styles.title}>Rekap Iuran Bulanan</h1>
          <h2 className={styles.title}>
            Bulan{" "}
            {yyyyMm(new Date(membersDuesQuery.data?.data["dues_date"] || ""))}
          </h2>
          <p className={styles.date}>
            Per-tanggal {new Date().toLocaleString("id-ID")}
          </p>
        </div>
      </header>
      <h2>Jumlah Iuran</h2>
      <p>
        {idrCurrency.format(
          Number(membersDuesQuery.data?.data["dues_amount"] || 0)
        )}
      </p>
      <span>Terbilang:</span>
      <p>
        <em>
          <strong>
            {idrNumToWord(membersDuesQuery.data?.data["dues_amount"] || "0")}
            rupiah
          </strong>
        </em>
      </p>
      <h3>Jumlah Terbayar</h3>
      <p>
        {idrCurrency.format(
          Number(membersDuesQuery.data?.data["paid_dues"] || 0)
        )}
      </p>
      <span>Terbilang:</span>
      <p>
        <em>
          <strong>
            {idrNumToWord(membersDuesQuery.data?.data["paid_dues"] || "0")}
            rupiah
          </strong>
        </em>
      </p>
      <h3>Belum Terbayar</h3>
      <p>
        {idrCurrency.format(
          Number(membersDuesQuery.data?.data["unpaid_dues"] || 0)
        )}
      </p>
      <span>Terbilang:</span>
      <p>
        <em>
          <strong>
            {idrNumToWord(membersDuesQuery.data?.data["unpaid_dues"] || "0")}
            rupiah
          </strong>
        </em>
      </p>
      <h2 className={styles.contentTitle}>Daftar Anggota</h2>
      <h4>
        Jumlah Total Anggota Teragih:{" "}
        {membersDuesQuery.data?.data["total"] || "0"} anggota
      </h4>
      <h4>
        Rentang pembayaran dari {startDate} sampai {endDate}
      </h4>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Status</th>
            <th>Tanggal Pembayaran</th>
            <th>Nama Anggota</th>
          </tr>
        </thead>
        <tbody>
          {membersDuesQuery.data?.data["member_dues"].map((val) => {
            const { id, name, status, pay_date: payDate } = val;
            return (
              <tr key={id}>
                <td>
                  {status === DUES_STATUS.PAID
                    ? "Sudah Lunas"
                    : status === DUES_STATUS.UNPAID
                    ? "Belum Lunas"
                    : "Menunggu Konfirmasi"}
                </td>
                <td>{payDate}</td>
                <td>{name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

Dues.getLayout = function getLayout(page: ReactElement) {
  return <PrintLayout>{page}</PrintLayout>;
};

export default Dues;
