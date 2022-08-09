import type { ReactElement } from "react";
import type { EditorState } from "lexical";
import dynamic from "next/dynamic";
import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { RiCloseLine, RiCheckFill } from "react-icons/ri";
import { useMutation } from "react-query";
import { getBlogMeta } from "@/lib/blogmeta";
import { editArticle, useFindArticle, uploadImage } from "@/services/article";
import Button from "@/components/button";
import LinkButton from "@/components/linkbutton";
import Toast, { useToast } from "@/components/toast";
import AdminLayout from "@/layouts/adminpage";
import ToastComponent from "@/layouts/toastcomponent";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Editor = dynamic(() => import("@/layouts/blogeditor/write"));

const EditBlog = () => {
  const router = useRouter();
  const { id } = router.query;
  const blog = useFindArticle(Number(id), {
    enabled: !!id,
    retry: false,
  });
  const { toast, updateToast, props } = useToast();
  const editorStateRef = useRef<EditorState | null>(null);

  const editBlogMutation = useMutation<
    unknown,
    unknown,
    {
      id: Parameters<typeof editArticle>[0];
      data: Parameters<typeof editArticle>[1];
    }
  >(({ id, data }) => {
    return editArticle(id, data);
  });

  const onSave = (id: number) => {
    if (editorStateRef.current) {
      const blogMeta = getBlogMeta(editorStateRef.current);
      const data = {
        short_desc: blogMeta["short_desc"],
        thumbnail_url: blogMeta["thumbnail_url"],
        title: blogMeta.title,
        content: JSON.stringify(editorStateRef.current),
        content_text: blogMeta["content_text"],
      };

      const lastId = toast({
        status: "info",
        duration: 999999,
        render: () => <ToastComponent title="Loading mengubah artikel" />,
      });

      editBlogMutation
        .mutateAsync({ id, data })
        .then(() => {
          window.location.replace(`${router.pathname}/../../`);
        })
        .catch((e) => {
          updateToast(lastId, {
            status: "error",
            render: () => (
              <ToastComponent
                title="Error mengubah artikel"
                message={e.message}
                data-testid="toast-modal"
              />
            ),
          });
        });
    }
  };

  const onChange = (editorState: EditorState) => {
    editorStateRef.current = editorState;
  };

  return (
    <>
      <div className={styles.editableButtons}>
        <Button
          colorScheme="green"
          leftIcon={<RiCheckFill />}
          onClick={() => onSave(Number(id))}
          className={styles.actionBtn}
          data-testid="blog-edit-btn"
        >
          Ubah
        </Button>
        <Link
          href={{
            pathname: `${router.pathname}/../../view/[id]`,
            query: { id },
          }}
          passHref
        >
          <LinkButton
            colorScheme="red"
            leftIcon={<RiCloseLine />}
            className={styles.actionBtn}
          >
            Batal
          </LinkButton>
        </Link>
      </div>
      <div className={styles.editorContainer}>
        {blog.isIdle || blog.isLoading ? (
          "Loading..."
        ) : blog.error ? (
          <ErrMsg />
        ) : (
          <Editor
            uploadImgFunc={uploadImage}
            editorStateRef={editorStateRef}
            editorStateJSON={blog.data.data.content}
            onChange={onChange}
          />
        )}
      </div>
      <Toast {...props} />
    </>
  );
};

EditBlog.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default EditBlog;
