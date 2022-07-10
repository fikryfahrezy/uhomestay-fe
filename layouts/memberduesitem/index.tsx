import type { MembersDuesOut } from "@/services/member-dues";
import { DUES_STATUS } from "@/services/member-dues";
import Badge from "cmnjg-sb/dist/badge";
import MemberItem from "@/layouts/memberitem";

type MemberDuesItemProps = {
  moreBtn?: JSX.Element;
  member: MembersDuesOut;
};

const MemberDuesItem = ({ moreBtn, member }: MemberDuesItemProps) => {
  const badge = (() => {
    switch (member["status"]) {
      case DUES_STATUS.PAID:
        return <Badge colorScheme="green">Sudah Lunas</Badge>;
      case DUES_STATUS.WAITING:
        return <Badge colorScheme="yellow">Menunggu Konfirmasi</Badge>;
      default:
        return <Badge colorScheme="red">Belum Lunas</Badge>;
    }
  })();

  return (
    <MemberItem
      name={member.name}
      profilePicUrl={member["profile_pic_url"]}
      badge={badge}
      moreBtn={moreBtn}
    />
  );
};

export default MemberDuesItem;
