import { DOC_TYPE, useDocumentsQuery } from "@/services/document";
import PageNav from "@/layout/pagenav";
import EmptyMsg from "@/layout/emptymsg";
import DocListItem from "@/layout/doclistitem";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const Document = () => {
  const documentQuery = useDocumentsQuery();

  return (
    <>
      <PageNav />
      <div className={styles.pageWrapper}>
        <h2 className={styles.subTitle}>
          <a id="document">Dokumen</a>
        </h2>
        <main className={styles.contentContainer}>
          {documentQuery.isLoading ? (
            "Loading..."
          ) : documentQuery.error ? (
            <ErrMsg />
          ) : documentQuery.data?.data.documents.length === 0 ? (
            <EmptyMsg />
          ) : (
            documentQuery.data?.data.documents
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
              })
          )}
        </main>
      </div>
    </>
  );
};

export default Document;
