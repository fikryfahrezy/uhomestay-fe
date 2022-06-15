import type { ReactElement } from "react";
import type { DuesOut } from "@/services/dues";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { RiMoneyDollarCircleLine, RiMore2Line } from "react-icons/ri";
import { idrCurrency } from "@/lib/fmt";
import { useDuesQuery } from "@/services/dues";
import { useMembersDuesQuery } from "@/services/member-dues";
import Drawer from "@/components/drawer";
import Button from "@/components/button";
import IconButton from "@/components/iconbutton";
import Select from "@/components/select";
import LinkButton from "@/components/linkbutton";
import AdminLayout from "@/layout/adminpage";
import DuesAddForm from "@/layout/duesaddform";
import DuesEditForm from "@/layout/dueseditform";
import EmptyMsg from "@/layout/emptymsg";
import MemberDuesItem from "@/layout/memberduesitem";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const Dues = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedDues, setSelectedDues] = useState<DuesOut | null>(null);
  const [tempData, setTempData] = useState<DuesOut | null>(null);
  const router = useRouter();

  const duesQuery = useDuesQuery();
  const membersDuesQuery = useMembersDuesQuery(
    selectedDues ? selectedDues.id : 0,
    {
      enabled: !!selectedDues,
    }
  );

  const onOpen = () => {
    setDrawerOpen(true);
  };

  const onDrawerClose = () => {
    setTempData(null);
    setDrawerOpen(false);
  };

  const openDrawer = (data: DuesOut | null) => {
    setTempData(data);
    setDrawerOpen(true);
  };

  const onModified = () => {
    setTempData(null);
    setDrawerOpen(false);
    membersDuesQuery.refetch();
    duesQuery.refetch();
  };

  const onDuesSelect = (val: string) => {
    const numVal = Number(val);

    const dues = duesQuery.data?.data.dues.find((v) => {
      return v.id === numVal;
    });

    if (dues !== undefined) {
      setSelectedDues(dues);
    }
  };

  useEffect(() => {
    const duesData = duesQuery.data;
    if (duesData !== undefined && duesData.data.dues.length != 0) {
      setSelectedDues(duesData.data.dues[0]);
    }
  }, [duesQuery.data]);

  return (
    <>
      <h1 className={styles.pageTitle}>Daftar Iuran Anggota</h1>
      <Button
        colorScheme="green"
        leftIcon={<RiMoneyDollarCircleLine />}
        onClick={() => onOpen()}
        className={styles.addBtn}
      >
        Buat Tagihan
      </Button>
      <div className={styles.tableContainer}>
        <div className={styles.groupTitle}>
          <div className={styles.groupTitleBody}>
            <div>
              <p className={styles.groupSubtitle}>Tanggal</p>
              {duesQuery.isLoading ? (
                "Loading..."
              ) : duesQuery.error ? (
                <ErrMsg />
              ) : duesQuery.data ? (
                <Select
                  className={styles.select}
                  onChange={(e) => onDuesSelect(e.currentTarget.value)}
                  value={selectedDues ? selectedDues.id : ""}
                >
                  {duesQuery.data.data.dues.map((val) => {
                    const { id, date } = val;
                    return (
                      <option key={id} value={id}>
                        {date}
                      </option>
                    );
                  })}
                </Select>
              ) : (
                <></>
              )}
            </div>
            <div>
              <p className={styles.groupSubtitle}>Jumlah Iuran</p>
              {selectedDues !== null && selectedDues !== undefined ? (
                <p className={styles.groupSubvalue}>
                  {idrCurrency.format(Number(selectedDues["idr_amount"]))}
                </p>
              ) : (
                <></>
              )}
            </div>
          </div>
          <IconButton
            className={styles.moreBtn}
            onClick={() => openDrawer(selectedDues)}
          >
            <RiMore2Line />
          </IconButton>
        </div>
        {membersDuesQuery.isLoading || membersDuesQuery.isIdle ? (
          "Loading..."
        ) : membersDuesQuery.error ? (
          <ErrMsg />
        ) : membersDuesQuery.data.data["member_dues"].length === 0 ? (
          <EmptyMsg />
        ) : (
          membersDuesQuery.data.data["member_dues"].map((val) => {
            return (
              <MemberDuesItem
                key={val.id}
                member={val}
                moreBtn={
                  <Link
                    href={{
                      pathname: `${router.pathname}/member/[id]`,
                      query: { id: val["member_id"] },
                    }}
                    passHref
                  >
                    <LinkButton
                      colorScheme="green"
                      leftIcon={<RiMore2Line />}
                      className={styles.moreBtn}
                    />
                  </Link>
                }
              />
            );
          })
        )}
      </div>
      <Drawer isOpen={isDrawerOpen} onClose={() => onDrawerClose()}>
        {tempData === null ? (
          <DuesAddForm
            onCancel={() => onDrawerClose()}
            onSubmited={() => onModified()}
          />
        ) : (
          <DuesEditForm
            prevData={tempData}
            onCancel={() => onDrawerClose()}
            onEdited={() => onModified()}
          />
        )}
      </Drawer>
    </>
  );
};

Dues.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Dues;
