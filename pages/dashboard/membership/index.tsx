import type { ReactElement } from "react";
import type { MemberOut } from "@/services/member";
import { useState, useRef, Fragment } from "react";
import { RiUserAddLine, RiSearch2Line, RiMore2Line } from "react-icons/ri";
import { throttle, debounce } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import { useInfiniteMembersQuery } from "@/services/member";
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
  const [q, setQ] = useState("");
  const membersQuery = useInfiniteMembersQuery(q, {
    getPreviousPageParam: (firstPage) => firstPage.data.cursor || undefined,
    getNextPageParam: (lastPage) => lastPage.data.cursor || undefined,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const observeCallback = () => {
    if (membersQuery.hasNextPage) {
      membersQuery.fetchNextPage();
    }
  };

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

  const onSearchClick = (q: string) => {
    setQ(q);
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
        <div className={styles.form}>
          <Input
            ref={inputRef}
            placeholder="..."
            onInput={debounce((e) => {
              onSearchClick((e.target as HTMLInputElement).value);
            }, 500)}
          />
          <Button
            colorScheme="green"
            leftIcon={<RiSearch2Line />}
            onClick={throttle(() => {
              onSearchClick(inputRef.current ? inputRef.current.value : "");
            }, 1000)}
          >
            Cari
          </Button>
        </div>
      </div>
      <div className={styles.contentContainer}>
        {membersQuery.isLoading ? (
          "Loading..."
        ) : membersQuery.error ? (
          <ErrMsg />
        ) : membersQuery.data?.pages[0].data.members.length === 0 ? (
          <EmptyMsg />
        ) : (
          membersQuery.data?.pages.map((page) => {
            return (
              <Fragment key={page.data.cursor}>
                {page.data.members.map((member) => {
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
                })}
              </Fragment>
            );
          })
        )}
      </div>
      <Observe callback={debounce(observeCallback, 500)} />
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
