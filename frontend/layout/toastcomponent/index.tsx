import styles from "./Styles.module.css";

type ToastComponentProps = {
  title: string;
  message: string;
};

const ToastComponent = ({ title, message }: ToastComponentProps) => {
  return (
    <>
      <p className={styles.toastTitle}>{title}</p>
      <p className={styles.toastBody}>{message}</p>
    </>
  );
};

export default ToastComponent;
