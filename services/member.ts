import type { UseQueryOptions } from "react-query";
import Router from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import User from "@/model/user";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export type MemberOut = {
  id: string;
  username: string;
  name: string;
  wa_phone: string;
  other_phone: string;
  homestay_name: string;
  homestay_address: string;
  homestay_latitude: string;
  homestay_longitude: string;
  profile_pic_url: string;
  is_admin: boolean;
  is_approved: boolean;
};

type UseMembersQueryData = {
  data: {
    cursor: string;
    members: MemberOut[];
  };
};

export const useMembersQuery = <D = UseMembersQueryData, E = FetchError>(
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    "membersQuery",
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/members`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export type MemberDetailRes = {
  id: string;
  name: string;
  username: string;
  wa_phone: string;
  other_phone: string;
  homestay_name: string;
  homestay_address: string;
  homestay_latitude: string;
  homestay_longitude: string;
  profile_pic_url: string;
  is_admin: boolean;
  is_approved: boolean;
  period_id: number;
  period: string;
  position_id: number;
  position: string;
};

type UseMemberDetailQueryData = {
  data: MemberDetailRes;
};

export const useMemberDetailQuery = <
  D = UseMemberDetailQueryData,
  E = FetchError
>(
  id: string,
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    ["memberDetailQuery", id],
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/members/${id}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export type AddMemberIn = {
  name: string;
  username: string;
  password: string;
  wa_phone: string;
  other_phone: string;
  homestay_name: string;
  homestay_address: string;
  homestay_latitude: string;
  homestay_longitude: string;
  is_admin: boolean;
  postion_id: number;
  period_id: number;
  file: FileList;
};

export const addMember = async (data: FormData) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/members`,
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

export type RegisterIn = {
  name: string;
  username: string;
  password: string;
  wa_phone: string;
  other_phone: string;
  homestay_name: string;
  homestay_address: string;
  homestay_latitude: string;
  homestay_longitude: string;
};

export const registerMember = async (data: RegisterIn) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson<{ data: { token: string } }>(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/register`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token ? token : ""}`,
      },
    }
  ).then((res) => {
    window.localStorage.setItem("mjwt", res.data.token);
  });

  return fetched;
};

export type EditMemberIn = {
  name: string;
  username: string;
  password: string;
  wa_phone: string;
  other_phone: string;
  homestay_name: string;
  homestay_address: string;
  homestay_latitude: string;
  homestay_longitude: string;
  is_admin: boolean;
  postion_id: number;
  period_id: number;
  file: FileList;
};

export const editMember = async (id: string, data: FormData) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/members/${id}`,
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

export const removeMember = async (id: string) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/members/${id}`,
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

export const approveMember = async (id: string) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/members/${id}`,
    {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token ? token : ""}`,
      },
    }
  ).then((res) => {
    return res;
  });

  return fetched;
};

export type LoginIn = {
  identifier: string;
  password: string;
};

export const memberLogin = async (data: LoginIn) => {
  const fetched = fetchJson<{ uid: string; token: string }>(
    "/api/login/member",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => {
    window.localStorage.setItem("muid", res.uid);
    window.localStorage.setItem("mjwt", res.token);
    return res;
  });

  return fetched;
};

export const adminLogin = async (data: LoginIn) => {
  const fetched = fetchJson<{ uid: string; token: string }>(
    "/api/login/admin",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => {
    window.localStorage.setItem("muid", res.uid);
    window.localStorage.setItem("ajwt", res.token);
    window.localStorage.setItem("mjwt", res.token);
    return res;
  });

  return fetched;
};

export const memberLogout = async () => {
  const fetched = fetchJson("/api/logout", {
    method: "POST",
  }).then((res) => {
    window.localStorage.removeItem("ajwt");
    window.localStorage.removeItem("mjwt");
    return res;
  });

  return fetched;
};

type UseUserProps = {
  redirectTo?: string;
  redirectIfFound?: boolean;
};

/**
 * Ref:
 * https://github.com/vercel/next.js/blob/canary/examples/with-iron-session/lib/useUser.ts
 *
 */
export const useMember = ({
  redirectTo = "",
  redirectIfFound = false,
}: UseUserProps = {}) => {
  const memberQuery = useQuery<User, FetchError>(
    "memberUserQuery",
    async () => {
      const fetcher = fetchJson<User>("/api/user/member");
      return fetcher;
    }
  );
  const { data: user } = memberQuery;

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      Router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo]);

  return memberQuery;
};

/**
 * Ref:
 * https://github.com/vercel/next.js/blob/canary/examples/with-iron-session/lib/useUser.ts
 *
 */
export const useAdmin = ({ redirectTo = "", redirectIfFound = false } = {}) => {
  const memberQuery = useQuery<User, FetchError>("adminUserQuery", async () => {
    const fetcher = fetchJson<User>("/api/user/admin");
    return fetcher;
  });
  const { data: user } = memberQuery;

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      Router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo]);

  return memberQuery;
};

export type UpdateMemberIn = {
  name: string;
  username: string;
  password: string;
  wa_phone: string;
  other_phone: string;
  homestay_name: string;
  homestay_address: string;
  homestay_latitude: string;
  homestay_longitude: string;
  file: FileList;
};

export const updateProfile = async (data: FormData) => {
  const token = window.localStorage.getItem("mjwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/members`,
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
