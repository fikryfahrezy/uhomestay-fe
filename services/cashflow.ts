import type { UseInfiniteQueryOptions, UseQueryOptions } from "react-query";
import { useInfiniteQuery, useQuery } from "react-query";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export const CASHFLOW_TYPE = Object.freeze({
  INCOME: "income",
  OUTCOME: "outcome",
});

export type CashflowOut = {
  id: number;
  date: string;
  note: string;
  type: string;
  idr_amount: string;
  prove_file_url: string;
};

export type CashflowRes = {
  cursor: number;
  cashflows: CashflowOut[];
};

type UseBlogsQueryData = {
  data: CashflowRes;
};

export const useInfiniteCashflowsQuery = <
  D = UseBlogsQueryData,
  E = FetchError
>(
  option?: UseInfiniteQueryOptions<D, E>
) => {
  const query = useInfiniteQuery<D, E>(
    "cashflowsInfiniteQuery",
    async ({ pageParam = 0 }) => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/cashflows?cursor=${pageParam}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export const useCashflowsQuery = <D = UseBlogsQueryData, E = FetchError>(
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    "cashflowsQuery",
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/cashflows?limit=999`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export type AddCashflowIn = {
  date: string;
  idr_amount: string;
  type: string;
  note: string;
  file: FileList;
};

export const addCashflow = async (data: FormData) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/cashflows`,
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

export type EditCashflowIn = {
  date: string;
  idr_amount: string;
  type: string;
  note: string;
  file: FileList;
};

export const editCashflow = async (id: number, data: FormData) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/cashflows/${id}`,
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

export const removeCashflow = (id: number) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/cashflows/${id}`,
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

type CashflowStatsRes = {
  income_total: number;
  outcome_total: number;
  total_cash: string;
  income_cash: string;
  outcome_cash: string;
};

type UseCashflowStatsQueryData = {
  data: CashflowStatsRes;
};

export const useCashflowStatsQuery = <
  D = UseCashflowStatsQueryData,
  E = FetchError
>(
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    "cashflowStatsQuery",
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/cashflows/stats`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};
