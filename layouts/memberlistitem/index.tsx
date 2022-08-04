import type { MemberOut } from "@/services/member";
import Badge from "@/components/badge";
import MemberItem from "@/layouts/memberitem";

type MemberListItemProps = {
  moreBtn?: JSX.Element;
  member: MemberOut;
};

const MemberListItem = ({ moreBtn, member }: MemberListItemProps) => {
  return (
    <MemberItem
      name={member.name}
      profilePicUrl={member["profile_pic_url"]}
      badge={
        member["is_approved"] ? (
          <Badge colorScheme="green">DITERIMA</Badge>
        ) : (
          <Badge colorScheme="yellow">MENUNGGU DITERIMA</Badge>
        )
      }
      moreBtn={moreBtn}
    />
  );
};

export default MemberListItem;
