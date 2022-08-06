import type { ReactElement } from "react";
import type { MemberDuesOut } from "@/services/member-dues";
import type { MemberDuesEditFormType } from "@/layouts/memberdueseditform";
import { useState, Fragment, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { RiMore2Line, RiPrinterLine } from "react-icons/ri";
import Observe from "@/lib/use-observer";
import { debounce } from "@/lib/perf";
import { useMemberDetailQuery } from "@/services/member";
import { useInfiniteMemberDuesQuery } from "@/services/member-dues";
import IconButton from "@/components/iconbutton";
import Drawer from "@/components/drawer";
import Toast, { useToast } from "@/components/toast";
import LinkButton from "@/components/linkbutton";
import AdminLayout from "@/layouts/adminpage";
import MemberDuesEditForm from "@/layouts/memberdueseditform";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import ToastComponent from "@/layouts/toastcomponent";
import MemberDuesListItem from "@/layouts/memberdueslistitem";
import MemberDuesAmount from "@/layouts/memberduesamount";
import MemberDuesProfile from "@/layouts/memberduesprofile";
import styles from "./Styles.module.css";

type FormType = MemberDuesEditFormType;

const MemberDues = () => {
  const router = useRouter();
  const { id } = router.query;

  const [open, setOpen] = useState(false);
  const [tempData, setTempData] = useState<MemberDuesOut | null>(null);
  const memberDuesQuery = useInfiniteMemberDuesQuery(String(id), {
    enabled: !!id,
    getPreviousPageParam: (firstPage) => firstPage.data.cursor || undefined,
    getNextPageParam: (lastPage) => lastPage.data.cursor || undefined,
  });
  const memberDetailQuery = useMemberDetailQuery(String(id), {
    enabled: !!id,
  });

  const { toast, updateToast, props } = useToast();
  const toastId = useRef<{ [key in FormType]: number }>({
    approve: 0,
    edit: 0,
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

  return (
    <>
      <div className={styles.contentHeadSection}>
        {memberDetailQuery.isLoading || memberDetailQuery.isIdle ? (
          "Loading..."
        ) : memberDetailQuery.error ? (
          <ErrMsg />
        ) : (
          <div className={styles.contentHeadPart}>
            <Link
              href={{
                pathname: `./print/[id]`,
                query: { id },
              }}
              passHref
            >
              <LinkButton
                leftIcon={<RiPrinterLine />}
                className={styles.printBtn}
              >
                Cetak
              </LinkButton>
            </Link>
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
          <>
            <h3>
              Jumlah Total Iuran:{" "}
              {memberDuesQuery.data?.pages[0].data["total"] || "0"} iuran
            </h3>
            {memberDuesQuery.data?.pages.map((page) => {
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
                            data-testid="member-dues-item-btn"
                          >
                            <RiMore2Line />
                          </IconButton>
                        }
                      />
                    );
                  })}
                </Fragment>
              );
            })}
          </>
        )}
      </div>
      <Observe callback={debounce(observeCallback, 500)} />
      <Drawer
        isOpen={open}
        onClose={() => onClose()}
        data-testid="member-dues-drawer"
      >
        {open && tempData !== null ? (
          <MemberDuesEditForm
            prevData={tempData}
            onCancel={() => onClose()}
            onSubmited={(type, title, message) =>
              onModified(type, title, message)
            }
            onError={(type, title, message) => onError(type, title, message)}
            onLoading={(type, title, message) =>
              onLoading(type, title, message)
            }
          />
        ) : (
          <></>
        )}
      </Drawer>
      <Toast {...props} />
    </>
  );
};

MemberDues.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout className={styles.contentLayout}>{page}</AdminLayout>;
};

export default MemberDues;
