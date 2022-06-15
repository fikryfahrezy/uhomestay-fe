import type { ReactElement } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  RiDraftLine,
  RiArrowDownSLine,
  RiArrowRightLine,
  RiDeleteBin6Line,
  RiFileSettingsLine,
} from "react-icons/ri";
import { useBlogsQuery, removeBlog } from "@/services/blog";
import PopUp from "@/components/popup";
import LinkButton from "@/components/linkbutton";
import IconButton from "@/components/iconbutton";
import Toast, { useToast } from "@/components/toast";
import Modal from "@/layout/modal";
import ToastComponent from "@/layout/toastcomponent";
import AdminLayout from "@/layout/adminpage";
import EmptyMsg from "@/layout/emptymsg";
import BlogListItem from "@/layout/bloglistitem";
import ErrMsg from "@/layout/errmsg";
import styles from "./Styles.module.css";

const Blog = () => {
  const [blogId, setBlogId] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const blogsQuery = useBlogsQuery();
  const router = useRouter();
  const { toast, props } = useToast();

  const onDeleteBlog = (id: string) => {
    removeBlog(id)
      .then(() => {
        setBlogId("");
        setModalOpen(false);
        blogsQuery.refetch();
      })
      .catch((e) => {
        toast({
          status: "error",
          render: () => <ToastComponent title="Error" message={e.message} />,
        });
      });
  };

  const onConfirmDelete = (id: string) => {
    setBlogId(id);
    setModalOpen(true);
  };

  /**
   * @return {void}
   */
  const onCancelDelete = () => {
    setBlogId("");
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
      <div className={styles.contentContainer}>
        {blogsQuery.isLoading ? (
          "Loading..."
        ) : blogsQuery.error ? (
          <ErrMsg />
        ) : blogsQuery.data?.data.blogs.length === 0 ? (
          <EmptyMsg />
        ) : (
          blogsQuery.data?.data.blogs.map((blog) => {
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
                        <li>
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
                        <li>
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
                        >
                          <RiDeleteBin6Line />
                          Hapus
                        </li>
                      </ul>
                    }
                  >
                    <IconButton className={styles.cardBtn}>
                      <RiArrowDownSLine />
                    </IconButton>
                  </PopUp>
                }
              />
            );
          })
        )}
      </div>
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
