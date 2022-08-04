import type { MembersDuesOut } from "@/services/member-dues";
import Image from "next/image";
import { DUES_STATUS } from "@/services/member-dues";
import Badge from "@/components/badge";
import styles from "./Styles.module.css";

type MemberDuesItemProps = {
  moreBtn?: JSX.Element;
  member: MembersDuesOut;
};

const MemberDuesItem = ({ moreBtn, member }: MemberDuesItemProps) => {
  const { name, status, pay_date: payDate, profile_pic_url: profile } = member;
  const badge = (() => {
    switch (status) {
      case DUES_STATUS.PAID:
        return <Badge colorScheme="green">Sudah Lunas</Badge>;
      case DUES_STATUS.WAITING:
        return <Badge colorScheme="yellow">Menunggu Konfirmasi</Badge>;
      default:
        return <Badge colorScheme="red">Belum Lunas</Badge>;
    }
  })();

  return (
    <div className={styles.memberItem}>
      <div className={styles.profileContainer}>
        <div className={styles.profileImgContainer}>
          <Image
            src={profile ? profile : "/images/image/person.png"}
            layout="responsive"
            width={150}
            height={150}
            alt="Member Profile Picture"
          />
        </div>
        <div className={styles.profileBody}>
          {badge ? badge : <></>}
          <p className={styles.listTextLabel}>Nama Anggota:</p>
          <p className={styles.listTextContent}>{name}</p>
          <p className={styles.listTextLabel}>Tanggal Bayar:</p>
          <p className={styles.listTextContent}>{payDate}</p>
        </div>
      </div>
      {moreBtn ? moreBtn : <></>}
    </div>
  );
};

export default MemberDuesItem;
