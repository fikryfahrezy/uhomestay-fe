import type { UseQueryOptions } from "react-query";
import { useQuery } from "react-query";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export type DuesOut = {
  id: number;
  date: string;
  idr_amount: string;
};

type UseDuesQueryData = {
  data: {
    dues: DuesOut[];
  };
};

export const useDuesQuery = <D = UseDuesQueryData, E = FetchError>(
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    "duesQuery",
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues?limit=999`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export type AddDuesIn = {
  date: string;
  idr_amount: string;
};

export const addDues = async (data: AddDuesIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token ? token : ""}`,
      },
    }
  ).then((res) => {
    return res;
  });

  return fetched;
};

export type EditDuesIn = {
  date: string;
  idr_amount: string;
};

export const editDues = async (id: number, data: EditDuesIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        authorization: `Bearer ${token ? token : ""}`,
      },
    }
  ).then((res) => {
    return res;
  });

  return fetched;
};

export const removeDues = async (id: number) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/${id}`,
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

export type CheckPaidDuesRes = {
  is_paid: boolean;
};

type UseCheckPaidDuesQueryData = {
  data: CheckPaidDuesRes;
};

export const useCheckPaidDuesQuery = <
  D = UseCheckPaidDuesQueryData,
  E = FetchError
>(
  id: number,
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    ["checkPaidDuesQuery", id],
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/${id}/check`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};
