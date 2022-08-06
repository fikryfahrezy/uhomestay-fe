import type { MemberHomestaysRes } from "@/services/member-homestay";
import { useState } from "react";
import HomestayItem from "@/layouts/homestayitem";
import HomestayViewModal from "@/layouts/homestayviewmodal";

type HomestayListItemProps = {
  homestayData: MemberHomestaysRes & { uid: string };
};

const HomestayListItem = ({ homestayData }: HomestayListItemProps) => {
  const [isOpen, setOpen] = useState(false);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <HomestayItem homestayData={homestayData} onClick={() => onOpen()} />
      <HomestayViewModal
        isOpen={isOpen}
        prevData={homestayData}
        onCancel={() => onClose()}
      />
    </>
  );
};

export default HomestayListItem;
