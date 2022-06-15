import type { UseQueryOptions } from "react-query";
import { useQuery } from "react-query";
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
};

export type MemberDuesRes = {
  total_dues: string;
  paid_dues: string;
  unpaid_dues: string;
  cursor: number;
  dues: MemberDuesOut[];
};

type UseMemberDuesQueryData = {
  data: MemberDuesRes;
};

export const useMemberDuesQuery = <D = UseMemberDuesQueryData, E = FetchError>(
  id: string,
  option: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    ["memberDeusQuery", id],
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/members/${id}`
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
};

type UseMembersDuesQueryData = {
  data: {
    cursor: number;
    member_dues: MembersDuesOut[];
  };
};

export const useMembersDuesQuery = <
  D = UseMembersDuesQueryData,
  E = FetchError
>(
  id: number,
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    ["membersDeusQuery", id],
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/dues/${id}/members`
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
