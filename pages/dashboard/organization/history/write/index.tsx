import type { ReactElement } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useRef } from "react";
import Link from "next/link";
import { RiCloseLine, RiCheckFill } from "react-icons/ri";
import { getPlainText } from "@/lib/blogmeta";
import { addHistory, useFindLatestHistory } from "@/services/history";
import Button from "@/components/button";
import LinkButton from "@/components/linkbutton";
import Toast, { useToast } from "@/components/toast";
import ToastComponent from "@/layout/toastcomponent";
import AdminLayout from "@/layout/adminpage";
import styles from "./Styles.module.css";

const RichText = dynamic(() => import("@/layout/richtext/write"));

const WriteHistory = () => {
  const { toast, props } = useToast();
  const latestHistory = useFindLatestHistory();
  const router = useRouter();
  const editorStateRef = useRef();

  const onClick = () => {
    if (editorStateRef.current) {
      const content = JSON.stringify(editorStateRef.current);
      let contentText = "";

      if (editorStateRef.current && content !== "") {
        contentText = getPlainText(editorStateRef.current);
      }

      addHistory({
        content,
        content_text: contentText,
      })
        .then(() => {
          window.location.replace(`${router.pathname}/../`);
        })
        .catch((e) => {
          toast({
            status: "error",
            render: () => <ToastComponent title="Error" message={e.message} />,
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
