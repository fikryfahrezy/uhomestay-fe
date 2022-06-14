import type { ReactElement } from "react";
import type { DuesOut } from "@/services/dues";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { idrCurrency } from "@/lib/fmt";
import { useCashflowsQuery } from "@/services/cashflow";
import { useMembersQuery } from "@/services/member";
import { useDocumentsQuery, DOC_TYPE } from "@/services/document";
import { useDuesQuery } from "@/services/dues";
import { useMembersDuesQuery } from "@/services/member-dues";
import { useBlogsQuery } from "@/services/blog";
import { usePositionsQuery } from "@/services/position";
import { useFindActivePeriod, useFindPeriodGoal } from "@/services/period";
import { useFindLatestHistory } from "@/services/history";
import MoreLink from "@/layout/morelink";
import AdminLayout from "@/layout/adminpage";
import CashflowSummary from "@/layout/cashflowsummary";
import MemberListItem from "@/layout/memberlistitem";
import DocListItem from "@/layout/doclistitem";
import MemberDuesItem from "@/layout/memberduesitem";
import BlogListItem from "@/layout/bloglistitem";
import PositionListItem from "@/layout/positionlistitem";
import GoalView from "@/layout/goalview";
import EmptyMsg from "@/layout/emptymsg";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const RichText = dynamic(() => import("@/layout/richtext/read"));

const Dashboard = () => {
  const [selectedDues, setSelectedDues] = useState<DuesOut | null>(null);
  const [activePeriod, setActivePeriod] = useState(0);

  const cashflowsQuery = useCashflowsQuery({
    retry: false,
  });
  const membersQuery = useMembersQuery({
    retry: false,
  });
  const documentsQuery = useDocumentsQuery({
    retry: false,
  });
  const duesQuery = useDuesQuery({
    retry: false,
  });
  const blogsQuery = useBlogsQuery({
    retry: false,
  });
  const positionsQuery = usePositionsQuery({
    retry: false,
  });
  const findActivePeriod = useFindActivePeriod({
    retry: false,
  });
  const latestHistory = useFindLatestHistory({
    retry: false,
  });
  const membersDuesQuery = useMembersDuesQuery(
    selectedDues ? selectedDues.id : 0,
    {
      retry: false,
      enabled: !!selectedDues,
    }
  );
  const periodGoal = useFindPeriodGoal(activePeriod, {
    retry: false,
    enabled: !!activePeriod,
  });

  useEffect(() => {
    const duesData = duesQuery.data;
    if (duesData !== undefined && duesData.data.length != 0) {
      setSelectedDues(duesData.data[0]);
    }
  }, [duesQuery.data]);

  useEffect(() => {
    if (findActivePeriod.data !== undefined) {
      setActivePeriod(findActivePeriod.data.data.id);
      return;
    }

    setActivePeriod(9999);
  }, [findActivePeriod.data]);

  return (
    <main>
      <section className={styles.topSection}>
        <div className={styles.contentSection}>
          <h2>Periode Aktif Saat Ini</h2>
          <div>
            {findActivePeriod.isLoading ? (
              "Loading..."
            ) : findActivePeriod.error ? (
              <ErrMsg />
            ) : (
              <>
                <p className={styles.periodDate}>
                  {findActivePeriod.data?.data["start_date"]} /
                </p>
                <p className={`${styles.periodDate} ${styles.periodEndDate}`}>
                  {findActivePeriod.data?.data["end_date"]}
                </p>
              </>
            )}
          </div>
          <MoreLink href="/dashboard/membership/org">Lebih lanjut</MoreLink>
          <h2>Jabatan Tersedia</h2>
          <div className={styles.positionSection}>
            {positionsQuery.isLoading ? (
              "Loading..."
            ) : positionsQuery.error ? (
              <ErrMsg />
            ) : positionsQuery.data?.data.length === 0 ? (
              <EmptyMsg />
            ) : (
              positionsQuery.data?.data.slice(0, 5).map((val) => {
                return <PositionListItem key={val.id} position={val} />;
              })
            )}
          </div>
          <MoreLink href="/dashboard/membership/position">
            Lebih lanjut
          </MoreLink>
        </div>
        <div className={styles.contentSection}>
          {cashflowsQuery.isLoading ? (
            "Loading..."
          ) : cashflowsQuery.error ? (
            <ErrMsg />
          ) : (
            <CashflowSummary
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
          <MoreLink href="/dashboard/finance">Lebih lanjut</MoreLink>
        </div>
      </section>
      <section className={styles.contentSection}>
        <h2>
          Iuran Anggota -{" "}
          {selectedDues !== null && selectedDues !== undefined
            ? selectedDues["date"]
            : ""}{" "}
          -{" "}
          {selectedDues !== null && selectedDues !== undefined
            ? idrCurrency.format(Number(selectedDues["idr_amount"]))
            : ""}
        </h2>
        {membersDuesQuery.isLoading || membersDuesQuery.isIdle ? (
          "Loading..."
        ) : membersDuesQuery.error ? (
          <ErrMsg />
        ) : membersDuesQuery.data.data.length === 0 ? (
          <EmptyMsg />
        ) : (
          membersDuesQuery.data.data.slice(0, 5).map((val) => {
            return <MemberDuesItem key={val.id} member={val} />;
          })
        )}
        <MoreLink href="/dashboard/finance/dues">Lebih lanjut</MoreLink>
      </section>
      <section className={styles.contentSection}>
        <h2>Visi &amp; Misi</h2>
        {periodGoal.isIdle || periodGoal.isLoading ? (
          "Loading..."
        ) : periodGoal.error ? (
          <ErrMsg />
        ) : (
          <GoalView orgPeriodGoal={periodGoal.data.data} />
        )}
        <MoreLink href={`/dashboard/organization/mission/view/${activePeriod}`}>
          Lebih lanjut
        </MoreLink>
      </section>
      <section className={styles.contentSection}>
        <h2>Anggota</h2>
        {membersQuery.isLoading ? (
          "Loading..."
        ) : membersQuery.error ? (
          <ErrMsg />
        ) : membersQuery.data?.data.length === 0 ? (
          <EmptyMsg />
        ) : (
          membersQuery.data?.data.slice(0, 5).map((member) => {
            return <MemberListItem key={member.id} member={member} />;
          })
        )}
        <MoreLink href="/dashboard/membership">Lebih lanjut</MoreLink>
      </section>
      <section className={styles.contentSection}>
        <h2>Dokumen</h2>
        {documentsQuery.isLoading ? (
          "Loading..."
        ) : documentsQuery.error ? (
          <ErrMsg />
        ) : documentsQuery.data?.data.length === 0 ? (
          <EmptyMsg />
        ) : (
          documentsQuery.data?.data
            .filter(({ type }) => type === DOC_TYPE.FILE)
            .slice(0, 5)
            .map((val) => {
              return (
                <a
                  key={val.id}
                  target="_blank"
                  rel="noreferrer"
                  href={val.url}
                  className={styles.documentLink}
                >
                  <DocListItem document={val} />
                </a>
              );
            })
        )}
        <MoreLink href="/dashboard/organization">Lebih lanjut</MoreLink>
      </section>
      <section className={styles.contentSection}>
        <h2>Blog</h2>
        <div className={styles.blogSection}>
          {blogsQuery.isLoading ? (
            "Loading..."
          ) : blogsQuery.error ? (
            <ErrMsg />
          ) : blogsQuery.data?.data.length === 0 ? (
            <EmptyMsg />
          ) : (
            blogsQuery.data?.data.slice(0, 5).map((blog) => {
              return <BlogListItem key={blog.id} blog={blog} />;
            })
          )}
        </div>
        <MoreLink href="/dashboard/blog">Lebih lanjut</MoreLink>
      </section>
      <section className={styles.contentSection}>
        <h2>Sejarah</h2>
        {latestHistory.isLoading ? (
          "Loading..."
        ) : latestHistory.error ? (
          <ErrMsg />
        ) : (
          <RichText
            editorStateJSON={
              latestHistory.data ? latestHistory.data.data.content : null
            }
          />
        )}
        <MoreLink href="/dashboard/organization/history">Lebih lanjut</MoreLink>
      </section>
    </main>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout className={styles.contentLayout}>{page}</AdminLayout>;
};

export default Dashboard;
