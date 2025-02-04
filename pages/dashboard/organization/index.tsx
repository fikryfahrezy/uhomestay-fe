import Button from "@/components/button";
import Drawer from "@/components/drawer";
import IconButton from "@/components/iconbutton";
import Input from "@/components/input";
import Popup from "@/components/popup";
import Toast, { useToast } from "@/components/toast";
import AdminLayout from "@/layouts/adminpage";
import type { DocDirAddFormType } from "@/layouts/docaddform/dir";
import DocDirAddForm from "@/layouts/docaddform/dir";
import type { DocFileAddFormType } from "@/layouts/docaddform/file";
import DocFileAddForm from "@/layouts/docaddform/file";
import type { DocDirEditFormType } from "@/layouts/doceditform/dir";
import DocDirEditForm from "@/layouts/doceditform/dir";
import type { DocFileEditFormType } from "@/layouts/doceditform/file";
import DocFileEditForm from "@/layouts/doceditform/file";
import DocListItem from "@/layouts/doclistitem";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import ToastComponent from "@/layouts/toastcomponent";
import { debounce, throttle } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import type { DocumentOut } from "@/services/document";
import {
  DOC_TYPE,
  useDocumentChildsQuery,
  useDocumentsQuery,
} from "@/services/document";
import Link from "next/link";
import { useRouter } from "next/router";
import type { MouseEvent, ReactElement } from "react";
import { Fragment, useMemo, useRef, useState } from "react";
import {
  RiArrowDropRightLine,
  RiFileLine,
  RiFileUploadFill,
  RiFolderLine,
  RiMore2Line,
  RiSearch2Line,
} from "react-icons/ri";
import styles from "./Styles.module.css";

type FormType =
  | DocFileAddFormType
  | DocFileEditFormType
  | DocDirAddFormType
  | DocDirEditFormType;

const Organization = () => {
  const [open, setOpen] = useState(false);
  const [docType, setDocType] = useState<
    typeof DOC_TYPE.FILE[keyof typeof DOC_TYPE.FILE]
  >(DOC_TYPE.FILE);
  const [tempData, setTempData] = useState<DocumentOut | null>(null);
  const [q, setQ] = useState("");

  const router = useRouter();
  const { dir_id: dirId } = router.query;

  const documentsQuery = useDocumentsQuery("");
  const documentChildsQuery = useDocumentChildsQuery(
    typeof dirId === "string" ? Number(dirId) : 0,
    q,
    {
      getPreviousPageParam: (firstPage) => firstPage.data.cursor || undefined,
      getNextPageParam: (lastPage) => lastPage.data.cursor || undefined,
    }
  );

  const { toast, updateToast, props } = useToast();
  const toastId = useRef<{ [key in FormType]: number }>({
    adddir: 0,
    addfile: 0,
    deletedir: 0,
    deletefile: 0,
    editdir: 0,
    editfile: 0,
  });

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

  const inputRef = useRef<HTMLInputElement | null>(null);

  const observeCallback = () => {
    if (documentChildsQuery.hasNextPage) {
      documentChildsQuery.fetchNextPage();
    }
  };

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

  const onModified = (type: FormType, title?: string, message?: string) => {
    setTempData(null);
    setOpen(false);

    documentsQuery.refetch();
    documentChildsQuery.refetch();

    updateToast(toastId.current[type], {
      status: "success",
      render: () => <ToastComponent title={title} message={message} />,
    });
  };

  const onSearchClick = (q: string) => {
    setQ(q);
  };

  const onError = (type: FormType, title?: string, message?: string) => {
    updateToast(toastId.current[type], {
      status: "error",
      render: () => (
        <ToastComponent
          title={title}
          message={message}
          data-testid="toast-modal"
        />
      ),
    });
  };

  const onLoading = (type: FormType, title?: string, __?: string) => {
    toastId.current[type] = toast({
      status: "info",
      duration: 999999,
      render: () => <ToastComponent title={title} />,
    });
  };

  return (
    <>
      <h1 className={styles.pageTitle}>Dokumen</h1>
      <div className={styles.headerContainer}>
        <Popup
          popUpContent={
            <ul className={styles.addBtnOptions}>
              <li
                className={styles.addBtnOption}
                onClick={() => onOpen(DOC_TYPE.DIR)}
                data-testid="popup-dir-btn"
              >
                <RiFolderLine />
                Folder
              </li>
              <li
                className={styles.addBtnOption}
                onClick={() => onOpen(DOC_TYPE.FILE)}
                data-testid="popup-file-btn"
              >
                <RiFileLine />
                File
              </li>
            </ul>
          }
        >
          <Button
            colorScheme="green"
            leftIcon={<RiFileUploadFill />}
            data-testid="add-btn"
          >
            Tambah
          </Button>
        </Popup>
        <div className={styles.form}>
          <Input
            ref={inputRef}
            placeholder="..."
            onInput={debounce((e) => {
              onSearchClick((e.target as HTMLInputElement).value);
            }, 500)}
          />
          <Button
            colorScheme="green"
            leftIcon={<RiSearch2Line />}
            onClick={throttle(() => {
              onSearchClick(inputRef.current ? inputRef.current.value : "");
            }, 1000)}
          >
            Cari
          </Button>
        </div>
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
        ) : documentChildsQuery.data?.pages[0].data.documents.length === 0 ? (
          <EmptyMsg />
        ) : (
          <>
            <h3>
              Jumlah Total File: {documentChildsQuery.data?.pages[0].data.total}{" "}
              file
            </h3>
            {documentChildsQuery.data?.pages.map((page) => {
              return (
                <Fragment key={page.data.cursor}>
                  {page.data.documents.map((val) => {
                    const { id, type, url } = val;

                    const child = (
                      <DocListItem
                        document={val}
                        moreBtn={
                          <IconButton
                            className={styles.moreBtn}
                            onClick={(e) => onChipOptClick(val, e)}
                            data-testid="docs-detail-btn"
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
                  })}
                </Fragment>
              );
            })}
          </>
        )}
      </div>
      <Observe callback={debounce(observeCallback, 500)} />
      <Drawer isOpen={open} onClose={onClose} data-testid="doc-drawer">
        {open ? (
          docType === DOC_TYPE.FILE ? (
            tempData === null ? (
              <DocFileAddForm
                onCancel={() => onClose()}
                onSubmited={(type, title, message) =>
                  onModified(type, title, message)
                }
                onError={(type, title, message) =>
                  onError(type, title, message)
                }
                onLoading={(type, title, message) =>
                  onLoading(type, title, message)
                }
              />
            ) : (
              <DocFileEditForm
                prevData={tempData}
                onCancel={() => onClose()}
                onSubmited={(type, title, message) =>
                  onModified(type, title, message)
                }
                onError={(type, title, message) =>
                  onError(type, title, message)
                }
                onLoading={(type, title, message) =>
                  onLoading(type, title, message)
                }
              />
            )
          ) : tempData === null ? (
            <DocDirAddForm
              onCancel={() => onClose()}
              onSubmited={(type, title, message) =>
                onModified(type, title, message)
              }
              onError={(type, title, message) => onError(type, title, message)}
              onLoading={(type, title, message) =>
                onLoading(type, title, message)
              }
            />
          ) : (
            <DocDirEditForm
              prevData={tempData}
              onCancel={() => onClose()}
              onSubmited={(type, title, message) =>
                onModified(type, title, message)
              }
              onError={(type, title, message) => onError(type, title, message)}
              onLoading={(type, title, message) =>
                onLoading(type, title, message)
              }
            />
          )
        ) : (
          <></>
        )}
      </Drawer>
      <Toast {...props} />
    </>
  );
};

Organization.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Organization;
