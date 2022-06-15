import styles from "./Styles.module.css";

const EmptyMsg = () => {
  return (
    <p className={styles.text}>
      <em>Data tidak tersedia untuk sekarang.</em>
    </p>
  );
};

export default EmptyMsg;
