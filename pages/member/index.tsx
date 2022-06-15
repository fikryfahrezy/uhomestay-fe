import type { ReactElement } from "react";
import type { MemberDuesOut } from "@/services/member-dues";
import { useState, useEffect } from "react";
import Image from "next/image";
import { RiMoneyDollarCircleLine, RiMore2Line } from "react-icons/ri";
import { idrCurrency } from "@/lib/fmt";
import { useMemberDuesQuery, DUES_STATUS } from "@/services/member-dues";
import { useMemberDetailQuery } from "@/services/member";
import IconButton from "@/components/iconbutton";
import Drawer from "@/components/drawer";
import Badge from "@/components/badge";
import MemberDuesPayForm from "@/layout/memberduespayform";
import MemberDuesDetail from "@/layout/memberduesdetail";
import MemberLayout from "@/layout/memberpage";
import EmptyMsg from "@/layout/emptymsg";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

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

  const { data: m } = memberDetailQuery;
  const memberData = m ? m.data : {};

  const { data: md } = memberDuesQuery;
  const memberDues = md ? md.data : {};

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
                      //   memberData["profile_pic_url"]
                      //     ? memberData["profile_pic_url"]
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
                {/* <h2 className={styles.profileName}>{memberData.name}</h2> */}
                <h2 className={styles.profileName}>
                  {memberDetailQuery.data.data.name}
                </h2>
              </div>
              <table className={styles.profileData}>
                <tbody>
                  <tr>
                    <td>Nomor WA</td>
                    <td>:</td>
                    {/* <td>{memberData["wa_phone"]}</td> */}
                    <td>{memberDetailQuery.data.data["wa_phone"]}</td>
                  </tr>
                  <tr>
                    <td>Nomor Lainnya</td>
                    <td>:</td>
                    {/* <td>{memberData["other_phone"]}</td> */}
                    <td>{memberDetailQuery.data.data["other_phone"]}</td>
                  </tr>
                  <tr>
                    <td>Jabatan</td>
                    <td>:</td>
                    {/* <td>{memberData.position}</td> */}
                    <td>{memberDetailQuery.data.data.position}</td>
                  </tr>
                  <tr>
                    <td>Periode</td>
                    <td>:</td>
                    {/* <td>{memberData.period.split("|").join(" - ")}</td> */}
                    <td>
                      {memberDetailQuery.data.data.period
                        .split("|")
                        .join(" - ")}
                    </td>
                  </tr>
                  <tr>
                    <td>Nama Homestay</td>
                    <td>:</td>
                    {/* <td>{memberData["homestay_name"]}</td> */}
                    <td>{memberDetailQuery.data.data["homestay_name"]}</td>
                  </tr>
                  <tr>
                    <td>Alamat Homestay</td>
                    <td>:</td>
                    {/* <td>{memberData["homestay_address"]}</td> */}
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
                {/* {idrCurrency.format(memberDues["total_dues"])} */}
                {idrCurrency.format(
                  Number(memberDuesQuery.data.data["total_dues"])
                )}
              </p>
              <div className={styles.currencyFlowContainer}>
                <div>
                  <h3 className={styles.currencyFlowTitle}>Total Terbayar</h3>
                  <p className={`${styles.currency} ${styles.green}`}>
                    {/* {idrCurrency.format(memberDues["paid_dues"])} */}
                    {idrCurrency.format(
                      Number(memberDuesQuery.data.data["paid_dues"])
                    )}
                  </p>
                </div>
                <div>
                  <h3 className={styles.currencyFlowTitle}>
                    Total Belum Terbayar
                  </h3>
                  <p className={`${styles.currency} ${styles.red}`}>
                    {/* {idrCurrency.format(memberDues["unpaid_dues"])} */}
                    {idrCurrency.format(
                      Number(memberDuesQuery.data.data["unpaid_dues"])
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
          ) : memberDuesQuery.data.data.dues?.length === 0 ? (
            <EmptyMsg />
          ) : (
            memberDuesQuery.data.data.dues?.map((val) => {
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
                        <Badge colorScheme="yellow">Menunggu Konfirmasi</Badge>
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
                      {/* {idrCurrency.format(idr)} */}
                      {idrCurrency.format(Number(idr))}
                    </span>
                  </div>
                  <IconButton
                    className={styles.moreBtn}
                    onClick={() => onOptClick(val)}
                  >
                    <RiMore2Line />
                  </IconButton>
                </div>
              );
            })
          )}
        </div>
      </div>
      <Drawer isOpen={open} onClose={() => onClose()}>
        {tempData !== null && duesStatus !== "" ? (
          duesStatus === DUES_STATUS.UNPAID ? (
            <MemberDuesPayForm
              prevData={tempData}
              onEdited={() => onModiefied()}
            />
          ) : (
            <MemberDuesDetail prevData={tempData} />
          )
        ) : (
          <></>
        )}
      </Drawer>
    </>
  );
};

Member.getLayout = function getLayout(page: ReactElement) {
  return <MemberLayout>{page}</MemberLayout>;
};

export default Member;
