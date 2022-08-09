import type { ReactElement } from "react";
import { useState } from "react";
import { useMutation } from "react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { RiFileSettingsLine, RiDeleteBin6Line } from "react-icons/ri";
import { useFindArticle, removeArticle } from "@/services/article";
import LinkButton from "@/components/linkbutton";
import Button from "@/components/button";
import Toast, { useToast } from "@/components/toast";
import Modal from "@/layouts/modal";
import ToastComponent from "@/layouts/toastcomponent";
import AdminLayout from "@/layouts/adminpage";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Editor = dynamic(() => import("@/layouts/blogeditor/read"));

const ViewBlog = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { toast, updateToast, props } = useToast();
  const router = useRouter();
  const { id } = router.query;
  const blog = useFindArticle(Number(id), {
    enabled: !!id,
  });

  const removeBlogMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof removeArticle>[0]
  >((id) => {
    return removeArticle(id);
  });

  /**
   *
   * @param {string} id
   */
  const onDeleteBlog = (id: number) => {
    const lastId = toast({
      status: "info",
      duration: 999999,
      render: () => <ToastComponent title="Loading menghapus artikel" />,
    });

    removeBlogMutation
      .mutateAsync(id)
      .then(() => {
        router.replace(`${router.pathname}/../..`);
      })
      .catch((e) => {
        updateToast(lastId, {
          status: "error",
          render: () => (
            <ToastComponent
              title="Error menghapus artikel"
              message={e.message}
              data-testid="toast-modal"
            />
          ),
        });
      });
  };

  const onConfirmDelete = () => {
    setModalOpen(true);
  };

  const onCancelDelete = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className={styles.editableButtons}>
        <Link
          href={{
            pathname: `${router.pathname}/../../edit/[id]`,
            query: { id },
          }}
          passHref
        >
          <LinkButton
            colorScheme="green"
            leftIcon={<RiFileSettingsLine />}
            className={styles.actionBtn}
          >
            Ubah
          </LinkButton>
        </Link>
        <Button
          colorScheme="red"
          leftIcon={<RiDeleteBin6Line />}
          onClick={onConfirmDelete}
          className={styles.actionBtn}
          data-testid="remove-blog-btn"
        >
          Hapus
        </Button>
      </div>
      <div className={styles.editorContainer}>
        {blog.isIdle || blog.isLoading ? (
          "Loading..."
        ) : blog.error ? (
          <ErrMsg />
        ) : (
          <Editor editorStateJSON={blog.data.data.content} />
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        heading="Peringatan!"
        onCancel={onCancelDelete}
        onConfirm={() => onDeleteBlog(Number(id))}
      >
        <p>Apakah anda yakin ingin menghapus data yang dipilih?</p>
      </Modal>
      <Toast {...props} />
    </>
  );
};

ViewBlog.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ViewBlog;
