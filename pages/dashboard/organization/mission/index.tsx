import type { ReactElement } from "react";
import { Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { idDate } from "@/lib/fmt";
import { debounce } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import { usePeriodsQuery } from "@/services/period";
import Chip from "cmnjg-sb/dist/chip";
import AdminLayout from "@/layouts/adminpage";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Mission = () => {
  const periodsQuery = usePeriodsQuery({
    getPreviousPageParam: (firstPage) => firstPage.data.cursor || undefined,
    getNextPageParam: (lastPage) => lastPage.data.cursor || undefined,
  });
  const router = useRouter();

  const observeCallback = () => {
    if (periodsQuery.hasNextPage) {
      periodsQuery.fetchNextPage();
    }
  };

  return (
    <>
      <h1 className={styles.pageTitle}>Visi &amp; Misi Periode</h1>
      <div className={styles.contentContainer}>
        {periodsQuery.isLoading ? (
          "Loading..."
        ) : periodsQuery.error ? (
          <ErrMsg />
        ) : periodsQuery.data?.pages[0].data.periods.length === 0 ? (
          <EmptyMsg />
        ) : (
          periodsQuery.data?.pages.map((page) => {
            return (
              <Fragment key={page.data.cursor}>
                {page.data.periods.map((val) => {
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
                        <Chip isActive={isActive} data-testid="period-chip">
                          {idDate(new Date(startDate))} /{" "}
                          {idDate(new Date(endDate))}
                        </Chip>
                      </a>
                    </Link>
                  );
                })}
              </Fragment>
            );
          })
        )}
      </div>
      <Observe callback={debounce(observeCallback, 500)} />
    </>
  );
};

Mission.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Mission;
