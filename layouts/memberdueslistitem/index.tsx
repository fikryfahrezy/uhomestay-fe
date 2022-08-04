import type { MemberDuesOut } from "@/services/member-dues";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import Badge from "@/components/badge";
import { idrCurrency } from "@/lib/fmt";
import { DUES_STATUS } from "@/services/member-dues";
import styles from "./Styles.module.css";

type MemberDuesListItemProps = {
  memberDues: MemberDuesOut;
  moreBtn: JSX.Element;
};
/**
 *
 * @returns
 */

const MemberDuesListItem = ({
  memberDues,
  moreBtn,
}: MemberDuesListItemProps) => {
  const { date, id, status, pay_date: payDate, idr_amount: idr } = memberDues;
  const { badge, color } = (() => {
    switch (status) {
      case DUES_STATUS.PAID:
        return {
          badge: <Badge colorScheme="green">Sudah Lunas</Badge>,
          color: styles.green,
        };
      case DUES_STATUS.WAITING:
        return {
          badge: <Badge colorScheme="yellow">Menunggu Konfirmasi</Badge>,
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
          <p className={styles.listTextLabel}>Tanggal iuran:</p>
          <p className={styles.listTextContent}>{date}</p>
          <p className={styles.listTextLabel}>Tanggal Bayar:</p>
          <p className={styles.listTextContent}>{payDate}</p>
        </div>
        <span className={`${styles.listCurrency} ${color}`}>
          {idrCurrency.format(Number(idr))}
        </span>
      </div>
      {moreBtn}
    </div>
  );
};

export default MemberDuesListItem;
