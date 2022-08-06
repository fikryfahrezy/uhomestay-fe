import type { ReactElement } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { useRef } from "react";
import Link from "next/link";
import { RiCloseLine, RiCheckFill } from "react-icons/ri";
import { getPlainText } from "@/lib/blogmeta";
import { addHistory, useFindLatestHistory } from "@/services/history";
import Button from "@/components/button";
import LinkButton from "@/components/linkbutton";
import Toast, { useToast } from "@/components/toast";
import ToastComponent from "@/layouts/toastcomponent";
import AdminLayout from "@/layouts/adminpage";
import styles from "./Styles.module.css";

const RichText = dynamic(() => import("@/layouts/richtext/write"));

const WriteHistory = () => {
  const { toast, updateToast, props } = useToast();
  const latestHistory = useFindLatestHistory();
  const router = useRouter();
  const editorStateRef = useRef();

  const addHistoryMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof addHistory>[0]
  >((data) => {
    return addHistory(data);
  });

  const onClick = () => {
    if (editorStateRef.current) {
      const content = JSON.stringify(editorStateRef.current);
      let contentText = "";

      if (editorStateRef.current && content !== "") {
        contentText = getPlainText(editorStateRef.current);
      }

      const lastId = toast({
        status: "info",
        duration: 999999,
        render: () => <ToastComponent title="Loading mengubah sejarah" />,
      });

      addHistoryMutation
        .mutateAsync({
          content,
          content_text: contentText,
        })
        .then(() => {
          window.location.replace(`${router.pathname}/../`);
        })
        .catch((e) => {
          updateToast(lastId, {
            status: "error",
            render: () => (
              <ToastComponent
                title="Error mengubah sejarah"
                message={e.message}
                data-testid="toast-modal"
              />
            ),
          });
        });
    }
  };

  return (
    <>
      <div className={styles.editableButtons}>
        <Button
          colorScheme="green"
          leftIcon={<RiCheckFill />}
          onClick={onClick}
          className={styles.actionBtn}
          data-testid="edit-history-btn"
        >
          Ubah
        </Button>
        <Link href={`${router.pathname}/../`} passHref>
          <LinkButton
            colorScheme="red"
            leftIcon={<RiCloseLine />}
            className={styles.actionBtn}
          >
            Batal
          </LinkButton>
        </Link>
      </div>
      <h1 className={styles.pageTitle}>Sejarah</h1>
      {latestHistory.isLoading ? (
        "Loading..."
      ) : latestHistory.error ? (
        <RichText editorStateRef={editorStateRef} editorStateJSON={null} />
      ) : (
        <RichText
          editorStateRef={editorStateRef}
          editorStateJSON={
            latestHistory.data ? latestHistory.data.data.content : null
          }
        />
      )}
      <Toast {...props} />
    </>
  );
};

WriteHistory.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default WriteHistory;
