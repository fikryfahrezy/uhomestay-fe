import { cloneElement } from "react";
import styles from "./Styles.module.css";

type CardProps = JSX.IntrinsicElements["div"] & {
  cardTitle: string | JSX.Element;
  date: string;
  description: string;
  bannerElement?: JSX.Element;
};

const Card = ({
  cardTitle,
  date,
  description,
  bannerElement,
  className,
}: CardProps) => (
  <div className={styles.cardContainer}>
    <div className={`${styles.cardContent} ${className ? className : ""}`}>
      <div className={styles.bannerContainer}>
        {bannerElement ? (
          cloneElement(bannerElement, { className: styles.bannerImg }, null)
        ) : (
          <></>
        )}
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.bannerTitle}>{cardTitle}</h3>
        <p className={styles.bannerDate}>{date}</p>
        <p className={styles.bannerDescription}>{description}</p>
      </div>
    </div>
  </div>
);

export default Card;
