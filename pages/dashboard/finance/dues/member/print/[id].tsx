import type { ReactElement } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { idrCurrency, yyyyMm, idrNumToWord } from "@/lib/fmt";
import { useMemberDetailQuery } from "@/services/member";
import { useMemberDuesQuery, DUES_STATUS } from "@/services/member-dues";
import PrintLayout from "@/layouts/printpage";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const MemberDues = () => {
  const router = useRouter();
  const { id } = router.query;

  const memberDuesQuery = useMemberDuesQuery(id as string, {
    enabled: !!id,
  });
  const memberDetailQuery = useMemberDetailQuery(id as string, {
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
          alt="Logo Img"
        />
        <div>
          <h1 className={styles.title}>Rakap Iuran Bulanan</h1>
          <p className={styles.date}>
            Per-tanggal {new Date().toLocaleString("id-ID")}
          </p>
        </div>
      </header>
      <h2>{memberDetailQuery.data.data.name}</h2>
      <table>
        <tbody>
          <tr>
            <td>Nomor WA</td>
            <td>:</td>
            <td>{memberDetailQuery.data.data["wa_phone"]}</td>
          </tr>
          <tr>
            <td>Nomor Lainnya</td>
            <td>:</td>
            <td>{memberDetailQuery.data.data["other_phone"]}</td>
          </tr>
          <tr>
            <td>Jabatan</td>
            <td>:</td>
            <td>{memberDetailQuery.data.data.position}</td>
          </tr>
          <tr>
            <td>Periode</td>
            <td>:</td>
            <td>{memberDetailQuery.data.data.period}</td>
          </tr>
          <tr>
            <td>Nama Homestay</td>
            <td>:</td>
            <td>{memberDetailQuery.data.data["homestay_name"]}</td>
          </tr>
          <tr>
            <td>Alamat Homestay</td>
            <td>:</td>
            <td>{memberDetailQuery.data.data["homestay_address"]}</td>
          </tr>
        </tbody>
      </table>
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
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Nama Anggota</th>
              </tr>
            </thead>
            <tbody>
              {memberDuesQuery.data?.data.dues.map((val) => {
                const { id, status, date, idr_amount: idr } = val;
                return (
                  <tr key={id}>
                    <td>{yyyyMm(new Date(date))}</td>
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
