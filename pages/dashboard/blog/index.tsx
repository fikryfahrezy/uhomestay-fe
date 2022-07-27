import type { ReactElement } from "react";
import { useState, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import {
  RiDraftLine,
  RiArrowDownSLine,
  RiArrowRightLine,
  RiDeleteBin6Line,
  RiFileSettingsLine,
} from "react-icons/ri";
import { debounce } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import { useBlogsQuery, removeBlog } from "@/services/blog";
import PopUp from "cmnjg-sb/dist/popup";
import LinkButton from "cmnjg-sb/dist/linkbutton";
import IconButton from "cmnjg-sb/dist/iconbutton";
import Toast from "cmnjg-sb/dist/toast";
import useToast from "cmnjg-sb/dist/toast/useToast";
import Modal from "@/layouts/modal";
import ToastComponent from "@/layouts/toastcomponent";
import AdminLayout from "@/layouts/adminpage";
import EmptyMsg from "@/layouts/emptymsg";
import BlogListItem from "@/layouts/bloglistitem";
import ErrMsg from "@/layouts/errmsg";
import styles from "./Styles.module.css";

const Blog = () => {
  const [blogId, setBlogId] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);

  const blogsQuery = useBlogsQuery("", {
    getPreviousPageParam: (firstPage) => firstPage.data.cursor || undefined,
    getNextPageParam: (lastPage) => lastPage.data.cursor || undefined,
  });

  const router = useRouter();
  const { toast, updateToast, props } = useToast();

  const removeBlogMutation = useMutation<
    unknown,
    unknown,
    Parameters<typeof removeBlog>[0]
  >((id) => {
    return removeBlog(id);
  });

  const observeCallback = () => {
    if (blogsQuery.hasNextPage) {
      blogsQuery.fetchNextPage();
    }
  };

  const onDeleteBlog = (id: number) => {
    const lastId = toast({
      status: "info",
      duration: 999999,
      render: () => <ToastComponent title="Loading menghapus blog" />,
    });

    removeBlogMutation
      .mutateAsync(id)
      .then(() => {
        setBlogId(0);
        setModalOpen(false);
        updateToast(lastId, {
          status: "success",
          render: () => (
            <ToastComponent
              title="
				Sukses menghapus blog"
            />
          ),
        });
        blogsQuery.refetch();
      })
      .catch((e) => {
        updateToast(lastId, {
          status: "error",
          render: () => (
            <ToastComponent
              title="Error menghapus blog"
              message={e.message}
              data-testid="toast-modal"
            />
          ),
        });
      });
  };

  const onConfirmDelete = (id: number) => {
    setBlogId(id);
    setModalOpen(true);
  };

  /**
   * @return {void}
   */
  const onCancelDelete = () => {
    setBlogId(0);
    setModalOpen(false);
  };

  return (
    <>
      <Link href={`${router.pathname}/create`} passHref>
        <LinkButton
          colorScheme="green"
          leftIcon={<RiDraftLine />}
          className={styles.addBtn}
        >
          Buat
        </LinkButton>
      </Link>
      <h1 className={styles.pageTitle}>Blog</h1>
      {blogsQuery.isLoading ? (
        "Loading..."
      ) : blogsQuery.error ? (
        <ErrMsg />
      ) : blogsQuery.data?.pages[0].data.blogs.length === 0 ? (
        <EmptyMsg />
      ) : (
        <>
          <h3>
            Jumlah Total Blog: {blogsQuery.data?.pages[0].data.total} blog
          </h3>
          <div className={styles.contentContainer}>
            {blogsQuery.data?.pages.map((page) => {
              return (
                <Fragment key={page.data.cursor}>
                  {page.data.blogs.map((blog) => {
                    return (
                      <BlogListItem
                        key={blog.id}
                        blog={blog}
                        popUp={
                          <PopUp
                            popUpPosition="bottom-right"
                            className={styles.popup}
                            popUpContent={
                              <ul className={styles.addBtnOptions}>
                                <li data-testid="blog-detail-popup">
                                  <Link
                                    href={{
                                      pathname: `${router.pathname}/view/[id]`,
                                      query: { id: blog.id },
                                    }}
                                  >
                                    <a
                                      className={`${styles.addBtnOption} ${styles.optionLink}`}
                                    >
                                      <RiArrowRightLine />
                                      Lihat Detail
                                    </a>
                                  </Link>
                                </li>
                                <li data-testid="blog-edit-popup">
                                  <Link
                                    href={{
                                      pathname: `${router.pathname}/edit/[id]`,
                                      query: { id: blog.id },
                                    }}
                                  >
                                    <a
                                      className={`${styles.addBtnOption} ${styles.optionLink}`}
                                    >
                                      <RiFileSettingsLine />
                                      Ubah
                                    </a>
                                  </Link>
                                </li>
                                <li
                                  onClick={() => onConfirmDelete(blog.id)}
                                  className={`${styles.addBtnOption} ${styles.danger}`}
                                  data-testid="blog-remove-popup"
                                >
                                  <RiDeleteBin6Line />
                                  Hapus
                                </li>
                              </ul>
                            }
                          >
                            <IconButton
                              className={styles.cardBtn}
                              data-testid="blog-popup-btn"
                            >
                              <RiArrowDownSLine />
                            </IconButton>
                          </PopUp>
                        }
                      />
                    );
                  })}
                </Fragment>
              );
            })}
          </div>
        </>
      )}
      <Observe callback={debounce(observeCallback, 500)} />
      <Modal
        isOpen={isModalOpen}
        heading="Peringatan!"
        onCancel={() => onCancelDelete()}
        onConfirm={() => onDeleteBlog(blogId)}
      >
        <p>Apakah anda yakin ingin menghapus data yang dipilih?</p>
      </Modal>
      <Toast {...props} />
    </>
  );
};

Blog.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Blog;
