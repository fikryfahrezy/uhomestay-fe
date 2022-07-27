import type { UseInfiniteQueryOptions, UseQueryOptions } from "react-query";
import { useInfiniteQuery, useQuery } from "react-query";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export const DUES_STATUS = Object.freeze({
  PAID: "paid",
  WAITING: "waiting",
  UNPAID: "unpaid",
});

export type MemberDuesOut = {
  date: string;
  dues_id: number;
  id: number;
  idr_amount: string;
  prove_file_url: string;
  status: string;
  pay_date: string;
};

export type MemberDuesRes = {
  total_dues: string;
  paid_dues: string;
  unpaid_dues: string;
  cursor: number;
  total: number;
  dues: MemberDuesOut[];
};

type UseMemberDuesQueryData = {
  data: MemberDuesRes;
};

export const useInfiniteMemberDuesQuery = <
  D = UseMemberDuesQueryData,
  E = FetchError
>(
  id: string,
  option: UseInfiniteQueryOptions<D, E>
) => {
  const query = useInfiniteQuery<D, E>(
    ["memberDeusInfiniteQuery", id],
    async ({ pageParam = 0 }) => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/members/${id}?cursor=${pageParam}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export const useMemberDuesQuery = <D = UseMemberDuesQueryData, E = FetchError>(
  id: string,
  option: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    ["memberDeusQuery", id],
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/members/${id}?limit=999`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export type PayMemberDuesIn = {
  file: FileList;
};

export const payDues = async (id: number, data: FormData) => {
  const token = window.localStorage.getItem("mjwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/members/monthly/${id}`,
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

export type MembersDuesOut = {
  id: number;
  member_id: string;
  status: string;
  name: string;
  profile_pic_url: string;
  pay_date: string;
};

type UseMembersDuesQueryData = {
  data: {
    dues_id: number;
    cursor: number;
    total: number;
    dues_date: string;
    dues_amount: string;
    paid_dues: string;
    unpaid_dues: string;
    member_dues: MembersDuesOut[];
  };
};

export const useInfiniteMembersDuesQuery = <
  D = UseMembersDuesQueryData,
  E = FetchError
>(
  id: number,
  option?: UseInfiniteQueryOptions<D, E>
) => {
  const query = useInfiniteQuery<D, E>(
    ["membersDeusInfiniteQuery", id],
    async ({ pageParam = 0 }) => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/${id}/members?cursor=${pageParam}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export const useMembersDuesQuery = <
  D = UseMembersDuesQueryData,
  E = FetchError
>(
  id: number,
  startDate: string,
  endDate: string,
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    ["membersDeusQuery", id],
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/${id}/members?limit=999&start_date=${startDate}&end_date=${endDate}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export type EditMemberDuesIn = {
  file: FileList;
};

export const editDues = async (id: number, data: FormData) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/members/monthly/${id}`,
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

export type PaidDuesIn = {
  is_paid: boolean;
};

export const paidDues = async (id: number, data: PaidDuesIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/members/monthly/${id}`,
    {
      method: "PATCH",
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
