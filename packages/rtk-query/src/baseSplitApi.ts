import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:8000';

// Empty api service that we'll inject endpoints into later as needed
export const baseSplitApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: () => ({}),
  tagTypes: ['sessions'],
})
