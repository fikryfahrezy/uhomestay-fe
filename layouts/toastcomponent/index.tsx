import styles from "./Styles.module.css";

type ToastComponentProps = JSX.IntrinsicElements["p"] & {
  title?: string;
  message?: string;
};

const ToastComponent = ({
  title,
  message,
  ...restProps
}: ToastComponentProps) => {
  return (
    <>
      <p className={styles.toastTitle} {...restProps}>
        {title}
      </p>
      <p className={styles.toastBody}>{message}</p>
    </>
  );
};

export default ToastComponent;
