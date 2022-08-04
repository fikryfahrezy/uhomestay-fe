import type { ReactElement } from "react";
import { Fragment } from "react";
import { useRouter } from "next/router";
import { RiCalendar2Fill, RiMore2Line } from "react-icons/ri";
import Link from "next/link";
import { idDate } from "@/lib/fmt";
import { debounce } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import { usePeriodsQuery } from "@/services/period";
import Badge from "@/components/badge";
import IconButton from "@/components/iconbutton";
import { LinkBox, LinkOverlay } from "@/components/linkoverlay";
import AdminLayout from "@/layouts/adminpage";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import BadgeList from "@/layouts/badgelist";
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
          <>
            <h3>
              Jumlah Total Periode Organisasi:{" "}
              {periodsQuery.data?.pages[0].data.total} periode
            </h3>
            {periodsQuery.data?.pages.map((page) => {
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
                      <BadgeList
                        key={id}
                        icon={<RiCalendar2Fill />}
                        badge={
                          isActive ? (
                            <Badge colorScheme="green">Periode Aktif</Badge>
                          ) : (
                            <></>
                          )
                        }
                        moreBtn={
                          <LinkBox key={id} className={styles.buttonNavLink}>
                            <IconButton
                              className={styles.moreBtn}
                              data-testid="period-chip"
                            >
                              <RiMore2Line />
                              <Link
                                href={{
                                  pathname: `${router.pathname}/view/[id]`,
                                  query: { id },
                                }}
                                passHref
                              >
                                <LinkOverlay />
                              </Link>
                            </IconButton>
                          </LinkBox>
                        }
                      >
                        {idDate(new Date(startDate))} /{" "}
                        {idDate(new Date(endDate))}
                      </BadgeList>
                    );
                  })}
                </Fragment>
              );
            })}
          </>
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
