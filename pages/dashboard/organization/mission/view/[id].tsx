import type { ReactElement } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { RiFileEditLine } from "react-icons/ri";
import { useFindPeriodGoal } from "@/services/period";
import LinkButton from "@/components/linkbutton";
import AdminLayout from "@/layouts/adminpage";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const RichText = dynamic(() => import("@/layouts/richtext/read"));

const ViewMission = () => {
  const router = useRouter();
  const { id } = router.query;
  const periodGoal = useFindPeriodGoal(Number(id), {
    enabled: !!id,
  });

  return (
    <>
      <Link
        href={{
          pathname: `${router.pathname}/../../create/[id]`,
          query: { id },
        }}
        passHref
      >
        <LinkButton
          colorScheme="green"
          leftIcon={<RiFileEditLine />}
          className={styles.addBtn}
          data-testid="mission-edit-btn"
        >
          Ubah
        </LinkButton>
      </Link>
      <h2 className={styles.pageTitle}>Visi</h2>
      {periodGoal.isIdle || periodGoal.isLoading ? (
        "Loading..."
      ) : periodGoal.error ? (
        <ErrMsg />
      ) : (
        <RichText editorStateJSON={periodGoal.data.data.vision} />
      )}
      <h2 className={styles.pageTitle}>Misi</h2>
      {periodGoal.isIdle || periodGoal.isLoading ? (
        "Loading..."
      ) : periodGoal.error ? (
        <ErrMsg />
      ) : (
        <RichText editorStateJSON={periodGoal.data.data.mission} />
      )}
    </>
  );
};

ViewMission.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ViewMission;
