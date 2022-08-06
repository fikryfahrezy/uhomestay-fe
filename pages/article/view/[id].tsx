import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useFindArticle } from "@/services/article";
import PageNav from "@/layouts/pagenav";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Editor = dynamic(() => import("@/layouts/blogeditor/read"));

const ViewBlog = () => {
  const router = useRouter();
  const { id } = router.query;
  const blog = useFindArticle(Number(id), {
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
