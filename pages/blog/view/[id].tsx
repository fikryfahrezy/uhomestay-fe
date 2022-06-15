import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useFindBlog } from "@/services/blog";
import PageNav from "@/layout/pagenav";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const Editor = dynamic(() => import("@/layout/blogeditor/read"));

const ViewBlog = () => {
  const router = useRouter();
  const { id } = router.query;
  const blog = useFindBlog(id as string, {
    enabled: !!id,
  });

  return (
    <>
      <PageNav />
      <div className={styles.editorContainer}>
        {blog.isIdle || blog.isLoading ? (
          "Loading..."
        ) : blog.error ? (
          <ErrMsg />
        ) : (
          <Editor editorStateJSON={blog.data.data.content} />
        )}
      </div>
    </>
  );
};

export default ViewBlog;
