import type { UseInfiniteQueryOptions } from "react-query";
import { useInfiniteQuery } from "react-query";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export type ImageOut = {
  id: number;
  name: string;
  url: string;
  description: string;
};

type UseInfiniteImagesQueryData = {
  data: {
    cursor: number;
    total: number;
    images: ImageOut[];
  };
};

export const useInfiniteImagesQuery = <
  D = UseInfiniteImagesQueryData,
  E = FetchError
>(
  option?: UseInfiniteQueryOptions<D, E>
) => {
  const query = useInfiniteQuery<D, E>(
    ["imagesInfiniteQuery"],
    async ({ pageParam = 0 }) => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/images?cursor=${pageParam}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

type AddFileDocumentIn = {
  description: string;
  file: FileList;
};

export const addImage = async (data: FormData) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/images`,
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

export const removeImage = async (id: number) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/images/${id}`,
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
