import type { MemberHomestaysRes } from "@/services/member-homestay";
import { useState } from "react";
import { useRouter } from "next/router";
import { useMemberDetailQuery } from "@/services/member";
import MemberDuesProfile from "@/layouts/memberduesprofile";
import ErrMsg from "@/layouts/errmsg";
import MemberHomestayList from "@/layouts/memberhomestaylist";
import PageNav from "@/layouts/pagenav";
import HomestayViewModal from "@/layouts/homestayviewonlymodal";
import styles from "./Styles.module.css";

const Homestay = () => {
  const router = useRouter();
  const { id } = router.query;

  const [isOpen, setOpen] = useState(false);
  const [prevData, setPrevData] = useState<
    (MemberHomestaysRes & { uid: string }) | null
  >(null);
  const memberDetailQuery = useMemberDetailQuery(String(id), {
    enabled: !!id,
  });

  const onOpen = (uid: string, val: MemberHomestaysRes) => {
    setOpen(true);
    setPrevData({ ...val, uid });
  };

  const onClose = () => {
    setOpen(false);
    setPrevData(null);
  };

  return (
    <>
      <PageNav />
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
      <MemberHomestayList
        uid={String(id)}
        onClick={(val) => onOpen(String(id), val)}
      />
      {isOpen && prevData !== null ? (
        <HomestayViewModal
          isOpen={isOpen}
          prevData={prevData}
          onCancel={() => onClose()}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Homestay;
