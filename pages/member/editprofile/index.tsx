import type { ReactElement } from "react";
import MemberLayout from "@/layouts/memberpage";
import UpdateProfile from "@/layouts/editprofile";

const EditProfile = () => {
  return <UpdateProfile />;
};

EditProfile.getLayout = function getLayout(page: ReactElement) {
  return <MemberLayout>{page}</MemberLayout>;
};

export default EditProfile;
