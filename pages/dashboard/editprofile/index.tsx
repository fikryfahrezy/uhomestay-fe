import type { ReactElement } from "react";
import AdminPage from "@/layout/adminpage";
import UpdateProfile from "@/layout/editprofile";

const EditProfile = () => {
  return <UpdateProfile />;
};

EditProfile.getLayout = function getLayout(page: ReactElement) {
  return <AdminPage>{page}</AdminPage>;
};

export default EditProfile;
