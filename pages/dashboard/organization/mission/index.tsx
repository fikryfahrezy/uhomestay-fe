import type { ReactElement } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { idDate } from "@/lib/fmt";
import { usePeriodsQuery } from "@/services/period";
import Chip from "@/components/chip";
import AdminLayout from "@/layout/adminpage";
import EmptyMsg from "@/layout/emptymsg";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const Mission = () => {
  const periodsQuery = usePeriodsQuery();
  const router = useRouter();

  return (
    <>
      <h1 className={styles.pageTitle}>Visi &amp; Misi Periode</h1>
      <div className={styles.contentContainer}>
        {periodsQuery.isLoading ? (
          "Loading..."
        ) : periodsQuery.error ? (
          <ErrMsg />
        ) : periodsQuery.data?.data.periods.length === 0 ? (
          <EmptyMsg />
        ) : (
          periodsQuery.data?.data.periods.map((val) => {
            const {
              id,
              start_date: startDate,
              end_date: endDate,
              is_active: isActive,
            } = val;
            return (
              <Link
                key={id}
                href={{
                  pathname: `${router.pathname}/view/[id]`,
                  query: { id },
                }}
              >
                <a className={styles.chipLink}>
                  <Chip isActive={isActive}>
                    {idDate(new Date(startDate))} / {idDate(new Date(endDate))}
                  </Chip>
                </a>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
};

Mission.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Mission;
