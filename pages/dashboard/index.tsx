import type { ReactElement } from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { idrCurrency } from "@/lib/fmt";
import { usePrivateDashboardQuery } from "@/services/dashboard";
import MoreLink from "@/layouts/morelink";
import AdminLayout from "@/layouts/adminpage";
import CashflowSummary from "@/layouts/cashflowsummary";
import MemberListItem from "@/layouts/memberlistitem";
import DocListItem from "@/layouts/doclistitem";
import MemberDuesItem from "@/layouts/memberduesitem";
import BlogListItem from "@/layouts/bloglistitem";
import PositionListItem from "@/layouts/positionlistitem";
import GoalView from "@/layouts/goalview";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import GalleryListItem from "@/layouts/gallerylistitem";
import styles from "./Styles.module.css";

const RichText = dynamic(() => import("@/layouts/richtext/read"));

const Dashboard = () => {
  const [token, setToken] = useState("");
  const dashboardQuery = usePrivateDashboardQuery(token, {
    enabled: !!token,
  });

  useEffect(() => {
    const token = window.localStorage.getItem("ajwt");

    if (token !== null) {
      setToken(token);
    }
  }, []);

  return (
    <main>
      <section className={styles.topSection}>
        <div className={styles.contentSection}>
          <h2>Periode Aktif Saat Ini</h2>
          <div>
            {dashboardQuery.isLoading || dashboardQuery.isIdle ? (
              "Loading..."
            ) : dashboardQuery.error ? (
              <ErrMsg />
            ) : (
              <>
                <p className={styles.periodDate}>
                  {dashboardQuery.data.data["active_period"]["start_date"]} /
                </p>
                <p className={`${styles.periodDate} ${styles.periodEndDate}`}>
                  {dashboardQuery.data.data["active_period"]["end_date"]}
                </p>
              </>
            )}
          </div>
          <MoreLink href="/dashboard/membership/org">Lebih lanjut</MoreLink>
          <h2>Jabatan Tersedia</h2>
          {dashboardQuery.isLoading || dashboardQuery.isIdle ? (
            "Loading..."
          ) : dashboardQuery.error ? (
            <ErrMsg />
          ) : dashboardQuery.data.data.positions.length === 0 ? (
            <EmptyMsg />
          ) : (
            <>
              <h4>
                Jumlah Total Jabatan:{" "}
                {dashboardQuery.data.data["position_total"]} jabatan
              </h4>
              <div className={styles.positionSection}>
                {dashboardQuery.data.data.positions.slice(0, 5).map((val) => {
                  return <PositionListItem key={val.id} position={val} />;
                })}
              </div>
            </>
          )}
          <MoreLink href="/dashboard/membership/position">
            Lebih lanjut
          </MoreLink>
        </div>
        <div className={styles.contentSection}>
          {dashboardQuery.isLoading || dashboardQuery.isIdle ? (
            "Loading..."
          ) : dashboardQuery.error ? (
            <ErrMsg />
          ) : (
            <CashflowSummary
              income={idrCurrency.format(
                Number(dashboardQuery.data.data["cashflow"]["income_cash"])
              )}
              outcome={idrCurrency.format(
                Number(dashboardQuery.data.data["cashflow"]["outcome_cash"])
              )}
              total={idrCurrency.format(
                Number(dashboardQuery.data.data["cashflow"]["total_cash"])
              )}
            />
          )}
          <MoreLink href="/dashboard/finance">Lebih lanjut</MoreLink>
        </div>
      </section>
      <section className={styles.contentSection}>
        {dashboardQuery.isLoading || dashboardQuery.isIdle ? (
          "Loading..."
        ) : dashboardQuery.error ? (
          <>
            <h2>Iuran Anggota</h2>
            <ErrMsg />
          </>
        ) : dashboardQuery.data.data["member_dues"].length === 0 ? (
          <>
            <h2>Iuran Anggota</h2>
            <EmptyMsg />
          </>
        ) : (
          <>
            <h2>
              Iuran Anggota - {dashboardQuery.data.data.dues["date"]} -{" "}
              {idrCurrency.format(
                Number(dashboardQuery.data.data.dues["idr_amount"])
              )}
            </h2>
            <h4>
              Jumlah Total Anggota Teragih:{" "}
              {dashboardQuery.data.data["member_dues_total"]} anggota
            </h4>
            {dashboardQuery.data.data["member_dues"].map((val) => {
              return <MemberDuesItem key={val.id} member={val} />;
            })}
          </>
        )}
        <MoreLink href="/dashboard/finance/dues">Lebih lanjut</MoreLink>
      </section>
      <section className={styles.contentSection}>
        <h2>Anggota</h2>
        {dashboardQuery.isLoading || dashboardQuery.isIdle ? (
          "Loading..."
        ) : dashboardQuery.error ? (
          <ErrMsg />
        ) : dashboardQuery.data.data.members.length === 0 ? (
          <EmptyMsg />
        ) : (
          <>
            <h4>
              Jumlah Total Anggota: {dashboardQuery.data.data["member_total"]}{" "}
              anggota
            </h4>
            {dashboardQuery.data.data.members.map((member) => {
              return <MemberListItem key={member.id} member={member} />;
            })}
          </>
        )}
        <MoreLink href="/dashboard/membership">Lebih lanjut</MoreLink>
      </section>
      <section className={styles.contentSection}>
        <h2>Visi &amp; Misi</h2>
        {dashboardQuery.isLoading || dashboardQuery.isIdle ? (
          "Loading..."
        ) : dashboardQuery.error ? (
          <ErrMsg />
        ) : (
          <>
            <GoalView
              orgPeriodGoal={dashboardQuery.data.data["org_period_goal"]}
            />
            <MoreLink
              href={`/dashboard/organization/mission/view/${dashboardQuery.data.data["active_period"].id}`}
            >
              Lebih lanjut
            </MoreLink>
          </>
        )}
      </section>
      <section className={styles.contentSection}>
        <h2>Sejarah</h2>
        {dashboardQuery.isLoading || dashboardQuery.isIdle ? (
          "Loading..."
        ) : dashboardQuery.error ? (
          <ErrMsg />
        ) : (
          <RichText
            editorStateJSON={dashboardQuery.data.data["latest_history"].content}
          />
        )}
        <MoreLink href="/dashboard/organization/history">Lebih lanjut</MoreLink>
      </section>
      <section className={styles.contentSection}>
        <h2>Dokumen</h2>
        {dashboardQuery.isLoading || dashboardQuery.isIdle ? (
          "Loading..."
        ) : dashboardQuery.error ? (
          <ErrMsg />
        ) : dashboardQuery.data.data.documents.length === 0 ? (
          <EmptyMsg />
        ) : (
          <>
            <h4>
              Jumlah Total File: {dashboardQuery.data.data["document_total"]}{" "}
              file
            </h4>
            {dashboardQuery.data.data.documents.map((val) => {
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
            })}
          </>
        )}
        <MoreLink href="/dashboard/organization">Lebih lanjut</MoreLink>
      </section>
      <section className={styles.contentSection}>
        <h2>Artikel</h2>
        {dashboardQuery.isLoading || dashboardQuery.isIdle ? (
          "Loading..."
        ) : dashboardQuery.error ? (
          <ErrMsg />
        ) : dashboardQuery.data.data.articles.length === 0 ? (
          <EmptyMsg />
        ) : (
          <>
            <h4>
              Jumlah Total Artikel: {dashboardQuery.data.data["article_total"]}{" "}
              artikel
            </h4>
            <div className={styles.blogSection}>
              {dashboardQuery.data.data.articles.map((blog) => {
                return <BlogListItem key={blog.id} blog={blog} />;
              })}
            </div>
          </>
        )}
        <MoreLink href="/dashboard/article">Lebih lanjut</MoreLink>
      </section>
      <section className={styles.contentSection}>
        <h2>Galeri</h2>
        {dashboardQuery.isLoading || dashboardQuery.isIdle ? (
          "Loading..."
        ) : dashboardQuery.error ? (
          <ErrMsg />
        ) : dashboardQuery.data.data.images.length === 0 ? (
          <EmptyMsg />
        ) : (
          <>
            <h4>
              Jumlah Total Foto: {dashboardQuery.data.data["image_total"]} foto
            </h4>
            <div className={styles.blogSection}>
              {dashboardQuery.data.data.images.map((image) => {
                return <GalleryListItem key={image.id} imgData={image} />;
              })}
            </div>
          </>
        )}
        <MoreLink href="/dashboard/gallery">Lebih lanjut</MoreLink>
      </section>
    </main>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout className={styles.contentLayout}>{page}</AdminLayout>;
};

export default Dashboard;
