import type { DetailedHTMLProps, HTMLAttributes } from "react";
import Router from "next/router";
import { RiPrinterLine, RiArrowLeftSLine } from "react-icons/ri";
import IconButton from "@/components/iconbutton";
import Button from "@/components/button";
import { useAdmin } from "@/services/member";
import styles from "./Styles.module.css";

type LayoutProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const PrintPage = ({ children }: LayoutProps) => {
  useAdmin({
    redirectTo: "/login/admin",
  });

  const onBack = () => {
    Router.back();
  };

  const onPrint = () => {
    window.print();
  };

  return (
    <>
      <nav className={styles.nav}>
        <IconButton onClick={() => onBack()}>
          <RiArrowLeftSLine />
        </IconButton>
        <Button
          leftIcon={<RiPrinterLine />}
          className={styles.printBtn}
          onClick={() => onPrint()}
        >
          Cetak
        </Button>
      </nav>
      <main className={styles.main}>{children}</main>
    </>
  );
};

export default PrintPage;
