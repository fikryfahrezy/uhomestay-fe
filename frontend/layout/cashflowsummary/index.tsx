import styles from "./Styles.module.css";

type CashflowSummaryProps = {
  total: string;
  income: string;
  outcome: string;
};

const CashflowSummary = ({ total, income, outcome }: CashflowSummaryProps) => {
  return (
    <>
      <h2 className={styles.pageTitle}>Total Uang Kas</h2>
      <p className={styles.overallCurrency}>{total}</p>
      <div className={styles.currencyFlowContainer}>
        <div>
          <h3 className={styles.currencyFlowTitle}>Total Pemasukan</h3>
          <p className={`${styles.currency} ${styles.green}`}>{income}</p>
        </div>
        <div>
          <h3 className={styles.currencyFlowTitle}>Total Pengeluaran</h3>
          <p className={`${styles.currency} ${styles.red}`}>{outcome}</p>
        </div>
      </div>
    </>
  );
};

export default CashflowSummary;
