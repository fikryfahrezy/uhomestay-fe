import Image from "next/image";
import styles from "./Styles.module.css";

type MemberItemProps = {
  moreBtn?: JSX.Element;
  name: string;
  profilePicUrl: string;
  badge: JSX.Element;
};

const MemberItem = ({
  moreBtn,
  badge,
  name = "",
  profilePicUrl = "",
}: MemberItemProps) => {
  return (
    <div className={styles.memberItem}>
      <div className={styles.profileContainer}>
        <div className={styles.profileImgContainer}>
          <Image
            src={profilePicUrl ? profilePicUrl : "/images/image/person.png"}
            layout="responsive"
            width={150}
            height={150}
            alt="Member Profile Picture"
          />
        </div>
        <div className={styles.profileBody}>
          {badge ? badge : <></>}
          <p className={styles.memberName}>{name}</p>
        </div>
      </div>
      {moreBtn ? moreBtn : <></>}
    </div>
  );
};

export default MemberItem;
