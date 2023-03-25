import type { MouseEvent } from "react";
import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import Image from "next/legacy/image";
import {
  RiLogoutBoxRLine,
  RiExchangeDollarLine,
  RiUserSettingsFill,
  RiHomeSmileLine,
} from "react-icons/ri";
import { useMember, memberLogout } from "@/services/member";
import { Avatar, PopUp, LinkBox, LinkOverlay } from "cmnjg-sb";
import ActiveLink from "@/layouts/activelink";
import styles from "./Styles.module.css";

const MemberPage = ({ children, className }: JSX.IntrinsicElements["div"]) => {
  const router = useRouter();
  const memberQuery = useMember({
    redirectTo: "/login/member",
  });

  const memberLogoutMutation = useMutation(() => {
    return memberLogout();
  });

  const linkList = useMemo(() => {
    const links = [
      {
        id: "1",
        href: "/member",
        icon: <RiExchangeDollarLine />,
        children: <>Iuran</>,
      },
      {
        id: "2",
        href: "/member/homestay",
        icon: <RiHomeSmileLine />,
        children: <>Homestay</>,
      },
    ];

    return links;
  }, []);

  const bottomNavBlockList = ["editprofile"];

  const onLogout = (e: MouseEvent) => {
    e.preventDefault();
    memberLogoutMutation.mutateAsync().then(() => {
      memberQuery.refetch();
    });
  };

  return (
    <div className={styles.layoutContainer}>
      <nav className={styles.nav}>
        <Link href="/">
          <Image
            src="/images/image/logo.png"
            width={329}
            height={42}
            alt="Website Logo"
          />
        </Link>
        <PopUp
          popUpPosition="bottom-right"
          popUpContent={
            <ul className={styles.addBtnOptions}>
              <li>
                <Link
                  href="/member/editprofile"
                  className={`${styles.addBtnOption} ${styles.optionLink}`}
                >
                  <RiUserSettingsFill />
                  Update Profile
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
        <main className={`${className ? className : ""} ${styles.main}`}>
          {children}
        </main>
      </div>
      {bottomNavBlockList.some((blockList) => {
        return router.asPath.includes(blockList);
      }) ? (
        <></>
      ) : (
        <div className={styles.bottomContainer}>
          <div className={styles.bottomSection}>
            {linkList.map(({ id, children, href, icon }) => {
              return (
                <LinkBox key={id} className={styles.buttonNavLink}>
                  <button className={styles.buttonNav}>
                    <ActiveLink
                      href={href}
                      activeClassName={styles.activeLink}
                      passHref
                    >
                      <LinkOverlay />
                    </ActiveLink>
                    <span className={styles.iconContainer}>{icon}</span>
                    <span>{children}</span>
                  </button>
                </LinkBox>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberPage;
