import type { DocumentOut } from "@/services/document";
import { RiFolderFill, RiFileFill } from "react-icons/ri";
import { DOC_TYPE } from "@/services/document";
import BadgeList from "@/layouts/badgelist";

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
    <BadgeList icon={icon} moreBtn={moreBtn}>
      {document.name}
    </BadgeList>
  );
};

export default DocListItem;
