import type { UseQueryOptions } from "react-query";
import { useQuery } from "react-query";
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
  data: DocumentOut[];
};

export const useDocumentsQuery = <D = UseDocumentsQueryData, E = FetchError>(
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    "documentsQuery",
    async () => {
      const fetched = fetchJson<D>(
        "https://polar-badlands-14608.herokuapp.com/api/v1/documents"
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

type UseDocumentChildsQueryData = {
  data: DocumentOut[];
};

export const useDocumentChildsQuery = <
  D = UseDocumentChildsQueryData,
  E = FetchError
>(
  id: number,
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    ["documentChildQuery", id],
    async () => {
      const fetched = fetchJson<D>(
        `https://polar-badlands-14608.herokuapp.com/api/v1/documents/${id}`
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
    "https://polar-badlands-14608.herokuapp.com/api/v1/documents/dir",
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
    "https://polar-badlands-14608.herokuapp.com/api/v1/documents/file",
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
    `https://polar-badlands-14608.herokuapp.com/api/v1/documents/dir/${id}`,
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
    `https://polar-badlands-14608.herokuapp.com/api/v1/documents/file/${id}`,
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
    `https://polar-badlands-14608.herokuapp.com/api/v1/documents/${id}`,
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
