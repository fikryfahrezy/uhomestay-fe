import Router from "next/router";
import { RiPrinterLine, RiArrowLeftSLine } from "react-icons/ri";
import IconButton from "@/components/iconbutton";
import Button from "@/components/button";
import { useAdmin } from "@/services/member";
import styles from "./Styles.module.css";

const PrintPage = ({ children }: JSX.IntrinsicElements["div"]) => {
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
