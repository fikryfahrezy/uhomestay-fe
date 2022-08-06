import type { MemberHomestaysRes } from "@/services/member-homestay";
import BlogListItem from "@/layouts/bloglistitem";
import styles from "./Styles.module.css";

const defaultFunc = () => {};

type HomestayItemProps = {
  homestayData: MemberHomestaysRes;
  onClick?: (homestayData: MemberHomestaysRes) => void;
};

const GalleryItem = ({
  homestayData,
  onClick = defaultFunc,
}: HomestayItemProps) => {
  const { id, name, thumbnail_url: url } = homestayData;

  return (
    <div
      className={styles.cardContent}
      onClick={() => onClick(homestayData)}
      data-testid="homestay-card-container"
    >
      <BlogListItem
        blog={{
          id,
          title: name,
          thumbnail_url: url,
          content: "",
          created_at: "",
          short_desc: "",
          slug: "",
        }}
      />
    </div>
  );
};

export default GalleryItem;
