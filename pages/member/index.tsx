import type { ReactElement } from "react";
import type { MemberDuesOut } from "@/services/member-dues";
import type { MemberDuesPayType } from "@/layouts/memberduespayform";
import { useState, useEffect, Fragment, useRef } from "react";
import { RiMore2Line } from "react-icons/ri";
import Observe from "@/lib/use-observer";
import { debounce } from "@/lib/perf";
import {
  useInfiniteMemberDuesQuery,
  DUES_STATUS,
} from "@/services/member-dues";
import { useMemberDetailQuery } from "@/services/member";
import IconButton from "cmnjg-sb/dist/iconbutton";
import Drawer from "cmnjg-sb/dist/drawer";
import Toast from "cmnjg-sb/dist/toast";
import useToast from "cmnjg-sb/dist/toast/useToast";
import MemberDuesPayForm from "@/layouts/memberduespayform";
import MemberDuesDetail from "@/layouts/memberduesdetail";
import MemberLayout from "@/layouts/memberpage";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import ToastComponent from "@/layouts/toastcomponent";
import MemberDuesListItem from "@/layouts/memberdueslistitem";
import MemberDuesAmount from "@/layouts/memberduesamount";
import MemberDuesProfile from "@/layouts/memberduesprofile";
import styles from "./Styles.module.css";

type FormType = MemberDuesPayType;

const Member = () => {
  const [muid, setMuid] = useState("");
  const [open, setOpen] = useState(false);
  const [duesStatus, setDuesStatus] = useState("");
  const [tempData, setTempData] = useState<MemberDuesOut | null>(null);
  const memberDuesQuery = useInfiniteMemberDuesQuery(muid, {
    enabled: !!muid,
    getPreviousPageParam: (firstPage) => firstPage.data.cursor || undefined,
    getNextPageParam: (lastPage) => lastPage.data.cursor || undefined,
  });
  const memberDetailQuery = useMemberDetailQuery(muid, {
    enabled: !!muid,
  });

  const { toast, updateToast, props } = useToast();
  const toastId = useRef<{ [key in FormType]: number }>({
    pay: 0,
  });

  const observeCallback = () => {
    if (memberDuesQuery.hasNextPage) {
      memberDuesQuery.fetchNextPage();
    }
  };

  const onClose = () => {
    setTempData(null);
    setOpen(false);
  };

  const onOptClick = (val: MemberDuesOut) => {
    switch (val.status) {
      case DUES_STATUS.PAID:
        setDuesStatus(DUES_STATUS.PAID);
        break;
      case DUES_STATUS.WAITING:
        setDuesStatus(DUES_STATUS.WAITING);
        break;
      default:
        setDuesStatus(DUES_STATUS.UNPAID);
    }

    setTempData(val);
    setOpen(true);
  };

  const onModified = (type: FormType, title?: string, message?: string) => {
    setTempData(null);
    setOpen(false);
    memberDuesQuery.refetch();

    updateToast(toastId.current[type], {
      status: "success",
      render: () => <ToastComponent title={title} message={message} />,
    });
  };

  const onError = (type: FormType, title?: string, message?: string) => {
    updateToast(toastId.current[type], {
      status: "error",
      render: () => (
        <ToastComponent
          title={title}
          message={message}
          data-testid="toast-modal"
        />
      ),
    });
  };

  const onLoading = (type: FormType, title?: string, __?: string) => {
    toastId.current[type] = toast({
      status: "info",
      duration: 999999,
      render: () => <ToastComponent title={title} />,
    });
  };

  useEffect(() => {
    const lmuid = window.localStorage.getItem("muid");
    if (lmuid !== null) {
      setMuid(lmuid);
    }
  }, []);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.contentHeadSection}>
          {memberDetailQuery.isLoading || memberDetailQuery.isIdle ? (
            "Loading..."
          ) : memberDetailQuery.error ? (
            <ErrMsg />
          ) : (
            <div className={styles.contentHeadPart}>
              <MemberDuesProfile member={memberDetailQuery.data.data} />
            </div>
          )}
          {memberDuesQuery.isLoading || memberDuesQuery.isIdle ? (
            "Loading..."
          ) : memberDuesQuery.error ? (
            <ErrMsg />
          ) : (
            <MemberDuesAmount
              memberDues={{
                total_dues: memberDuesQuery.data?.pages[0].data["total_dues"],
                paid_dues: memberDuesQuery.data?.pages[0].data["paid_dues"],
                unpaid_dues: memberDuesQuery.data?.pages[0].data["unpaid_dues"],
              }}
            />
          )}
        </div>
        <div className={styles.contentBodySection}>
          <h2>Daftar Iuran Bulanan</h2>
          {memberDuesQuery.isLoading || memberDuesQuery.isIdle ? (
            "Loading..."
          ) : memberDuesQuery.error ? (
            <ErrMsg />
          ) : memberDuesQuery.data?.pages[0].data.dues.length === 0 ? (
            <EmptyMsg />
          ) : (
            memberDuesQuery.data?.pages.map((page) => {
              return (
                <Fragment key={page.data.cursor}>
                  {page.data.dues.map((val) => {
                    return (
                      <MemberDuesListItem
                        key={val.id}
                        memberDues={val}
                        moreBtn={
                          <IconButton
                            className={styles.moreBtn}
                            onClick={() => onOptClick(val)}
                            data-testid="dues-detail-btn"
                          >
                            <RiMore2Line />
                          </IconButton>
                        }
                      />
                    );
                  })}
                </Fragment>
              );
            })
          )}
        </div>
      </div>
      <Observe callback={debounce(observeCallback, 500)} />
      <Drawer isOpen={open} onClose={() => onClose()}>
        {tempData !== null && duesStatus !== "" ? (
          duesStatus === DUES_STATUS.UNPAID ? (
            <MemberDuesPayForm
              prevData={tempData}
              onSubmited={(type, title, message) =>
                onModified(type, title, message)
              }
              onError={(type, title, message) => onError(type, title, message)}
              onLoading={(type, title, message) =>
                onLoading(type, title, message)
              }
            />
          ) : (
            <MemberDuesDetail prevData={tempData} />
          )
        ) : (
          <></>
        )}
      </Drawer>
      <Toast {...props} />
    </>
  );
};

Member.getLayout = function getLayout(page: ReactElement) {
  return <MemberLayout>{page}</MemberLayout>;
};

export default Member;
