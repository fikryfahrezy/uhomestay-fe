import type { MouseEvent } from "react";
import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  RiLogoutBoxRLine,
  RiExchangeDollarLine,
  RiUserSettingsFill,
} from "react-icons/ri";
import { useMember, memberLogout } from "@/services/member";
import { Avatar, Popup, LinkBox, LinkOverlay } from "cmnjg-sb";
import styles from "./Styles.module.css";

const MemberPage = ({ children, className }: JSX.IntrinsicElements["div"]) => {
  const router = useRouter();
  const memberQuery = useMember({
    redirectTo: "/login/member",
  });

  const linkList = useMemo(() => {
    const links = [
      {
        id: "1",
        href: "/member",
        icon: <RiExchangeDollarLine />,
        children: <>Iuran</>,
      },
    ];

    return links;
  }, []);

  const bottomNavBlockList = ["editprofile"];

  const onLogout = (e: MouseEvent) => {
    e.preventDefault();
    memberLogout().then(() => {
      memberQuery.refetch();
      router.push("/login/member");
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
              alt="Test"
            />
          </a>
        </Link>
        <Popup
          popUpPosition="bottom-right"
          popUpContent={
            <ul className={styles.addBtnOptions}>
              <li>
                <Link href="/member/editprofile">
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
        </Popup>
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
                    <span className={styles.iconContainer}>{icon}</span>
                    {children}
                    <Link href={href} passHref>
                      <LinkOverlay />
                    </Link>
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
