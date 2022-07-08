import type { ReactElement } from "react";
import type { MemberDuesOut } from "@/services/member-dues";
import type { MemberDuesPayType } from "@/layouts/memberduespayform";
import { useState, useEffect, Fragment, useRef } from "react";
import Image from "next/image";
import { RiMoneyDollarCircleLine, RiMore2Line } from "react-icons/ri";
import Observe from "@/lib/use-observer";
import { debounce } from "@/lib/perf";
import { idrCurrency } from "@/lib/fmt";
import { useMemberDuesQuery, DUES_STATUS } from "@/services/member-dues";
import { useMemberDetailQuery } from "@/services/member";
import IconButton from "cmnjg-sb/dist/iconbutton";
import Drawer from "cmnjg-sb/dist/drawer";
import Badge from "cmnjg-sb/dist/badge";
import Toast from "cmnjg-sb/dist/toast";
import useToast from "cmnjg-sb/dist/toast/useToast";
import MemberDuesPayForm from "@/layouts/memberduespayform";
import MemberDuesDetail from "@/layouts/memberduesdetail";
import MemberLayout from "@/layouts/memberpage";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import ToastComponent from "@/layouts/toastcomponent";
import styles from "./Styles.module.css";

type FormType = MemberDuesPayType;

const Member = () => {
  const [muid, setMuid] = useState("");
  const [open, setOpen] = useState(false);
  const [duesStatus, setDuesStatus] = useState("");
  const [tempData, setTempData] = useState<MemberDuesOut | null>(null);
  const memberDuesQuery = useMemberDuesQuery(muid, {
    enabled: !!muid,
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

  const onModiefied = () => {
    setTempData(null);
    setOpen(false);
    memberDuesQuery.refetch();
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
              <table className={styles.profileData}>
                <tbody>
                  <tr>
                    <td>Nomor WA</td>
                    <td>:</td>
                    <td>{memberDetailQuery.data.data["wa_phone"]}</td>
                  </tr>
                  <tr>
                    <td>Nomor Lainnya</td>
                    <td>:</td>
                    <td>{memberDetailQuery.data.data["other_phone"]}</td>
                  </tr>
                  <tr>
                    <td>Jabatan</td>
                    <td>:</td>
                    <td>{memberDetailQuery.data.data.position}</td>
                  </tr>
                  <tr>
                    <td>Periode</td>
                    <td>:</td>
                    <td>{memberDetailQuery.data.data.period}</td>
                  </tr>
                  <tr>
                    <td>Nama Homestay</td>
                    <td>:</td>
                    <td>{memberDetailQuery.data.data["homestay_name"]}</td>
                  </tr>
                  <tr>
                    <td>Alamat Homestay</td>
                    <td>:</td>
                    <td>{memberDetailQuery.data.data["homestay_address"]}</td>
                  </tr>
                </tbody>
              </table>
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
                            badge: (
                              <Badge colorScheme="green">Sudah Lunas</Badge>
                            ),
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
                          data-testid="dues-detail-btn"
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
      </div>
      <Observe callback={debounce(observeCallback, 500)} />
      <Drawer isOpen={open} onClose={() => onClose()}>
        {tempData !== null && duesStatus !== "" ? (
          duesStatus === DUES_STATUS.UNPAID ? (
            <MemberDuesPayForm
              prevData={tempData}
              onEdited={() => onModiefied()}
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
