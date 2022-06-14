import type { ReactElement } from "react";
import type { EditorState } from "lexical";
import dynamic from "next/dynamic";
import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { RiCloseLine, RiCheckFill } from "react-icons/ri";
import { getBlogMeta } from "@/lib/blogmeta";
import { editBlog, useFindBlog, uploadImage } from "@/services/blog";
import Button from "@/components/button";
import LinkButton from "@/components/linkbutton";
import AdminLayout from "@/layout/adminpage";
import Toast, { useToast } from "@/components/toast";
import ToastComponent from "@/layout/toastcomponent";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const Editor = dynamic(() => import("@/layout/blogeditor/write"));

const EditBlog = () => {
  const router = useRouter();
  const { id } = router.query;
  const blog = useFindBlog(id as string, {
    enabled: !!id,
    retry: false,
  });
  const { toast, props } = useToast();
  const editorStateRef = useRef<EditorState | null>(null);

  const onSave = (id: string) => {
    if (editorStateRef.current) {
      const blogMeta = getBlogMeta(editorStateRef.current);

      editBlog(id, {
        short_desc: blogMeta["short_desc"],
        thumbnail_url: blogMeta["thumbnail_url"],
        title: blogMeta.title,
        content: JSON.stringify(editorStateRef.current),
      })
        .then(() => {
          window.location.replace(`${router.pathname}/../../`);
        })
        .catch((e) => {
          toast({
            status: "error",
            render: () => <ToastComponent title="Error" message={e.message} />,
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
          onClick={() => onSave(id as string)}
          className={styles.actionBtn}
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
