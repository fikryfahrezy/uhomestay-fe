import type { ReactElement, MouseEvent } from "react";
import type { DocumentOut } from "@/services/document";
import { useRouter } from "next/router";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  RiFileUploadFill,
  RiSearch2Line,
  RiFileLine,
  RiFolderLine,
  RiMore2Line,
  RiArrowDropRightLine,
} from "react-icons/ri";
import {
  DOC_TYPE,
  useDocumentsQuery,
  useDocumentChildsQuery,
} from "@/services/document";
import Button from "@/components/button";
import IconButton from "@/components/iconbutton";
import Drawer from "@/components/drawer";
import Input from "@/components/input";
import PopUp from "@/components/popup";
import AdminLayout from "@/layout/adminpage";
import DocFileAddForm from "@/layout/docaddform/file";
import DocFileEditForm from "@/layout/doceditform/file";
import DocDirAddForm from "@/layout/docaddform/dir";
import DocDirEditForm from "@/layout/doceditform/dir";
import EmptyMsg from "@/layout/emptymsg";
import DocListItem from "@/layout/doclistitem";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const Organization = () => {
  const [open, setOpen] = useState(false);
  const [docType, setDocType] = useState(DOC_TYPE.FILE);
  const [tempData, setTempData] = useState<DocumentOut | null>(null);
  const router = useRouter();
  const { dir_id: dirId } = router.query;

  const documentsQuery = useDocumentsQuery();
  const documentChildsQuery = useDocumentChildsQuery(
    typeof dirId === "string" ? Number(dirId) : 0
  );

  const documentParent = useMemo(() => {
    const data = documentsQuery.data ? documentsQuery.data.data.documents : [];
    const dLen = data.length;

    const tree: Map<number, DocumentOut> = new Map();
    for (let i = 0; i < dLen; i++) {
      const d = data[i];
      tree.set(d.id, d);
    }

    /**
     * Ref: Finding the Shortest Path in Javascript: Breadth First Search
     * https://levelup.gitconnected.com/finding-the-shortest-path-in-javascript-pt-1-breadth-first-search-67ae4653dbec
     *
     */
    const dfs: (
      tree: Map<number, DocumentOut>,
      rootNode: number
    ) => DocumentOut[] = (tree, rootNode) => {
      const path: DocumentOut[] = [];
      const queue: DocumentOut[] = [];

      const node = tree.get(rootNode);
      if (node === undefined) {
        return path;
      }

      queue.push(node);

      while (queue.length > 0) {
        const firstQ = queue.shift();
        if (firstQ === undefined) {
          break;
        }

        path.unshift(firstQ);

        const parentDirId = firstQ["dir_id"];
        const isParentDirIdExist = parentDirId !== undefined;
        if (isParentDirIdExist && parentDirId === 0) {
          return path;
        }

        const parentDir = tree.get(parentDirId);
        if (isParentDirIdExist && parentDir !== undefined) {
          queue.push(parentDir);
        }
      }

      return path;
    };

    const histories = dfs(tree, Number(dirId));
    const lastHistory = histories[histories.length - 2];

    return lastHistory;
  }, [documentsQuery.data, dirId]);

  const onChipOptClick = (
    val: DocumentOut,
    e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setTempData(val);
    setOpen(true);

    const type = val.type;
    switch (type) {
      case DOC_TYPE.DIR:
        setDocType(DOC_TYPE.DIR);
        break;
      default:
        setDocType(DOC_TYPE.FILE);
    }
  };

  const onClose = () => {
    setTempData(null);
    setOpen(false);
    setDocType("");
  };

  const onOpen = (type: string) => {
    setDocType(type);
    setOpen(true);
  };

  /**
   * @return {void}
   */
  const onModified = () => {
    setTempData(null);
    setOpen(false);

    documentsQuery.refetch();
    documentChildsQuery.refetch();
  };

  return (
    <>
      <h1 className={styles.pageTitle}>Dokumen</h1>
      <div className={styles.headerContainer}>
        <PopUp
          popUpContent={
            <ul className={styles.addBtnOptions}>
              <li
                className={styles.addBtnOption}
                onClick={() => onOpen(DOC_TYPE.DIR)}
              >
                <RiFolderLine />
                Folder
              </li>
              <li
                className={styles.addBtnOption}
                onClick={() => onOpen(DOC_TYPE.FILE)}
              >
                <RiFileLine />
                File
              </li>
            </ul>
          }
        >
          <Button colorScheme="green" leftIcon={<RiFileUploadFill />}>
            Tambah
          </Button>
        </PopUp>
        <form className={styles.form}>
          <Input placeholder="..." />
          <Button colorScheme="green" leftIcon={<RiSearch2Line />}>
            Cari
          </Button>
        </form>
      </div>
      <div className={styles.histories}>
        <Link href={router.pathname}>
          <a className={styles.history}>Folder Utama</a>
        </Link>
        {documentParent ? (
          <>
            <div className={styles.historyGap}>
              <RiArrowDropRightLine />
              <span>...</span>
              <RiArrowDropRightLine />
            </div>
            <Link
              href={{
                pathname: router.pathname,
                search: `dir_id=${documentParent.id}`,
              }}
            >
              <a className={styles.history}>{documentParent.name}</a>
            </Link>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className={styles.contentContainer}>
        {documentChildsQuery.isLoading ? (
          "Loading..."
        ) : documentChildsQuery.error ? (
          <ErrMsg />
        ) : documentChildsQuery.data?.data.documents.length === 0 ? (
          <EmptyMsg />
        ) : (
          documentChildsQuery.data?.data.documents.map((val) => {
            const { id, type, url } = val;

            const child = (
              <DocListItem
                document={val}
                moreBtn={
                  <IconButton
                    className={styles.moreBtn}
                    onClick={(e) => onChipOptClick(val, e)}
                  >
                    <RiMore2Line />
                  </IconButton>
                }
              />
            );

            return type === DOC_TYPE.DIR ? (
              <Link
                key={id}
                href={{
                  pathname: router.pathname,
                  query: { dir_id: id },
                }}
              >
                <a className={styles.documentLink}>{child}</a>
              </Link>
            ) : (
              <a
                key={id}
                target="_blank"
                rel="noreferrer"
                href={url}
                className={styles.documentLink}
              >
                {child}
              </a>
            );
          })
        )}
      </div>
      <Drawer isOpen={open} onClose={onClose}>
        {docType === DOC_TYPE.FILE ? (
          tempData === null ? (
            <DocFileAddForm
              onCancel={() => onClose()}
              onSubmited={() => onModified()}
            />
          ) : (
            <DocFileEditForm
              prevData={tempData}
              onCancel={() => onClose()}
              onEdited={() => onModified()}
            />
          )
        ) : tempData === null ? (
          <DocDirAddForm
            onCancel={() => onClose()}
            onSubmited={() => onModified()}
          />
        ) : (
          <DocDirEditForm
            prevData={tempData}
            onCancel={() => onClose()}
            onEdited={() => onModified()}
          />
        )}
      </Drawer>
    </>
  );
};

Organization.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Organization;
