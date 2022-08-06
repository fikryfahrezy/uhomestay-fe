import type { MouseEvent } from "react";
import type { LinkTreeProps } from "@/components/aside";
import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import {
  RiHome3Line,
  RiUser3Line,
  RiUserSettingsFill,
  RiTeamLine,
  RiFileList3Line,
  RiCheckboxMultipleLine,
  RiBook2Line,
  RiDoubleQuotesL,
  RiLogoutBoxRLine,
  RiExchangeDollarFill,
  RiCurrencyLine,
  RiGalleryLine,
} from "react-icons/ri";
import { useAdmin, memberLogout } from "@/services/member";
import Avatar from "@/components/avatar";
import PopUp from "@/components/popup";
import Aside from "@/components/aside";
import LinkButton from "@/components/linkbutton";
import ActiveLink from "@/layouts/activelink";
import styles from "./Styles.module.css";

const AdminPage = ({ children, className }: JSX.IntrinsicElements["div"]) => {
  const router = useRouter();
  const adminQuery = useAdmin({
    redirectTo: "/login/admin",
  });

  const memberLogoutMutation = useMutation(() => {
    return memberLogout();
  });

  const linkList = useMemo(() => {
    const links: LinkTreeProps[] = [
      {
        key: "1",
        isLink: true,
        element: (
          <ActiveLink
            href="/dashboard"
            activeClassName={styles.activeLink}
            passHref
          >
            <LinkButton className={styles.sideLink} leftIcon={<RiHome3Line />}>
              <span className={styles.sideLinkText}>Dashboard</span>
            </LinkButton>
          </ActiveLink>
        ),
      },
      {
        key: "2",
        element: (
          <LinkButton
            className={styles.sideLink}
            colorScheme={router.asPath.includes("membership") ? "green" : ""}
          >
            <span className={styles.sideLinkText}>Keanggotaan</span>
          </LinkButton>
        ),
        isActive: router.asPath.includes("membership"),
        childrens: [
          {
            key: "11",
            isLink: true,
            element: (
              <ActiveLink
                href="/dashboard/membership"
                activeClassName={styles.activeLink}
                passHref
              >
                <LinkButton
                  className={styles.sideLink}
                  leftIcon={<RiUser3Line />}
                >
                  <span className={styles.sideLinkText}>Anggota</span>
                </LinkButton>
              </ActiveLink>
            ),
          },
          {
            key: "12",
            isLink: true,
            element: (
              <ActiveLink
                href="/dashboard/membership/position"
                activeClassName={styles.activeLink}
                passHref
              >
                <LinkButton
                  className={styles.sideLink}
                  leftIcon={<RiUserSettingsFill />}
                >
                  <span className={styles.sideLinkText}>Jabatan</span>
                </LinkButton>
              </ActiveLink>
            ),
          },
          {
            key: "13",
            isLink: true,
            element: (
              <ActiveLink
                href="/dashboard/membership/org"
                activeClassName={styles.activeLink}
                passHref
              >
                <LinkButton
                  className={styles.sideLink}
                  leftIcon={<RiTeamLine />}
                >
                  <span className={styles.sideLinkText}>
                    Periode Organisasi
                  </span>
                </LinkButton>
              </ActiveLink>
            ),
          },
        ],
      },
      {
        key: "3",
        element: (
          <LinkButton
            className={styles.sideLink}
            colorScheme={router.asPath.includes("organization") ? "green" : ""}
          >
            Keorganisasian
          </LinkButton>
        ),
        isActive: router.asPath.includes("organization"),
        childrens: [
          {
            key: "31",
            isLink: true,
            element: (
              <ActiveLink
                href="/dashboard/organization"
                activeClassName={styles.activeLink}
                passHref
              >
                <LinkButton
                  className={styles.sideLink}
                  leftIcon={<RiFileList3Line />}
                >
                  <span className={styles.sideLinkText}>Dokumen</span>
                </LinkButton>
              </ActiveLink>
            ),
          },
          {
            key: "32",
            isLink: true,
            element: (
              <ActiveLink
                href="/dashboard/organization/mission"
                activeClassName={styles.activeLink}
                passHref
              >
                <LinkButton
                  className={styles.sideLink}
                  leftIcon={<RiCheckboxMultipleLine />}
                >
                  <span className={styles.sideLinkText}>Visi &#38; Misi</span>
                </LinkButton>
              </ActiveLink>
            ),
          },
          {
            key: "33",
            isLink: true,
            element: (
              <ActiveLink
                href="/dashboard/organization/history"
                activeClassName={styles.activeLink}
                passHref
              >
                <LinkButton
                  className={styles.sideLink}
                  leftIcon={<RiBook2Line />}
                >
                  <span className={styles.sideLinkText}>Sejarah Paguyuban</span>
                </LinkButton>
              </ActiveLink>
            ),
          },
        ],
      },
      {
        key: "4",
        element: (
          <LinkButton
            className={styles.sideLink}
            colorScheme={router.asPath.includes("finance") ? "green" : ""}
          >
            Keuangan
          </LinkButton>
        ),
        isActive: router.asPath.includes("finance"),
        childrens: [
          {
            key: "41",
            isLink: true,
            element: (
              <ActiveLink
                href="/dashboard/finance"
                activeClassName={styles.activeLink}
                passHref
              >
                <LinkButton
                  className={styles.sideLink}
                  leftIcon={<RiExchangeDollarFill />}
                >
                  <span className={styles.sideLinkText}>Arus Kas</span>
                </LinkButton>
              </ActiveLink>
            ),
          },
          {
            key: "42",
            isLink: true,
            element: (
              <ActiveLink
                href="/dashboard/finance/dues"
                activeClassName={styles.activeLink}
                passHref
              >
                <LinkButton
                  className={styles.sideLink}
                  leftIcon={<RiCurrencyLine />}
                >
                  <span className={styles.sideLinkText}>Iuran Anggota</span>
                </LinkButton>
              </ActiveLink>
            ),
          },
        ],
      },
      {
        key: "5",
        isLink: true,
        element: (
          <ActiveLink
            href="/dashboard/article"
            activeClassName={styles.activeLink}
            passHref
          >
            <LinkButton
              className={styles.sideLink}
              leftIcon={<RiDoubleQuotesL />}
            >
              <span className={styles.sideLinkText}>Artikel</span>
            </LinkButton>
          </ActiveLink>
        ),
      },
      {
        key: "6",
        isLink: true,
        element: (
          <ActiveLink
            href="/dashboard/gallery"
            activeClassName={styles.activeLink}
            passHref
          >
            <LinkButton
              className={styles.sideLink}
              leftIcon={<RiGalleryLine />}
            >
              <span className={styles.sideLinkText}>Galeri</span>
            </LinkButton>
          </ActiveLink>
        ),
      },
    ];

    return links;
  }, [router.asPath]);

  const onLogout = (e: MouseEvent) => {
    e.preventDefault();
    memberLogoutMutation.mutateAsync().then(() => {
      adminQuery.refetch();
    });
  };

  return (
    <div className={styles.layoutContainer}>
      <nav className={styles.nav}>
        <Link href="/">
          <a>
            <Image
              src="/images/image/logo.png"
              width={329}
              height={42}
              alt="Website Logo"
            />
          </a>
        </Link>
        <PopUp
          popUpPosition="bottom-right"
          popUpContent={
            <ul className={styles.addBtnOptions}>
              <li>
                <Link href="/dashboard/editprofile">
                  <a className={`${styles.addBtnOption} ${styles.optionLink}`}>
                    <RiUserSettingsFill />
                    Update Profile
                  </a>
                </Link>
              </li>
              <li
                className={`${styles.addBtnOption} ${styles.danger}`}
                onClick={onLogout}
              >
                <RiLogoutBoxRLine />
                Keluar
              </li>
            </ul>
          }
        >
          <Avatar />
        </PopUp>
      </nav>
      <div className={styles.pageContainer}>
        <Aside linkList={linkList} />
        <main className={styles.main}>
          <div
            className={`${className ? className : ""} ${
              styles.contentContainer
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
