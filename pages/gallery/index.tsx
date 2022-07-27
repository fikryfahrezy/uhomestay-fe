import { Fragment } from "react";
import { debounce } from "@/lib/perf";
import Observe from "@/lib/use-observer";
import { useInfiniteImagesQuery } from "@/services/images";
import EmptyMsg from "@/layouts/emptymsg";
import ErrMsg from "@/layouts/errmsg";
import GalleryListItem from "@/layouts/gallerylistitem";
import PageNav from "@/layouts/pagenav";
import styles from "./Styles.module.css";

const Gallery = () => {
  const imagesQuery = useInfiniteImagesQuery({
    getPreviousPageParam: (firstPage) => firstPage.data.cursor || undefined,
    getNextPageParam: (lastPage) => lastPage.data.cursor || undefined,
  });

  const observeCallback = () => {
    if (imagesQuery.hasNextPage) {
      imagesQuery.fetchNextPage();
    }
  };

  return (
    <>
      <PageNav />
      <div className={styles.pageWrapper}>
        <h2 className={styles.subTitle}>
          <a id="gallery">Galeri</a>
        </h2>
        <main className={styles.galleryContainer}>
          {imagesQuery.isLoading ? (
            "Loading..."
          ) : imagesQuery.error ? (
            <ErrMsg />
          ) : imagesQuery.data?.pages[0].data.images.length === 0 ? (
            <EmptyMsg />
          ) : (
            imagesQuery.data?.pages.map((page) => {
              return (
                <Fragment key={page.data.cursor}>
                  {page.data.images.map((image) => {
                    return <GalleryListItem key={image.id} imgData={image} />;
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

export default Gallery;
