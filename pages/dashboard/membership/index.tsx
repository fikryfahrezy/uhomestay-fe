import type { ReactElement } from "react";
import type { MemberOut } from "@/services/member";
import type { MemberAddFormType } from "@/layouts/memberaddform";
import type { MemberEditFormType } from "@/layouts/membereditform";
import { useState, useRef, Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  RiUserAddLine,
  RiSearch2Line,
  RiMore2Line,
  RiArrowRightLine,
  RiHomeSmileLine,
} from "react-icons/ri";
import { throttle, debounce } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import { useInfiniteMembersQuery } from "@/services/member";
import Drawer from "@/components/drawer";
import Input from "@/components/input";
import Button from "@/components/button";
import IconButton from "@/components/iconbutton";
import PopUp from "@/components/popup";
import Toast, { useToast } from "@/components/toast";
import AdminLayout from "@/layouts/adminpage";
import MemberAddForm from "@/layouts/memberaddform";
import MemberEditForm from "@/layouts/membereditform";
import EmptyMsg from "@/layouts/emptymsg";
import MemberListItem from "@/layouts/memberlistitem";
import ErrMsg from "@/layouts/errmsg";
import ToastComponent from "@/layouts/toastcomponent";
import styles from "./Styles.module.css";

type FormType = MemberAddFormType | MemberEditFormType;

const Member = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [tempData, setTempData] = useState<MemberOut | null>(null);
  const [q, setQ] = useState("");
  const membersQuery = useInfiniteMembersQuery(q, {
    getPreviousPageParam: (firstPage) => firstPage.data.cursor || undefined,
    getNextPageParam: (lastPage) => lastPage.data.cursor || undefined,
  });

  const router = useRouter();
  const { toast, updateToast, props } = useToast();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const toastId = useRef<{ [key in FormType]: number }>({
    add: 0,
    approve: 0,
    delete: 0,
    edit: 0,
  });

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

  const onModified = (type: FormType, title?: string, message?: string) => {
    setTempData(null);
    setDrawerOpen(false);
    membersQuery.refetch();

    updateToast(toastId.current[type], {
      status: "success",
      render: () => <ToastComponent title={title} message={message} />,
    });
  };

  const onSearchClick = (q: string) => {
    setQ(q);
  };

  const onError = (type: FormType, title?: string, message?: string) => {
    updateToast(toastId.current[type], {
      status: "error",
      render: () => (
        <ToastComponent
          title={title}
          message={message}
          data-testid="toast-modal"
        />
      ),
    });
  };

  const onLoading = (type: FormType, title?: string, __?: string) => {
    toastId.current[type] = toast({
      status: "info",
      duration: 999999,
      render: () => <ToastComponent title={title} />,
    });
  };

  return (
    <>
      <h1 className={styles.pageTitle}>Anggota</h1>
      <div className={styles.headerContainer}>
        <Button
          colorScheme="green"
          leftIcon={<RiUserAddLine />}
          onClick={() => toggleDrawer()}
          data-testid="add-btn"
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
          <>
            <h3>
              Jumlah Total Anggota: {membersQuery.data?.pages[0].data.total}{" "}
              anggota
            </h3>
            {membersQuery.data?.pages.map((page) => {
              return (
                <Fragment key={page.data.cursor}>
                  {page.data.members.map((member) => {
                    return (
                      <MemberListItem
                        key={member.id}
                        member={member}
                        moreBtn={
                          <PopUp
                            popUpPosition="bottom-right"
                            className={styles.popup}
                            popUpContent={
                              <ul className={styles.addBtnOptions}>
                                <li
                                  onClick={() => {
                                    openDrawer(member);
                                  }}
                                  className={styles.addBtnOption}
                                  data-testid="member-detail-popup"
                                >
                                  <RiArrowRightLine />
                                  Lihat Detail
                                </li>{" "}
                                <li>
                                  <Link
                                    href={{
                                      pathname: `${router.pathname}/homestay/[id]`,
                                      query: { id: member.id },
                                    }}
                                  >
                                    <a
                                      className={`${styles.addBtnOption} ${styles.optionLink}`}
                                    >
                                      <RiHomeSmileLine />
                                      Lihat Homestay
                                    </a>
                                  </Link>
                                </li>
                              </ul>
                            }
                          >
                            <IconButton className={styles.moreBtn}>
                              <RiMore2Line />
                            </IconButton>
                          </PopUp>
                        }
                      />
                    );
                  })}
                </Fragment>
              );
            })}
          </>
        )}
      </div>
      <Observe callback={debounce(observeCallback, 500)} />
      <Drawer isOpen={isDrawerOpen} onClose={() => onDrawerClose()}>
        {isDrawerOpen ? (
          tempData === null ? (
            <MemberAddForm
              onCancel={() => onDrawerClose()}
              onSubmited={(type, title, message) =>
                onModified(type, title, message)
              }
              onError={(type, title, message) => onError(type, title, message)}
              onLoading={(type, title, message) =>
                onLoading(type, title, message)
              }
            />
          ) : (
            <MemberEditForm
              prevData={tempData}
              onCancel={() => onDrawerClose()}
              onSubmited={(type, title, message) =>
                onModified(type, title, message)
              }
              onError={(type, title, message) => onError(type, title, message)}
              onLoading={(type, title, message) =>
                onLoading(type, title, message)
              }
            />
          )
        ) : (
          <></>
        )}
      </Drawer>
      <Toast {...props} />
    </>
  );
};

Member.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Member;
