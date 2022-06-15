import type { ReactElement } from "react";
import MemberLayout from "@/layout/memberpage";
import UpdateProfile from "@/layout/editprofile";

const EditProfile = () => {
  return <UpdateProfile />;
};

EditProfile.getLayout = function getLayout(page: ReactElement) {
  return <MemberLayout>{page}</MemberLayout>;
};

export default EditProfile;
