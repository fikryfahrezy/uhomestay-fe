import type { ReactElement } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { idrCurrency, idrNumToWord } from "@/lib/fmt";
import { useMemberDetailQuery } from "@/services/member";
import { useMemberDuesQuery, DUES_STATUS } from "@/services/member-dues";
import PrintLayout from "@/layouts/adminprintpage";
import ErrMsg from "@/layouts/errmsg";
import ProfileTable from "@/layouts/profiletable";
import styles from "./Styles.module.css";

const MemberDues = () => {
  const router = useRouter();
  const { id } = router.query;

  const memberDuesQuery = useMemberDuesQuery(String(id), {
    enabled: !!id,
  });
  const memberDetailQuery = useMemberDetailQuery(String(id), {
    enabled: !!id,
  });

  return memberDetailQuery.isLoading || memberDetailQuery.isIdle ? (
    "Loading..."
  ) : memberDetailQuery.error ? (
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
          <h1 className={styles.title}>Rekap Iuran Bulanan</h1>
          <p className={styles.date}>
            Per-tanggal {new Date().toLocaleString("id-ID")}
          </p>
        </div>
      </header>
      <h2>{memberDetailQuery.data.data.name}</h2>
      <ProfileTable data={memberDetailQuery.data.data} />
      {memberDuesQuery.isLoading || memberDuesQuery.isIdle ? (
        "Loading..."
      ) : memberDuesQuery.error ? (
        <ErrMsg />
      ) : (
        <div>
          <h2>Total Uang Iuran</h2>
          <p>
            {idrCurrency.format(
              Number(memberDuesQuery.data?.data["total_dues"])
            )}
          </p>
          <span>Terbilang:</span>
          <p>
            <em>
              <strong>
                {idrNumToWord(memberDuesQuery.data?.data["total_dues"] || "0")}
                rupiah
              </strong>
            </em>
          </p>
          <h3>Total Terbayar</h3>
          <p>
            {idrCurrency.format(
              Number(memberDuesQuery.data?.data["paid_dues"] || 0)
            )}
          </p>
          <span>Terbilang:</span>
          <p>
            <em>
              <strong>
                {idrNumToWord(memberDuesQuery.data?.data["paid_dues"] || "0")}
                rupiah
              </strong>
            </em>
          </p>
          <h3>Total Belum Terbayar</h3>
          <p>
            {idrCurrency.format(
              Number(memberDuesQuery.data?.data["unpaid_dues"] || 0)
            )}
          </p>
          <span>Terbilang:</span>
          <p>
            <em>
              <strong>
                {idrNumToWord(memberDuesQuery.data?.data["unpaid_dues"] || "0")}
                rupiah
              </strong>
            </em>
          </p>
          <h2 className={styles.contentTitle}>Daftar Iuran Bulanan</h2>
          <h4>
            Jumlah Total Iuran: {memberDuesQuery.data?.data["total"] || "0"}{" "}
            iuran
          </h4>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Jumlah Iuran</th>
              </tr>
            </thead>
            <tbody>
              {memberDuesQuery.data?.data.dues.map((val) => {
                const { id, status, date, idr_amount: idr } = val;
                return (
                  <tr key={id}>
                    <td>{date}</td>
                    <td>
                      {status === DUES_STATUS.PAID
                        ? "Sudah Lunas"
                        : status === DUES_STATUS.UNPAID
                        ? "Belum Lunas"
                        : "Menunggu Konfirmasi"}
                    </td>
                    <td>{idrCurrency.format(Number(idr))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

MemberDues.getLayout = function getLayout(page: ReactElement) {
  return <PrintLayout>{page}</PrintLayout>;
};

export default MemberDues;
