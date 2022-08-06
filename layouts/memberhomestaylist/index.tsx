import type { MemberHomestaysRes } from "@/services/member-homestay";
import { Fragment } from "react";
import Observe from "@/lib/use-observer";
import { debounce } from "@/lib/perf";
import { useHomestaysQuery } from "@/services/member-homestay";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import HomestayItem from "@/layouts/homestayitem";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type MemberHomestayProps = {
  uid: string;
  onClick?: (val: MemberHomestaysRes) => void;
  addButton?: JSX.Element;
};
const MemberHomestay = ({
  uid,
  onClick = defaultFunc,
  addButton,
}: MemberHomestayProps) => {
  const memberHomestaysQuery = useHomestaysQuery(uid, {
    enabled: !!uid,
    getPreviousPageParam: (firstPage) => firstPage.data.cursor || undefined,
    getNextPageParam: (lastPage) => lastPage.data.cursor || undefined,
  });

  const observeCallback = () => {
    if (memberHomestaysQuery.hasNextPage) {
      memberHomestaysQuery.fetchNextPage();
    }
  };

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.contentHeadSection}>
          <div>
            <h2>Daftar Homestay</h2>
            <h3>
              Jumlah Total Homestay:{" "}
              {memberHomestaysQuery.data?.pages[0].data["total"] || "0"}{" "}
              homestay
            </h3>
          </div>
          {addButton ? <div>{addButton}</div> : <></>}
        </div>
        {memberHomestaysQuery.isLoading || memberHomestaysQuery.isIdle ? (
          "Loading..."
        ) : memberHomestaysQuery.error ? (
          <ErrMsg />
        ) : memberHomestaysQuery.data?.pages[0].data["member_homestays"]
            .length === 0 ? (
          <EmptyMsg />
        ) : (
          <div className={styles.contentContainer}>
            {memberHomestaysQuery.data?.pages.map((page) => {
              return (
                <Fragment key={page.data.cursor}>
                  {page.data["member_homestays"].map((val) => {
                    return (
                      <div key={val.id} className={styles.cardWrapper}>
                        <HomestayItem
                          homestayData={val}
                          onClick={() => onClick(val)}
                        />
                      </div>
                    );
                  })}
                </Fragment>
              );
            })}
          </div>
        )}
      </div>
      <Observe callback={debounce(observeCallback, 500)} />
    </>
  );
};

export default MemberHomestay;
