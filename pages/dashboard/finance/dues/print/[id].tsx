import type { ReactElement } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { idrCurrency, yyyyMm, idrNumToWord } from "@/lib/fmt";
import { useMembersDuesQuery, DUES_STATUS } from "@/services/member-dues";
import PrintLayout from "@/layouts/printpage";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Dues = () => {
  const router = useRouter();
  const { id } = router.query;

  const membersDuesQuery = useMembersDuesQuery(Number(id), {
    enabled: !!id,
  });

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
          alt="Logo Img"
        />
        <div>
          <h1 className={styles.title}>Rakap Iuran Bulanan</h1>
          <h2 className={styles.title}>
            Bulan {yyyyMm(new Date(membersDuesQuery.data?.data["dues_date"]))}
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
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Status</th>
            <th>Nama Anggota</th>
          </tr>
        </thead>
        <tbody>
          {membersDuesQuery.data?.data["member_dues"].map((val) => {
            const { id, name, status } = val;
            return (
              <tr key={id}>
                <td>
                  {status === DUES_STATUS.PAID
                    ? "Sudah Lunas"
                    : status === DUES_STATUS.UNPAID
                    ? "Belum Lunas"
                    : "Menunggu Konfirmasi"}
                </td>
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
