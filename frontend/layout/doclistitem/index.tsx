import type { DocumentOut } from "@/services/document";
import { RiFolderFill, RiFileFill } from "react-icons/ri";
import { DOC_TYPE } from "@/services/document";
import styles from "./Styles.module.css";

type DocListItemProps = {
  document: DocumentOut;
  moreBtn?: JSX.Element;
};

const DocListItem = ({ moreBtn, document }: DocListItemProps) => {
  const icon = (() => {
    switch (document.type) {
      case DOC_TYPE.DIR:
        return <RiFolderFill />;
      default:
        return <RiFileFill />;
    }
  })();

  return (
    <div className={styles.documentItem}>
      <span className={styles.documentIcon}>{icon}</span>
      <p className={styles.documentName}>{document.name}</p>
      {moreBtn ? moreBtn : <></>}
    </div>
  );
};

export default DocListItem;
