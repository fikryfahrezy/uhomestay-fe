import styles from "./Styles.module.css";

const EmptyMsg = () => {
  return (
    <p className={styles.text}>
      <em>Tidak ada data untuk sekarang, data kosong...</em>
    </p>
  );
};

export default EmptyMsg;
