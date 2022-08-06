import type { UseQueryOptions, UseInfiniteQueryOptions } from "react-query";
import { useQuery, useInfiniteQuery } from "react-query";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export type ArticleOut = {
  id: number;
  title: string;
  short_desc: string;
  thumbnail_url: string;
  content: string;
  slug: string;
  created_at: string;
};

type UseArticlesQueryData = {
  data: {
    total: number;
    cursor: number;
    articles: ArticleOut[];
  };
};

export const useArticlesQuery = <D = UseArticlesQueryData, E = FetchError>(
  q: string,
  option?: UseInfiniteQueryOptions<D, E>
) => {
  const query = useInfiniteQuery<D, E>(
    ["articlesQuery", q],
    async ({ pageParam = 0 }) => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/articles?q=${q}&cursor=${pageParam}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export type ArticleRes = {
  id: number;
  title: string;
  short_desc: string;
  thumbnail_url: string;
  content: string;
  content_text: string;
  slug: string;
  created_at: string;
};

type UseFindArticleData = {
  data: ArticleRes;
};

export const useFindArticle = <D = UseFindArticleData, E = FetchError>(
  id: number,
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    ["findArticle", id],
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/articles/${id}`
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
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/articles/image`,
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

export type AddArticleIn = {
  title: string;
  short_desc: string;
  thumbnail_url: string;
  slug: string;
  content: string;
  content_text: string;
};

export const addArticle = async (data: AddArticleIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/articles`,
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

export type EditArticleIn = {
  title: string;
  short_desc: string;
  thumbnail_url: string;
  content: string;
  content_text: string;
};

export const editArticle = async (id: number, data: EditArticleIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/articles/${id}`,
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

export const removeArticle = (id: number) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/articles/${id}`,
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
