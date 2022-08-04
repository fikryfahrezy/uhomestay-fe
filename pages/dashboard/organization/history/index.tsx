import type { ReactElement } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import { RiFileEditLine } from "react-icons/ri";
import { useFindLatestHistory } from "@/services/history";
import LinkButton from "@/components/linkbutton";
import AdminLayout from "@/layouts/adminpage";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const RichText = dynamic(() => import("@/layouts/richtext/read"));

const History = () => {
  const latestHistory = useFindLatestHistory();
  const router = useRouter();

  return (
    <>
      <Link href={`${router.pathname}/write`} passHref>
        <LinkButton
          colorScheme="green"
          leftIcon={<RiFileEditLine />}
          className={styles.addBtn}
        >
          Ubah
        </LinkButton>
      </Link>
      <h1 className={styles.pageTitle}>Sejarah</h1>
      {latestHistory.isLoading ? (
        "Loading..."
      ) : latestHistory.error ? (
        <ErrMsg />
      ) : (
        <RichText
          editorStateJSON={
            latestHistory.data ? latestHistory.data.data.content : null
          }
        />
      )}
    </>
  );
};

History.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default History;
