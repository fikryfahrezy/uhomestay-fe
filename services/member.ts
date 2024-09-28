import type { UseQueryOptions, UseInfiniteQueryOptions } from "react-query";
import type { UserProp } from "@/model/user";
import Router from "next/router";
import { useEffect } from "react";
import { useQuery, useInfiniteQuery } from "react-query";
import User from "@/model/user";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export type MemberOut = {
  id: string;
  username: string;
  name: string;
  wa_phone: string;
  other_phone: string;
  profile_pic_url: string;
  is_admin: boolean;
  is_approved: boolean;
};

type UseMembersQueryData = {
  data: {
    total: number;
    cursor: string;
    members: MemberOut[];
  };
};

export const useMembersQuery = <D = UseMembersQueryData, E = FetchError>(
  q: string,
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    ["membersQuery", q],
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/members?q=${q}&limit=999`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export const useInfiniteMembersQuery = <
  D = UseMembersQueryData,
  E = FetchError
>(
  q: string,
  option?: UseInfiniteQueryOptions<D, E>
) => {
  const query = useInfiniteQuery<D, E>(
    ["membersInfiniteQuery", q],
    async ({ pageParam = "" }) => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/members?q=${q}&cursor=${pageParam}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export type MemberPosition = {
  id: number;
  level: number;
  name: string;
};

export type MemberDetailRes = {
  id: string;
  name: string;
  username: string;
  wa_phone: string;
  other_phone: string;
  profile_pic_url: string;
  id_card_url: string;
  is_admin: boolean;
  is_approved: boolean;
  period_id: number;
  period: string;
  positions: MemberPosition[];
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
  is_admin: boolean;
  postion_id: number;
  period_id: number;
  profile: FileList;
  id_card: FileList;
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
  homestay_photo: FileList;
  profile: FileList;
  id_card: FileList;
};

export const registerMember = async (data: FormData) => {
  const token = window.localStorage.getItem("ajwt");
  const fetched = fetchJson<{ data: { token: string } }>(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/register`,
    {
      method: "POST",
      body: data,
      headers: {
        authorization: `Bearer ${token ? token : ""}`,
      },
    }
  );

  return fetched;
};

export type EditMemberIn = {
  name: string;
  username: string;
  password: string;
  wa_phone: string;
  other_phone: string;
  is_admin: boolean;
  postion_id: number;
  period_id: number;
  profile: FileList;
  id_card: FileList;
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
    window.localStorage.removeItem("muid");
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
  const memberQuery = useQuery<UserProp, FetchError>(
    "memberUserQuery",
    async () => {
      const fetcher = fetchJson<UserProp>("/api/user/member");
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
  const memberQuery = useQuery<UserProp, FetchError>(
    "adminUserQuery",
    async () => {
      const fetcher = fetchJson<UserProp>("/api/user/admin");
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

export type UpdateProfileIn = {
  name: string;
  username: string;
  password: string;
  wa_phone: string;
  other_phone: string;
  profile: FileList;
  id_card: FileList;
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

/**
 * Ref:
 * https://github.com/vercel/next.js/blob/canary/examples/with-iron-session/lib/useUser.ts
 *
 */
export const useUser = ({
  redirectTo = "",
  identifier = "",
  url = "/api/get-jwt/user",
  redirectIfFound = false,
  enabled = false,
}: UseUserProps & {
  identifier?: string;
  enabled?: boolean;
  url?: string;
} = {}) => {
  const memberQuery = useQuery<User, FetchError>(
    "userUserQuery",
    async () => {
      const fetcher = fetchJson<User>(url, {
        method: "POST",
        body: JSON.stringify({ identifier }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return fetcher;
    },
    {
      enabled,
      retry: false,
    }
  );
  const { data, error } = memberQuery;

  useEffect(() => {
    if (error !== null) {
      Router.push("/");
      return;
    }

    let newRedirectTo: string = redirectTo || "/member";

    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!newRedirectTo || !data) return;

    const user = data.prop;

    if (user.isAdmin) {
      newRedirectTo = "/dashboard";
    }

    if (
      // If redirectTo is set, redirect if the user was not found.
      (newRedirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      window.localStorage.setItem("muid", user.uid);
      window.localStorage.setItem("mjwt", user.token);
      if (user.isAdmin) {
        window.localStorage.setItem("ajwt", user.token);
      }

      Router.push(newRedirectTo);
    }
  }, [data, error, redirectIfFound, redirectTo]);

  return memberQuery;
};
