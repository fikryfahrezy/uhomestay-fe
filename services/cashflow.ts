import type { UseQueryOptions } from "react-query";
import { useQuery } from "react-query";
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
  total_cash: string;
  income_cash: string;
  outcome_cash: string;
  cursor: number;
  cashflows: CashflowOut[];
};

type UseBlogsQueryData = {
  data: CashflowRes;
};

export const useCashflowsQuery = <D = UseBlogsQueryData, E = FetchError>(
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    "cashflowsQuery",
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/cashflows`
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
