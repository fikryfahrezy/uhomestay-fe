import type { ReactElement } from "react";
import type { EditorState } from "lexical";
import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import slugify from "@sindresorhus/slugify";
import { RiCheckFill, RiCloseLine } from "react-icons/ri";
import { getBlogMeta } from "@/lib/blogmeta";
import { addBlog, uploadImage } from "@/services/blog";
import Button from "@/components/button";
import LinkButton from "@/components/linkbutton";
import AdminLayout from "@/layout/adminpage";
import Toast, { useToast } from "@/components/toast";
import ToastComponent from "@/layout/toastcomponent";
import styles from "./Styles.module.css";

const Editor = dynamic(() => import("@/layout/blogeditor/write"));

const CreateBlog = () => {
  const router = useRouter();
  const { toast, props } = useToast();
  const editorStateRef = useRef<EditorState | null>(null);

  const onSave = () => {
    const content = editorStateRef.current
      ? JSON.stringify(editorStateRef.current)
      : "";

    const data = {
      content,
      slug: "",
      title: "",
      thumbnail_url: "",
      short_desc: "",
      content_text: "",
    };

    if (editorStateRef.current && content !== "") {
      const blogMeta = getBlogMeta(editorStateRef.current);

      data.slug = slugify(blogMeta.title);
      data.title = blogMeta.title;
      data["thumbnail_url"] = blogMeta["thumbnail_url"];
      data["short_desc"] = blogMeta["short_desc"];
      data["content_text"] = blogMeta["content_text"];
    }

    addBlog(data)
      .then(() => {
        window.location.replace(`${router.pathname}/../`);
      })
      .catch((e) => {
        toast({
          status: "error",
          render: () => <ToastComponent title="Error" message={e.message} />,
        });
      });
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
          className={styles.actionBtn}
          onClick={onSave}
          data-testid="create-blog-btn"
        >
          Buat
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
      <div className={styles.editorContainer}>
        <Editor
          uploadImgFunc={uploadImage}
          editorStateRef={editorStateRef}
          editorStateJSON={null}
          onChange={onChange}
        />
      </div>
      <Toast {...props} />
    </>
  );
};

CreateBlog.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default CreateBlog;
