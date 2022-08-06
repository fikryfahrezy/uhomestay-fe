import type { ImageOut } from "@/services/images";
import type { GalleryAddModalType } from "@/layouts/galleryaddmodal";
import type { GalleryEditModalType } from "@/layouts/galleryeditmodal";
import { Fragment, useState, useRef, ReactElement } from "react";
import { RiGalleryUploadLine } from "react-icons/ri";
import { debounce } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import { useInfiniteImagesQuery } from "@/services/images";
import Button from "@/components/button";
import Toast, { useToast } from "@/components/toast";
import AdminLayout from "@/layouts/adminpage";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import GalleryAddModal from "@/layouts/galleryaddmodal";
import GalleryEditModal from "@/layouts/galleryeditmodal";
import GalleryItem from "@/layouts/galleryitem";
import ToastComponent from "@/layouts/toastcomponent";
import styles from "./Styles.module.css";

type FormType = GalleryAddModalType | GalleryEditModalType;

const Gallery = () => {
  const [isOpen, setOpen] = useState(false);
  const [tempData, setTempData] = useState<ImageOut | null>(null);

  const { toast, updateToast, props } = useToast();
  const toastId = useRef<{ [key in FormType]: number }>({
    add: 0,
    delete: 0,
  });

  const imagesQuery = useInfiniteImagesQuery({
    getPreviousPageParam: (firstPage) => firstPage.data.cursor || undefined,
    getNextPageParam: (lastPage) => lastPage.data.cursor || undefined,
  });

  const onOpen = () => {
    setOpen(true);
  };

  const onItemClick = (val: ImageOut) => {
    setTempData(val);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setTempData(null);
  };

  const onModified = (type: FormType, title?: string, message?: string) => {
    setOpen(false);
    setTempData(null);
    imagesQuery.refetch();

    updateToast(toastId.current[type], {
      status: "success",
      render: () => <ToastComponent title={title} message={message} />,
    });
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

  const observeCallback = () => {
    if (imagesQuery.hasNextPage) {
      imagesQuery.fetchNextPage();
    }
  };

  return (
    <>
      <Button
        colorScheme="green"
        leftIcon={<RiGalleryUploadLine />}
        className={styles.addBtn}
        onClick={() => onOpen()}
        data-testid="add-gallery-btn"
      >
        Unggah
      </Button>
      <h1 className={styles.pageTitle}>Galeri</h1>
      {imagesQuery.isLoading ? (
        "Loading..."
      ) : imagesQuery.error ? (
        <ErrMsg />
      ) : imagesQuery.data?.pages[0].data.images.length === 0 ? (
        <EmptyMsg />
      ) : (
        <>
          <h3>
            Jumlah Total Foto: {imagesQuery.data?.pages[0].data.total} foto
          </h3>
          <div className={styles.contentContainer}>
            {imagesQuery.data?.pages.map((page) => {
              return (
                <Fragment key={page.data.cursor}>
                  {page.data.images.map((image) => {
                    return (
                      <GalleryItem
                        key={image.id}
                        imgData={image}
                        onClick={() => onItemClick(image)}
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
      {isOpen ? (
        tempData === null ? (
          <GalleryAddModal
            isOpen={isOpen}
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
          <GalleryEditModal
            isOpen={isOpen}
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
      <Toast {...props} />
    </>
  );
};

Gallery.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Gallery;
