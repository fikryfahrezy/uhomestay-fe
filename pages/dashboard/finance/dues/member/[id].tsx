import type { ReactElement } from "react";
import type { MemberDuesOut } from "@/services/member-dues";
import type { MemberDuesEditFormType } from "@/layouts/memberdueseditform";
import { useState, Fragment, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  RiMoneyDollarCircleLine,
  RiMore2Line,
  RiPrinterLine,
} from "react-icons/ri";
import Observe from "@/lib/use-observer";
import { debounce } from "@/lib/perf";
import { idrCurrency } from "@/lib/fmt";
import { useMemberDetailQuery } from "@/services/member";
import {
  useInfiniteMemberDuesQuery,
  DUES_STATUS,
} from "@/services/member-dues";
import IconButton from "cmnjg-sb/dist/iconbutton";
import Drawer from "cmnjg-sb/dist/drawer";
import Badge from "cmnjg-sb/dist/badge";
import Toast from "cmnjg-sb/dist/toast";
import useToast from "cmnjg-sb/dist/toast/useToast";
import LinkButton from "cmnjg-sb/dist/linkbutton";
import AdminLayout from "@/layouts/adminpage";
import MemberDuesEditForm from "@/layouts/memberdueseditform";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import ToastComponent from "@/layouts/toastcomponent";
import ProfileTable from "@/layouts/profiletable";
import styles from "./Styles.module.css";

type FormType = MemberDuesEditFormType;

const MemberDues = () => {
  const router = useRouter();
  const { id } = router.query;

  const [open, setOpen] = useState(false);
  const [tempData, setTempData] = useState<MemberDuesOut | null>(null);
  const memberDuesQuery = useInfiniteMemberDuesQuery(id as string, {
    enabled: !!id,
    getPreviousPageParam: (firstPage) => firstPage.data.cursor || undefined,
    getNextPageParam: (lastPage) => lastPage.data.cursor || undefined,
  });
  const memberDetailQuery = useMemberDetailQuery(id as string, {
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
            <div className={styles.profileContainer}>
              <div className={styles.profileImgContainer}>
                <Image
                  src={
                    memberDetailQuery.data.data["profile_pic_url"]
                      ? memberDetailQuery.data.data["profile_pic_url"]
                      : "/images/image/person.png"
                  }
                  layout="responsive"
                  width={150}
                  height={150}
                  alt="Member profile pic"
                />
              </div>
              <h2 className={styles.profileName}>
                {memberDetailQuery.data.data.name}
              </h2>
            </div>
			<ProfileTable data={memberDetailQuery.data.data} />
          </div>
        )}
        {memberDuesQuery.isLoading || memberDuesQuery.isIdle ? (
          "Loading..."
        ) : memberDuesQuery.error ? (
          <ErrMsg />
        ) : (
          <div className={styles.contentHeadPart}>
            <h2 className={styles.subHeadTitle}>Total Uang Iuran</h2>
            <p className={styles.overallCurrency}>
              {idrCurrency.format(
                Number(memberDuesQuery.data?.pages[0].data["total_dues"])
              )}
            </p>
            <div className={styles.currencyFlowContainer}>
              <div>
                <h3 className={styles.currencyFlowTitle}>Total Terbayar</h3>
                <p className={`${styles.currency} ${styles.green}`}>
                  {idrCurrency.format(
                    Number(memberDuesQuery.data?.pages[0].data["paid_dues"])
                  )}
                </p>
              </div>
              <div>
                <h3 className={styles.currencyFlowTitle}>
                  Total Belum Terbayar
                </h3>
                <p className={`${styles.currency} ${styles.red}`}>
                  {idrCurrency.format(
                    Number(memberDuesQuery.data?.pages[0].data["unpaid_dues"])
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.contentBodySection}>
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
                  const { date, id, idr_amount: idr, status } = val;
                  const { badge, color } = (() => {
                    switch (status) {
                      case DUES_STATUS.PAID:
                        return {
                          badge: <Badge colorScheme="green">Sudah Lunas</Badge>,
                          color: styles.green,
                        };
                      case DUES_STATUS.WAITING:
                        return {
                          badge: (
                            <Badge colorScheme="yellow">
                              Menunggu Konfirmasi
                            </Badge>
                          ),
                          color: styles.yellow,
                        };
                      default:
                        return {
                          badge: <Badge colorScheme="red">Belum Lunas</Badge>,
                          color: styles.red,
                        };
                    }
                  })();

                  return (
                    <div key={id} className={styles.listItem}>
                      <span className={styles.listIcon}>
                        <RiMoneyDollarCircleLine />
                      </span>
                      <div className={styles.listContent}>
                        <div className={styles.listBody}>
                          {badge}
                          <p className={styles.listText}>{date}</p>
                        </div>
                        <span className={`${styles.listCurrency} ${color}`}>
                          {idrCurrency.format(Number(idr))}
                        </span>
                      </div>
                      <IconButton
                        className={styles.moreBtn}
                        onClick={() => onOptClick(val)}
                        data-testid="member-dues-item-btn"
                      >
                        <RiMore2Line />
                      </IconButton>
                    </div>
                  );
                })}
              </Fragment>
            );
          })
        )}
      </div>
      <Observe callback={debounce(observeCallback, 500)} />
      <Drawer
        isOpen={open}
        onClose={() => onClose()}
        data-testid="member-dues-drawer"
      >
        {tempData !== null ? (
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
