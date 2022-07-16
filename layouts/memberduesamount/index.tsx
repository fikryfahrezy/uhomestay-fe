import type { MemberDuesRes } from "@/services/member-dues";
import { idrCurrency } from "@/lib/fmt";
import styles from "./Styles.module.css";

type MemberDuesAmtProps = {
  memberDues: Pick<MemberDuesRes, "total_dues" | "paid_dues" | "unpaid_dues">;
};
/**
 *
 * @returns
 */

const MemberDuesListItem = ({ memberDues }: MemberDuesAmtProps) => {
  const {
    total_dues: totalDues,
    paid_dues: paidDues,
    unpaid_dues: unpaidDues,
  } = memberDues;
  return (
    <div className={styles.contentHeadPart}>
      <h2 className={styles.subHeadTitle}>Total Uang Iuran</h2>
      <p className={styles.overallCurrency}>
        {idrCurrency.format(Number(totalDues))}
      </p>
      <div className={styles.currencyFlowContainer}>
        <div>
          <h3 className={styles.currencyFlowTitle}>Total Terbayar</h3>
          <p className={`${styles.currency} ${styles.green}`}>
            {idrCurrency.format(Number(paidDues))}
          </p>
        </div>
        <div>
          <h3 className={styles.currencyFlowTitle}>Total Belum Terbayar</h3>
          <p className={`${styles.currency} ${styles.red}`}>
            {idrCurrency.format(Number(unpaidDues))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberDuesListItem;
