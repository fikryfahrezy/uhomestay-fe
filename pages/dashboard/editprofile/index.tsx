import type { ReactElement } from "react";
import AdminPage from "@/layouts/adminpage";
import UpdateProfile from "@/layouts/editprofile";

const EditProfile = () => {
  return <UpdateProfile />;
};

EditProfile.getLayout = function getLayout(page: ReactElement) {
  return <AdminPage>{page}</AdminPage>;
};

export default EditProfile;
