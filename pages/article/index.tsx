import { useState, useRef, Fragment } from "react";
import Link from "next/link";
import { RiSearch2Line } from "react-icons/ri";
import { throttle, debounce } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import { useArticlesQuery } from "@/services/article";
import { LinkBox, LinkOverlay } from "@/components/linkoverlay";
import PageNav from "@/layouts/pagenav";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import BlogListItem from "@/layouts/bloglistitem";
import styles from "./Styles.module.css";

const Blog = () => {
  const [q, setQ] = useState("");
  const blogsQuery = useArticlesQuery(q, {
    getPreviousPageParam: (firstPage) => firstPage.data.cursor || undefined,
    getNextPageParam: (lastPage) => lastPage.data.cursor || undefined,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSearchClick = (q: string) => {
    setQ(q);
  };

  const observeCallback = () => {
    if (blogsQuery.hasNextPage) {
      blogsQuery.fetchNextPage();
    }
  };

  return (
    <>
      <PageNav />
      <div className={styles.pageWrapper}>
        <h2 className={styles.subTitle}>
          <a>Artikel</a>
        </h2>
        <div className={styles.form}>
          <input
            ref={inputRef}
            placeholder="..."
            onInput={debounce((e) => {
              onSearchClick((e.target as HTMLInputElement).value);
            }, 500)}
          />
          <button
            onClick={throttle(() => {
              onSearchClick(inputRef.current ? inputRef.current.value : "");
            }, 1000)}
          >
            <RiSearch2Line />
          </button>
        </div>
        <main className={styles.blogsContainer}>
          {blogsQuery.isLoading ? (
            "Loading..."
          ) : blogsQuery.error ? (
            <ErrMsg />
          ) : blogsQuery.data?.pages[0].data.articles.length === 0 ? (
            <EmptyMsg />
          ) : (
            blogsQuery.data?.pages.map((page) => {
              return (
                <Fragment key={page.data.cursor}>
                  {page.data.articles.map((blog) => {
                    return (
                      <LinkBox key={blog.id}>
                        <BlogListItem blog={blog} />
                        <Link
                          href={{
                            pathname: "./article/view/[id]",
                            query: { id: blog.id },
                          }}
                          passHref
                        >
                          <LinkOverlay />
                        </Link>
                      </LinkBox>
                    );
                  })}
                </Fragment>
              );
            })
          )}
        </main>
      </div>
      <Observe callback={debounce(observeCallback, 500)} />
    </>
  );
};

export default Blog;
