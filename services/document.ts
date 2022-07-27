import type { UseQueryOptions, UseInfiniteQueryOptions } from "react-query";
import { useQuery, useInfiniteQuery } from "react-query";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export const DOC_TYPE = Object.freeze({
  FILE: "file",
  DIR: "dir",
});

export type DocumentOut = {
  id: number;
  name: string;
  type: string;
  url: string;
  dir_id: number;
  is_private: boolean;
};

type UseDocumentsQueryData = {
  data: {
    cursor: number;
    total: number;
    documents: DocumentOut[];
  };
};

export const useInfiniteDocumentsQuery = <
  D = UseDocumentsQueryData,
  E = FetchError
>(
  q: string,
  option?: UseInfiniteQueryOptions<D, E>
) => {
  const query = useInfiniteQuery<D, E>(
    ["documentsInfiniteQuery", q],
    async ({ pageParam = 0 }) => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents?q=${q}&cursor=${pageParam}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export const useDocumentsQuery = <D = UseDocumentsQueryData, E = FetchError>(
  q: string,
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    ["documentsQuery", q],
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents?q=${q}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export const useDocumentChildsQuery = <
  D = UseDocumentsQueryData,
  E = FetchError
>(
  id: number,
  q: string,
  option?: UseInfiniteQueryOptions<D, E>
) => {
  const query = useInfiniteQuery<D, E>(
    ["documentChildQuery", id, q],
    async ({ pageParam = 0 }) => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents/${id}?q=${q}&cursor=${pageParam}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export type AddDirDocumentIn = {
  name: string;
  dir_id: number;
  is_private: boolean;
};

export const addDirDocument = async (data: AddDirDocumentIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents/dir`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "applicaton/json",
        authorization: `Bearer ${token ? token : ""}`,
      },
    }
  ).then((res) => {
    return res;
  });

  return fetched;
};

export type AddFileDocumentIn = {
  file: FileList;
  dir_id: number;
  is_private: boolean;
};

export const addFileDocument = async (data: FormData) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents/file`,
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

export type EditDirDocumentIn = {
  name: string;
  is_private: boolean;
};

export const editDirDocument = async (id: number, data: EditDirDocumentIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents/dir/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "applicaton/json",
        authorization: `Bearer ${token ? token : ""}`,
      },
    }
  ).then((res) => {
    return res;
  });

  return fetched;
};

export type EditFileDocumentIn = {
  file: FileList;
  is_private: boolean;
};

export const editFileDocument = async (id: number, data: FormData) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents/file/${id}`,
    {
      method: "PUT",
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

export const removeDocument = async (id: number) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/documents/${id}`,
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
