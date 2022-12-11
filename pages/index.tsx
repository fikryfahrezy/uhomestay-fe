import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { RiMenuFoldLine } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import { useDashboardQuery } from "@/services/dashboard";
import { LinkBox, LinkOverlay } from "@/components/linkoverlay";
import Drawer from "@/components/drawer";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import MoreLink from "@/layouts/morelink";
import DocListItem from "@/layouts/doclistitem";
import BlogListItem from "@/layouts/bloglistitem";
import GalleryListItem from "@/layouts/gallerylistitem";
import styles from "./Styles.module.css";

const RichText = dynamic(() => import("@/layouts/richtext/read"));

const LandingPage = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isNavHiding, setNavHiding] = useState(false);
  const dasboardQuery = useDashboardQuery({ refetchOnWindowFocus: false });
  const prevScrollPos = useRef(0);
  const navLinks = useRef([
    {
      href: "#organization",
      children: "Organisasi",
    },
    {
      href: "#mission",
      children: "Visi & Misi",
    },
    {
      href: "#history",
      children: "Sejarah",
    },
    {
      href: "#gallery",
      children: "Galeri",
    },
    {
      href: "#article",
      children: "Artikel",
    },
    {
      href: "#document",
      children: "Dokumen",
    },
  ]);
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (mainRef.current === null) {
      return;
    }

    const mainElement = mainRef.current;
    prevScrollPos.current = mainElement.scrollTop;

    const onScroll = () => {
      const currScrollPos = mainElement.scrollTop;
      if (prevScrollPos.current > currScrollPos) {
        setNavHiding(false);
      } else {
        setNavHiding(true);
      }

      prevScrollPos.current = currScrollPos;
    };

    mainElement.addEventListener("scroll", onScroll);
    return () => {
      mainElement.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <main ref={mainRef} className={styles.main}>
        <nav
          className={`${styles.nav} ${
            isNavHiding === true ? styles.hidingNav : ""
          }`}
        >
          <div>
            <Image
              src="/images/image/logo.png"
              width={329}
              height={42}
              alt="Website Logo"
            />
            <ul className={styles.ul}>
              {navLinks.current.map(({ href, children }, i) => (
                <li key={i}>
                  <a className={styles.navLink} href={href}>
                    {children}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className={styles.actionBtn}>
              <Link href="/login/admin">
                <a>
                  <button className={styles.loginBtn}>Admin</button>
                </a>
              </Link>
              <Link href="/login/member">
                <a>
                  <button className={styles.loginBtn}>Anggota</button>
                </a>
              </Link>
              <Link href="/register">
                <a>
                  <button className={styles.registerBtn}>Register</button>
                </a>
              </Link>
            </div>
            <button
              className={styles.menuFold}
              onClick={() => setDrawerOpen(true)}
            >
              <RiMenuFoldLine />
            </button>
          </div>
        </nav>
        <header
          className={`${styles.section} ${styles.parallax} ${styles.header}`}
        >
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>Paguyuban Homestay Desa Laksana</h1>
          </div>
          <p className={styles.thumbnailCitation}>
            Jembatan Linkar Cukang Monteng atau Kamojang Hill Bride di Kabupaten
            Garut, Jawa Barat. (Arsip Kementerian Pariwisata)
          </p>
        </header>
        <section
          className={`${styles.section} ${styles.noparallax} ${styles.welcomeSection}`}
        >
          <div className={styles.sectionBody}>
            <h2
              className={`${styles.periodTitle} ${styles.welcomeSectionTitle}`}
            >
              Wilujeung Sumping
            </h2>
            <p className={styles.welcomeParagraph}>
              Website ini dibuat sebagai sarana untuk memberikan beragam
              informasi khususnya yang berkaitan dengan paguyuban homestay desa
              kamojang.
            </p>
            <p className={styles.welcomeParagraph}>
              Kami secara aktif terus berinovasi untuk memberikan informasi yang
              relevan demi untuk peningkatan kepuasan dalam mendapatkan
              informasi khususnya dari Desa Wisata Kamojang.
            </p>
            <p className={styles.welcomeParagraph}>
              Terima kasih anda telah berkunjung di website kami. Harapan kami,
              website ini bisa menjadi referensi bagi siapapun yang ingin
              mendapatkan informasi tentang Paguyuban Homestay Desa Kamojang.
            </p>
            <p className={styles.welcomeParagraph}>Hatur Nuhun</p>
          </div>
        </section>
        <section
          className={`${styles.section} ${styles.noparallax} ${styles.orgPeriodSection}`}
        >
          <div className={styles.sectionBody}>
            {dasboardQuery.isLoading || dasboardQuery.isIdle ? (
              "Loading..."
            ) : dasboardQuery.error ? (
              <ErrMsg />
            ) : dasboardQuery.data.data["org_period_structures"].positions
                .length === 0 ? (
              <EmptyMsg />
            ) : (
              <>
                <h2 className={`${styles.periodSubTitle} ${styles.pt50}`}>
                  <a id="organization">Struktur Organiasi Periode </a>
                </h2>
                <h2 className={`${styles.periodSubTitle} ${styles.pb50}`}>
                  {dasboardQuery.isLoading || dasboardQuery.isIdle ? (
                    "Loading..."
                  ) : dasboardQuery.error ? (
                    <></>
                  ) : (
                    <a>
                      {
                        dasboardQuery.data.data["org_period_structures"][
                          "start_date"
                        ]
                      }
                      /
                      {
                        dasboardQuery.data.data["org_period_structures"][
                          "end_date"
                        ]
                      }
                    </a>
                  )}
                </h2>
                {dasboardQuery.data.data["org_period_structures"].positions
                  .sort((a, b) => a.level - b.level)
                  .map(({ id, level, name, members }) => {
                    return (
                      <div key={id}>
                        <h3 className={styles.positionName}>{name}</h3>
                        <div className={styles.avatarsContainer}>
                          {members.map(
                            ({ id, name, profile_pic_url: picUrl }) => {
                              return (
                                <LinkBox key={id}>
                                  <div
                                    className={`${styles.avatarContainer} ${
                                      level <= 1
                                        ? styles.levelOne
                                        : styles.levelTwo
                                    }`}
                                  >
                                    <div className={styles.avatarImgContainer}>
                                      <Image
                                        src={
                                          typeof picUrl === "string" &&
                                          picUrl !== ""
                                            ? picUrl
                                            : "/images/image/person.png"
                                        }
                                        layout="fill"
                                        alt="Member Profile Picture"
                                      />
                                    </div>
                                    <span className={styles.avatarName}>
                                      {name}
                                    </span>
                                  </div>
                                  <Link
                                    href={{
                                      pathname: "./homestay/[id]",
                                      query: { id },
                                    }}
                                    passHref
                                  >
                                    <LinkOverlay />
                                  </Link>
                                </LinkBox>
                              );
                            }
                          )}
                        </div>
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        </section>
        <section
          className={`${styles.section} ${styles.parallax} ${styles.goalSection}`}
        >
          <div className={`${styles.sectionBody} ${styles.goalBody}`}>
            <div className={styles.goalImagContainer}>
              <Image
                src="/images/image/coffee-garden-homestay.jpg"
                layout="fill"
                objectFit="cover"
                alt="Coffee Garden Homestay"
              />
            </div>
            {dasboardQuery.isLoading || dasboardQuery.isIdle ? (
              "Loading..."
            ) : dasboardQuery.error ? (
              <ErrMsg />
            ) : (
              <div className={styles.missionsContainer}>
                <div className={styles.missionContainer}>
                  <h3 className={styles.goalTitle}>
                    <a id="mission">Visi</a>
                  </h3>
                  <RichText
                    editorStateJSON={
                      dasboardQuery.data.data["org_period_structures"].vision
                    }
                    className={styles.goalContent}
                    placeholder={
                      <div className={styles.richTextPlaceholder}>
                        Tidak ada konten untuk sekarang...
                      </div>
                    }
                  />
                </div>
                <div className={styles.missionContainer}>
                  <h3 className={styles.goalTitle}>Misi</h3>
                  <RichText
                    editorStateJSON={
                      dasboardQuery.data.data["org_period_structures"].mission
                    }
                    className={styles.goalContent}
                    placeholder={
                      <div className={styles.richTextPlaceholder}>
                        Tidak ada konten untuk sekarang...
                      </div>
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </section>
        <section
          className={`${styles.section} ${styles.noparallax} ${styles.historySection}`}
        >
          <div className={`${styles.sectionBody} ${styles.historyBody}`}>
            <h2 className={styles.historyTitle}>
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
                className={styles.historyContent}
                placeholder={
                  <div className={styles.richTextPlaceholder}>
                    Tidak ada konten untuk sekarang...
                  </div>
                }
              />
            )}
          </div>
        </section>
        <section
          className={`${styles.section} ${styles.parallax} ${styles.contentSection}`}
        >
          <div className={`${styles.sectionBody} ${styles.contentBody}`}>
            <div className={styles.contentWrapper}>
              <div className={styles.contentHeader}>
                <h2 className={styles.contentTitle}>
                  <a id="gallery">Galeri</a>
                </h2>
                <MoreLink href="/gallery">Lebih banyak</MoreLink>
              </div>
              <div className={styles.contentContainer}>
                {dasboardQuery.isLoading ? (
                  "Loading..."
                ) : dasboardQuery.error ? (
                  <ErrMsg />
                ) : dasboardQuery.data?.data.images.length === 0 ? (
                  <EmptyMsg />
                ) : (
                  dasboardQuery.data?.data.images.map((image) => {
                    return <GalleryListItem key={image.id} imgData={image} />;
                  })
                )}
              </div>
            </div>
            <div className={styles.contentWrapper}>
              <div className={styles.contentHeader}>
                <h2 className={styles.contentTitle}>
                  <a id="article">Artikel</a>
                </h2>
                <MoreLink href="/article">Lebih banyak</MoreLink>
              </div>
              <div className={styles.contentContainer}>
                {dasboardQuery.isLoading ? (
                  "Loading..."
                ) : dasboardQuery.error ? (
                  <ErrMsg />
                ) : dasboardQuery.data?.data.articles.length === 0 ? (
                  <EmptyMsg />
                ) : (
                  dasboardQuery.data?.data.articles.map((blog) => {
                    return (
                      <LinkBox key={blog.id}>
                        <BlogListItem blog={blog} />
                        <Link
                          href={{
                            pathname: "./article/view/[id]",
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
            </div>
          </div>
          <div className={`${styles.sectionBody} ${styles.documentBody}`}>
            <div className={styles.contentHeader}>
              <h2 className={styles.documentTitle}>
                <a id="document">Dokumen</a>
              </h2>
              <span className={styles.documentAnchor}>
                <MoreLink href="/document">Lebih banyak</MoreLink>
              </span>
            </div>
            <div>
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
            </div>
          </div>
        </section>
        <section
          className={`${styles.section} ${styles.parallax} ${styles.mapSection}`}
        />
        <section className={`${styles.section} ${styles.noparallax}`}>
          <div className={styles.mapBody}>
            <iframe
              allowFullScreen={true}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2799.268627817353!2d107.79067146810185!3d-7.153292739133035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68b9b7bd3bb413%3A0x958a235fb98d769d!2sKamojang%20hill!5e0!3m2!1sen!2sid!4v1648603356568!5m2!1sen!2sid"
              width="600"
              height="450"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: "100%", height: "100%", border: 0 }}
            />
          </div>
        </section>
      </main>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        withBackdrop={false}
        className={styles.drawer}
      >
        <div className={styles.drawerContainer}>
          <ul className={styles.drawerUl}>
            {navLinks.current.map(({ href, children }, i) => (
              <li key={i}>
                <a
                  className={`${styles.navLink} ${styles.drawerNavLink}`}
                  href={href}
                  onClick={() => setDrawerOpen(false)}
                >
                  {children}
                </a>
              </li>
            ))}
          </ul>
          <div>
            <div className={styles.drawerActionBtn}>
              <Link href="/login/admin">
                <a className={styles.drawerActionLink}>
                  <button className={styles.loginBtn}>Admin</button>
                </a>
              </Link>
              <Link href="/login/member">
                <a className={styles.drawerActionLink}>
                  <button className={styles.loginBtn}>Anggota</button>
                </a>
              </Link>
              <Link href="/register">
                <a className={styles.drawerActionLink}>
                  <button className={styles.registerBtn}>Register</button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default LandingPage;
