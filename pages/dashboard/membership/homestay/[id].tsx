import type { ReactElement } from "react";
import { useRouter } from "next/router";
import { useMemberDetailQuery } from "@/services/member";
import AdminLayout from "@/layouts/adminpage";
import MemberHomestay from "@/layouts/memberhomestay";
import MemberDuesProfile from "@/layouts/memberduesprofile";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Homestay = () => {
  const router = useRouter();
  const { id } = router.query;

  const memberDetailQuery = useMemberDetailQuery(String(id), {
    enabled: !!id,
  });

  return (
    <>
      <div className={styles.mainContainer}>
        {memberDetailQuery.isLoading || memberDetailQuery.isIdle ? (
          "Loading..."
        ) : memberDetailQuery.error ? (
          <ErrMsg />
        ) : (
          <div className={styles.contentHeadPart}>
            <MemberDuesProfile member={memberDetailQuery.data.data} />
          </div>
        )}
      </div>
      {id ? <MemberHomestay uid={String(id)} /> : <></>}
    </>
  );
};

Homestay.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout className={styles.contentLayout}>{page}</AdminLayout>;
};

export default Homestay;
