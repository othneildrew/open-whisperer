import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

// Empty api service that we'll inject endpoints into later as needed
export const baseSplitApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl }) as BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  >,
  endpoints: () => ({}),
  tagTypes: ["Session", "Transcript", "Language"],
});
