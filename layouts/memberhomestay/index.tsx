import type { MemberHomestaysRes } from "@/services/member-homestay";
import type { HomestayAddModalType } from "@/layouts/homestayaddmodal";
import type { HomestayEditModalType } from "@/layouts/homestayeditmodal";
import { useState, useRef } from "react";
import { RiAddLine } from "react-icons/ri";
import { useHomestaysQuery } from "@/services/member-homestay";
import Toast, { useToast } from "@/components/toast";
import Button from "@/components/button";
import HomestayAddModal from "@/layouts/homestayaddmodal";
import HomestayEditModal from "@/layouts/homestayeditmodal";
import ToastComponent from "@/layouts/toastcomponent";
import MemberHomestayList from "@/layouts/memberhomestaylist";
import styles from "./Styles.module.css";

type FormType = HomestayAddModalType | HomestayEditModalType;

type MemberHomestayProps = {
  uid: string;
};
const MemberHomestay = ({ uid }: MemberHomestayProps) => {
  const [isOpen, setOpen] = useState(false);
  const [tempData, setTempData] = useState<MemberHomestaysRes | null>(null);

  const { toast, updateToast, props } = useToast();
  const toastId = useRef<{ [key in FormType]: number }>({
    add: 0,
    delete: 0,
    edit: 0,
    upload: 0,
    removeimage: 0,
  });

  const memberHomestaysQuery = useHomestaysQuery(uid, {
    enabled: !!uid,
    getPreviousPageParam: (firstPage) => firstPage.data.cursor || undefined,
    getNextPageParam: (lastPage) => lastPage.data.cursor || undefined,
  });

  const onOpen = () => {
    setOpen(true);
  };

  const onItemClick = (val: MemberHomestaysRes) => {
    setTempData(val);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setTempData(null);
  };

  const onModified = (type: FormType, title?: string, message?: string) => {
    if (type !== "upload" && type !== "removeimage") {
      setOpen(false);
      setTempData(null);
      memberHomestaysQuery.refetch();
    }

    updateToast(toastId.current[type], {
      status: "success",
      render: () => <ToastComponent title={title} message={message} />,
    });
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
      <MemberHomestayList
        onClick={onItemClick}
        uid={uid}
        addButton={
          <Button
            colorScheme="green"
            leftIcon={<RiAddLine />}
            onClick={() => onOpen()}
            className={styles.addBtn}
            data-testid="add-btn"
          >
            Tambah
          </Button>
        }
      />
      {isOpen ? (
        tempData === null ? (
          <HomestayAddModal
            isOpen={isOpen}
            prevData={{ uid }}
            onCancel={() => onClose()}
            onSubmited={(type, title, message) =>
              onModified(type, title, message)
            }
            onError={(type, title, message) => onError(type, title, message)}
            onLoading={(type, title, message) =>
              onLoading(type, title, message)
            }
          />
        ) : (
          <HomestayEditModal
            isOpen={isOpen}
            prevData={{ ...tempData, uid }}
            onCancel={() => onClose()}
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
      <Toast {...props} />
    </>
  );
};

export default MemberHomestay;
