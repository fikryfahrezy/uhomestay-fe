import type { LinkProps } from "next/link";
import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";
import styles from "./Styles.module.css";

type MoreLinkProps = LinkProps & {
  children: string | JSX.Element;
};

const MoreLink = ({ children, ...restProps }: MoreLinkProps) => {
  return (
    <Link {...restProps}>
      <a className={styles.moreLink}>
        {children} <RiArrowRightLine />
      </a>
    </Link>
  );
};

export default MoreLink;
