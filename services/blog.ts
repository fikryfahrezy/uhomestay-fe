import type { UseQueryOptions, UseInfiniteQueryOptions } from "react-query";
import { useQuery, useInfiniteQuery } from "react-query";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export type BlogOut = {
  id: number;
  title: string;
  short_desc: string;
  thumbnail_url: string;
  content: string;
  slug: string;
  created_at: string;
};

type UseBlogsQueryData = {
  data: {
    cursor: number;
    blogs: BlogOut[];
  };
};

export const useBlogsQuery = <D = UseBlogsQueryData, E = FetchError>(
  q: string,
  option?: UseInfiniteQueryOptions<D, E>
) => {
  const query = useInfiniteQuery<D, E>(
    ["blogsQuery", q],
    async ({ pageParam = 0 }) => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/blogs?q=${q}&cursor=${pageParam}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export type BlogRes = {
  id: number;
  title: string;
  short_desc: string;
  thumbnail_url: string;
  content: string;
  content_text: string;
  slug: string;
  created_at: string;
};

type UseFindBlobData = {
  data: BlogRes;
};

export const useFindBlog = <D = UseFindBlobData, E = FetchError>(
  id: number,
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    ["findBlog", id],
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/blogs/${id}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export type UploadImgIn = {
  file: FileList;
};

export const uploadImage = async (data: FormData) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson<{ data: { url: string } }>(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/blogs/image`,
    {
      method: "POST",
      body: data,
      headers: {
        authorization: `Bearer ${token ? token : ""}`,
      },
    }
  ).then((res) => {
    return res;
  });

  return fetched;
};

export type AddBlogIn = {
  title: string;
  short_desc: string;
  thumbnail_url: string;
  slug: string;
  content: string;
  content_text: string;
};

export const addBlog = async (data: AddBlogIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/blogs`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        authorization: `Bearer ${token ? token : ""}`,
        "Content-Type": "application/json",
      },
    }
  ).then((res) => {
    return res;
  });

  return fetched;
};

export type EditBlogIn = {
  title: string;
  short_desc: string;
  thumbnail_url: string;
  content: string;
  content_text: string;
};

export const editBlog = async (id: number, data: EditBlogIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/blogs/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        authorization: `Bearer ${token ? token : ""}`,
        "Content-Type": "application/json",
      },
    }
  ).then((res) => {
    return res;
  });

  return fetched;
};

export const removeBlog = (id: number) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/blogs/${id}`,
    {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token ? token : ""}`,
      },
    }
  ).then((res) => {
    return res;
  });

  return fetched;
};
