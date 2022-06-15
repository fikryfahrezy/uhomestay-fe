import type { ReactElement } from "react";
import type { MemberOut } from "@/services/member";
import { useState } from "react";
import { RiUserAddLine, RiSearch2Line, RiMore2Line } from "react-icons/ri";
import { useMembersQuery } from "@/services/member";
import Drawer from "@/components/drawer";
import Input from "@/components/input";
import Button from "@/components/button";
import IconButton from "@/components/iconbutton";
import AdminLayout from "@/layout/adminpage";
import MemberAddForm from "@/layout/memberaddform";
import MemberEditForm from "@/layout/membereditform";
import EmptyMsg from "@/layout/emptymsg";
import MemberListItem from "@/layout/memberlistitem";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const Member = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [tempData, setTempData] = useState<MemberOut | null>(null);
  const membersQuery = useMembersQuery();

  const toggleDrawer = () => {
    setDrawerOpen((prevState) => !prevState);
  };

  const onDrawerClose = () => {
    setTempData(null);
    setDrawerOpen(false);
  };

  const openDrawer = (data: MemberOut) => {
    setTempData(data);
    setDrawerOpen(true);
  };

  const onModified = () => {
    setTempData(null);
    setDrawerOpen(false);
    membersQuery.refetch();
  };

  return (
    <>
      <h1 className={styles.pageTitle}>Anggota</h1>
      <div className={styles.headerContainer}>
        <Button
          colorScheme="green"
          leftIcon={<RiUserAddLine />}
          onClick={() => toggleDrawer()}
        >
          Tambah
        </Button>
        <form className={styles.form}>
          <Input placeholder="..." />
          <Button colorScheme="green" leftIcon={<RiSearch2Line />}>
            Cari
          </Button>
        </form>
      </div>
      <div className={styles.contentContainer}>
        {membersQuery.isLoading ? (
          "Loading..."
        ) : membersQuery.error ? (
          <ErrMsg />
        ) : membersQuery.data?.data.length === 0 ? (
          <EmptyMsg />
        ) : (
          membersQuery.data?.data.map((member) => {
            return (
              <MemberListItem
                key={member.id}
                member={member}
                moreBtn={
                  <IconButton
                    className={styles.moreBtn}
                    onClick={() => {
                      openDrawer(member);
                    }}
                  >
                    <RiMore2Line />
                  </IconButton>
                }
              />
            );
          })
        )}
      </div>
      <Drawer isOpen={isDrawerOpen} onClose={() => onDrawerClose()}>
        {tempData === null ? (
          <MemberAddForm
            onCancel={() => onDrawerClose()}
            onSubmited={() => onModified()}
          />
        ) : (
          <MemberEditForm
            prevData={tempData}
            onCancel={() => onDrawerClose()}
            onEdited={() => onModified()}
          />
        )}
      </Drawer>
    </>
  );
};

Member.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Member;
