import styles from "./Styles.module.css";

type BadgeListProps = JSX.IntrinsicElements["p"] & {
  moreBtn?: JSX.Element;
  icon?: JSX.Element;
  badge?: JSX.Element;
};

const BadgeList = ({ badge, icon, moreBtn, children }: BadgeListProps) => {
  return (
    <div className={styles.listItem}>
      {icon ? <span className={styles.listIcon}>{icon}</span> : <></>}
      <div className={styles.listBody}>
        {badge ? badge : <></>}
        <p className={styles.listText}>{children}</p>
      </div>
      {moreBtn ? moreBtn : <></>}
    </div>
  );
};

export default BadgeList;
