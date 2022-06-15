import type { ReactElement } from "react";
import Link from "next/link";
import { useBlogsQuery } from "@/services/blog";
import { LinkBox, LinkOverlay } from "@/components/linkoverlay";
import PageNav from "@/layout/pagenav";
import EmptyMsg from "@/layout/emptymsg";
import ErrMsg from "@/layout/errmsg";
import BlogListItem from "@/layout/bloglistitem";
import styles from "./Styles.module.css";

const Blog = () => {
  const blogsQuery = useBlogsQuery();

  return (
    <>
      <PageNav />
      <div className={styles.pageWrapper}>
        <h2 className={styles.subTitle}>
          <a id="blog">Blog</a>
        </h2>
        <main className={styles.blogsContainer}>
          {blogsQuery.isLoading ? (
            "Loading..."
          ) : blogsQuery.error ? (
            <ErrMsg />
          ) : blogsQuery.data?.data.length === 0 ? (
            <EmptyMsg />
          ) : (
            blogsQuery.data?.data.map((blog) => {
              return (
                <LinkBox key={blog.id}>
                  <BlogListItem blog={blog} />
                  <Link
                    href={{
                      pathname: "./blog/view/[id]",
                      query: { id: blog.id },
                    }}
                    passHref
                  >
                    <LinkOverlay />
                  </Link>
                </LinkBox>
              );
            })
          )}
        </main>
      </div>
    </>
  );
};

export default Blog;
