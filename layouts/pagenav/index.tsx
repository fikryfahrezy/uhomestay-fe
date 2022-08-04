import Image from "next/image";
import Link from "next/link";
import { LinkBox, LinkOverlay } from "@/components/linkoverlay";
import styles from "./Styles.module.css";

const PageNav = ({ className }: JSX.IntrinsicElements["div"]) => {
  return (
    <div className={`${styles.logoContainer} ${className ? className : ""}`}>
      <LinkBox>
        <Image
          src="/images/image/logo.png"
          width={329}
          height={42}
          alt="Website Logo"
        />
        <Link href="/" passHref>
          <LinkOverlay />
        </Link>
      </LinkBox>
    </div>
  );
};

export default PageNav;
