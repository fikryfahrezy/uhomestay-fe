import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDashboardQuery } from "@/services/dashboard";
import { LinkBox, LinkOverlay } from "cmnjg-sb/dist/linkoverlay";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import MoreLink from "@/layouts/morelink";
import DocListItem from "@/layouts/doclistitem";
import GoalView from "@/layouts/goalview";
import BlogListItem from "@/layouts/bloglistitem";
import styles from "./Styles.module.css";

const RichText = dynamic(() => import("@/layouts/richtext/read"));

const LandingPage = () => {
  const [isNavHiding, setNavHiding] = useState(false);
  const dasboardQuery = useDashboardQuery();
  const prevScrollPos = useRef(0);

  useEffect(() => {
    prevScrollPos.current = window.scrollY;

    /**
     * @param {Event} e
     */
    const onScroll = () => {
      const currScrollPos = window.scrollY;
      if (prevScrollPos.current > currScrollPos) {
        setNavHiding(false);
      } else {
        setNavHiding(true);
      }

      prevScrollPos.current = currScrollPos;
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className={styles.page}>
      <nav
        className={`${styles.nav} ${
          isNavHiding === true ? styles.hidingNav : ""
        }`}
      >
        <Image
          src="/images/image/logo.png"
          width={329}
          height={42}
          alt="Test"
        />
        <ul className={styles.ul}>
          <li>
            <a className={styles.navLink} href="#organization">
              Organisasi
            </a>
          </li>
          <li>
            <a className={styles.navLink} href="#mission">
              Visi &amp; Misi
            </a>
          </li>
          <li>
            <a className={styles.navLink} href="#history">
              Sejarah
            </a>
          </li>
          <li>
            <a className={styles.navLink} href="#blog">
              Blog
            </a>
          </li>
          <li>
            <a className={styles.navLink} href="#document">
              Dokumen
            </a>
          </li>
          <li>
            <Link href="/login/admin">
              <a className={styles.navLink}>Admin</a>
            </Link>
          </li>
          <li>
            <Link href="/login/member">
              <a className={styles.navLink}>Anggota</a>
            </Link>
          </li>
          <li>
            <Link href="/register">
              <a className={styles.navLink}>Register</a>
            </Link>
          </li>
        </ul>
      </nav>
      <header className={styles.header}>
        <Image
          src="/images/image/lp-bg.png"
          layout="fill"
          objectFit="cover"
          alt="blsa"
          priority={true}
        />
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Paguyuban Homestay Desa Laksana</h1>
        </div>
      </header>
      <main className={styles.contentContainer}>
        <section className={`${styles.section} ${styles.periodTitle}`}>
          <h2 className={styles.periodSubTitle}>
            <a id="organization">Struktur Organiasi Periode </a>
          </h2>
          <h2 className={styles.periodSubTitle}>
            {dasboardQuery.isLoading || dasboardQuery.isIdle ? (
              "Loading..."
            ) : dasboardQuery.error ? (
              <></>
            ) : (
              <a>
                {dasboardQuery.data.data["org_period_structures"]["start_date"]}
                /{dasboardQuery.data.data["org_period_structures"]["end_date"]}
              </a>
            )}
          </h2>
        </section>
        <section className={styles.section}>
          {dasboardQuery.isLoading || dasboardQuery.isIdle ? (
            "Loading..."
          ) : dasboardQuery.error ? (
            <ErrMsg />
          ) : dasboardQuery.data.data["org_period_structures"].positions
              .length === 0 ? (
            <EmptyMsg />
          ) : (
            dasboardQuery.data.data["org_period_structures"].positions
              .sort((a, b) => a.level - b.level)
              .map(({ id, level, name, members }) => {
                return (
                  <div key={id}>
                    <h3 className={styles.heading3}>{name}</h3>
                    <div className={styles.avatarsContainer}>
                      {members
                        .filter(({ id }) => id !== "")
                        .map(({ id, name, profile_pic_url: picUrl }) => {
                          return (
                            <div
                              key={id}
                              className={`${styles.avatarContainer} ${
                                level <= 1 ? styles.levelOne : styles.levelTwo
                              }`}
                            >
                              <div className={styles.avatarImgContainer}>
                                <Image
                                  src={
                                    typeof picUrl === "string" && picUrl !== ""
                                      ? picUrl
                                      : "/images/image/person.png"
                                  }
                                  layout="fill"
                                  alt="hfisfjs"
                                />
                              </div>
                              <span className={styles.avatarName}>{name}</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })
          )}
        </section>
        <section className={styles.section}>
          <h2 className={styles.subTitle}>
            <a id="mission">Visi &amp; Misi</a>
          </h2>
        </section>
        <section className={styles.section}>
          {dasboardQuery.isLoading || dasboardQuery.isIdle ? (
            "Loading..."
          ) : dasboardQuery.error ? (
            <ErrMsg />
          ) : (
            <GoalView
              orgPeriodGoal={{
                mission:
                  dasboardQuery.data.data["org_period_structures"].mission,
                vision: dasboardQuery.data.data["org_period_structures"].vision,
              }}
            />
          )}
        </section>
        <section className={styles.section}>
          <h2 className={styles.subTitle}>
            <a id="history">Sejarah</a>
          </h2>
          {dasboardQuery.isLoading ? (
            "Loading..."
          ) : dasboardQuery.error ? (
            <ErrMsg />
          ) : (
            <RichText
              editorStateJSON={
                dasboardQuery.data?.data["latest_history"].content ?? null
              }
              placeholder={
                <div className={styles.richTextPlaceholder}>
                  Tidak ada konten untuk sekarang...
                </div>
              }
            />
          )}
        </section>
        <section className={styles.section}>
          <h2 className={styles.subTitle}>
            <a id="blog">Blog</a>
          </h2>
          <div className={styles.blogsContainer}>
            {dasboardQuery.isLoading ? (
              "Loading..."
            ) : dasboardQuery.error ? (
              <ErrMsg />
            ) : dasboardQuery.data?.data.blogs.length === 0 ? (
              <EmptyMsg />
            ) : (
              dasboardQuery.data?.data.blogs.map((blog) => {
                return (
                  <LinkBox key={blog.id}>
                    <BlogListItem blog={blog} />
                    <Link
                      href={{
                        pathname: "./blog/view/[id]",
                        query: { id: blog.id },
                      }}
                      passHref
                    >
                      <LinkOverlay />
                    </Link>
                  </LinkBox>
                );
              })
            )}
          </div>
          <MoreLink href="/blog">Lebih banyak</MoreLink>
        </section>
        <section className={styles.section}>
          <h2 className={styles.subTitle}>
            <a id="document">Dokumen</a>
          </h2>
          {dasboardQuery.isLoading ? (
            "Loading..."
          ) : dasboardQuery.error ? (
            <ErrMsg />
          ) : dasboardQuery.data?.data.documents.length === 0 ? (
            <EmptyMsg />
          ) : (
            dasboardQuery.data?.data.documents.map((doc) => {
              return (
                <a
                  target="_blank"
                  rel="noreferrer"
                  key={doc.id}
                  href={doc.url}
                  className={styles.documentLink}
                >
                  <DocListItem document={doc} />
                </a>
              );
            })
          )}
          <MoreLink href="/document">Lebih banyak</MoreLink>
        </section>
        <section className={styles.section}>
          <iframe
            allowFullScreen={true}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2799.268627817353!2d107.79067146810185!3d-7.153292739133035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68b9b7bd3bb413%3A0x958a235fb98d769d!2sKamojang%20hill!5e0!3m2!1sen!2sid!4v1648603356568!5m2!1sen!2sid"
            width="600"
            height="450"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ width: "100%", border: 0 }}
          />
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
