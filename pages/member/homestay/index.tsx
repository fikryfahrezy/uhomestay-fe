import type { ReactElement } from "react";
import { useState, useEffect } from "react";
import MemberLayout from "@/layouts/memberpage";
import MemberHomestay from "@/layouts/memberhomestay";

const Homestay = () => {
  const [muid, setMuid] = useState("");

  useEffect(() => {
    const lmuid = window.localStorage.getItem("muid");
    if (lmuid !== null) {
      setMuid(lmuid);
    }
  }, []);

  return <MemberHomestay uid={muid} />;
};

Homestay.getLayout = function getLayout(page: ReactElement) {
  return <MemberLayout>{page}</MemberLayout>;
};

export default Homestay;
