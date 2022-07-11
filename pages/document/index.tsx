import { useState, useRef, Fragment } from "react";
import { RiSearch2Line } from "react-icons/ri";
import { throttle, debounce } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import { DOC_TYPE, useInfiniteDocumentsQuery } from "@/services/document";
import PageNav from "@/layouts/pagenav";
import EmptyMsg from "@/layouts/emptymsg";
import DocListItem from "@/layouts/doclistitem";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Document = () => {
  const [q, setQ] = useState("");
  const documentQuery = useInfiniteDocumentsQuery(q, {
    getPreviousPageParam: (firstPage) => firstPage.data.cursor || undefined,
    getNextPageParam: (lastPage) => lastPage.data.cursor || undefined,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const observeCallback = () => {
    if (documentQuery.hasNextPage) {
      documentQuery.fetchNextPage();
    }
  };

  const onSearchClick = (q: string) => {
    setQ(q);
  };

  return (
    <>
      <PageNav />
      <div className={styles.pageWrapper}>
        <h2 className={styles.subTitle}>
          <a id="document">Dokumen</a>
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
        <main className={styles.contentContainer}>
          {documentQuery.isLoading ? (
            "Loading..."
          ) : documentQuery.error ? (
            <ErrMsg />
          ) : documentQuery.data?.pages[0].data.documents.length === 0 ? (
            <EmptyMsg />
          ) : (
            documentQuery.data?.pages.map((page) => {
              return (
                <Fragment key={page.data.cursor}>
                  {page.data.documents
                    .filter(
                      ({ type, is_private: isPrivate }) =>
                        type === DOC_TYPE.FILE && isPrivate === false
                    )
                    .map((doc) => {
                      return (
                        <a
                          target="_blank"
                          rel="noreferrer"
                          key={doc.id}
                          href={doc.url}
                          className={styles.documentLink}
                        >
                          <DocListItem document={doc} />
                        </a>
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

export default Document;
