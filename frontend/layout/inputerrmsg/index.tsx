import styles from "./Styles.module.css";

const InputErrMsg = ({ children }: JSX.IntrinsicElements["span"]) => {
  return <span className={styles.errorMsg}>{children}</span>;
};

export default InputErrMsg;
