import type { HTMLAttributes } from "react";
import type { LinkTreeProps } from "./linktree";
import { useState } from "react";
import { RiMenuLine } from "react-icons/ri";
import ModalBackdrop from "../modalbackdrop";
import IconButton from "../iconbutton";
import LinkTree from "./linktree";
import styles from "./Styles.module.css";

export type { LinkTreeProps } from "./linktree";

type AsideProps = HTMLAttributes<HTMLElement> & {
  linkList: LinkTreeProps[];
};

const Aside = ({ linkList, className, ...restProps }: AsideProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const onCloseAside = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <aside
      {...restProps}
      className={`${styles.aside} ${isOpen ? styles.open : ""} ${
        className ? className : ""
      }`}
    >
      {/* <div className={styles.contentContainer}> */}
      <div className={styles.asideContent}>
        <div className={styles.btnContainer}>
          <IconButton
            aria-label="aside button"
            onClick={onCloseAside}
            className={styles.asideBtn}
          >
            <RiMenuLine />
          </IconButton>
        </div>
        <LinkTree className={styles.linkTree} childrens={linkList} />
      </div>
      <ModalBackdrop
        isOpen={isOpen}
        className={styles.backdrop}
        onClick={onCloseAside}
      />
      {/* </div> */}
    </aside>
  );
};

export default Aside;
