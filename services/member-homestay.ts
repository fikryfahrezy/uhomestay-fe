import type { UseQueryOptions, UseInfiniteQueryOptions } from "react-query";
import { useQuery, useInfiniteQuery } from "react-query";
import fetchJson, { FetchError } from "@/lib/fetchJson";

export type AddHomestayImageIn = {
  file: FileList;
};

export type AddHomestayImageRes = {
  data: {
    id: number;
    url: string;
  };
};

export const uploadHomestayImage = async (data: FormData) => {
  const token = window.localStorage.getItem("mjwt");
  const fetched = fetchJson<AddHomestayImageRes>(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/homestays/images`,
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

export const removeHomestayImage = (id: number) => {
  const token = window.localStorage.getItem("mjwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/homestays/images/${id}`,
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

export const removeHomestay = (id: number, uid: string) => {
  const token = window.localStorage.getItem("mjwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/homestays/${id}/${uid}`,
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

export type AddMemberHomestayIn = {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  image_ids: number[];
};

export const addHomestay = async (uid: string, data: AddMemberHomestayIn) => {
  const token = window.localStorage.getItem("mjwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/homestays/${uid}`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        authorization: `Bearer ${token ? token : ""}`,
        "Content-Type": "application/json",
      },
    }
  ).then((res) => {
    return res;
  });

  return fetched;
};

export type EditMemberHomestayIn = {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  image_ids: number[];
};

export const editHomestay = async (
  id: number,
  uid: string,
  data: EditMemberHomestayIn
) => {
  const token = window.localStorage.getItem("mjwt");
  const fetched = fetchJson(
    `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/homestays/${id}/${uid}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        authorization: `Bearer ${token ? token : ""}`,
        "Content-Type": "application/json",
      },
    }
  ).then((res) => {
    return res;
  });

  return fetched;
};

export type MemberHomestaysRes = {
  id: number;
  name: string;
  address: string;
  thumbnail_url: string;
};

type QueryMemberHomestayRes = {
  data: {
    total: number;
    cursor: number;
    member_homestays: MemberHomestaysRes[];
  };
};

export const useHomestaysQuery = <D = QueryMemberHomestayRes, E = FetchError>(
  uid: string,
  option?: UseInfiniteQueryOptions<D, E>
) => {
  const query = useInfiniteQuery<D, E>(
    ["homestaysQuery", uid],
    async ({ pageParam = 0 }) => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/homestays/${uid}/list?cursor=${pageParam}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};

export type HomestayImageRes = {
  id: number;
  url: string;
};

export type MemberHomestayRes = {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  images: HomestayImageRes[];
};

type UseFindHomestayData = {
  data: MemberHomestayRes;
};

export const useFindHomestay = <D = UseFindHomestayData, E = FetchError>(
  id: number,
  uid: string,
  option?: UseQueryOptions<D, E>
) => {
  const query = useQuery<D, E>(
    ["findHomestay", id, uid],
    async () => {
      const fetched = fetchJson<D>(
        `${process.env.NEXT_PUBLIC_MAIN_API_HOST_URL}/api/v1/homestays/${id}/${uid}`
      ).then((res) => {
        return res;
      });

      return fetched;
    },
    option
  );

  return query;
};
