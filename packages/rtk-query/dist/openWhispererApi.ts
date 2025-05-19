import { baseSplitApi as api } from "../src/baseSplitApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    listSessions: build.query<ListSessionsApiResponse, ListSessionsApiArg>({
      query: () => ({ url: `/sessions` }),
    }),
    getSession: build.query<GetSessionApiResponse, GetSessionApiArg>({
      query: (queryArg) => ({ url: `/sessions/${queryArg}` }),
    }),
    deleteSession: build.mutation<
      DeleteSessionApiResponse,
      DeleteSessionApiArg
    >({
      query: (queryArg) => ({ url: `/sessions/${queryArg}`, method: "DELETE" }),
    }),
    uploadFile: build.mutation<UploadFileApiResponse, UploadFileApiArg>({
      query: (queryArg) => ({
        url: `/uploads`,
        method: "POST",
        body: queryArg,
      }),
    }),
    getTranscript: build.query<GetTranscriptApiResponse, GetTranscriptApiArg>({
      query: (queryArg) => ({
        url: `/transcript/{session_id`,
        params: {
          session_id: queryArg,
        },
      }),
    }),
    transcribeFile: build.mutation<
      TranscribeFileApiResponse,
      TranscribeFileApiArg
    >({
      query: (queryArg) => ({
        url: `/transcript/${queryArg.sessionId}`,
        method: "POST",
        params: {
          from_lang: queryArg.fromLang,
          to_lang: queryArg.toLang,
        },
      }),
    }),
    listTranscriptSupportedLanguages: build.query<
      ListTranscriptSupportedLanguagesApiResponse,
      ListTranscriptSupportedLanguagesApiArg
    >({
      query: () => ({ url: `/languages/transcript` }),
    }),
    listTranslateSupportedLanguages: build.query<
      ListTranslateSupportedLanguagesApiResponse,
      ListTranslateSupportedLanguagesApiArg
    >({
      query: () => ({ url: `/languages/translate` }),
    }),
    helloGet: build.query<HelloGetApiResponse, HelloGetApiArg>({
      query: () => ({ url: `/` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as openWhispererApi };
export type ListSessionsApiResponse = /** status 200 Successful Response */ any;
export type ListSessionsApiArg = void;
export type GetSessionApiResponse = /** status 200 Successful Response */ any;
export type GetSessionApiArg = string;
export type DeleteSessionApiResponse =
  /** status 200 Successful Response */ any;
export type DeleteSessionApiArg = string;
export type UploadFileApiResponse = /** status 200 Successful Response */ any;
export type UploadFileApiArg = BodyUploadFile;
export type GetTranscriptApiResponse =
  /** status 200 Successful Response */ any;
export type GetTranscriptApiArg = string;
export type TranscribeFileApiResponse =
  /** status 200 Successful Response */ any;
export type TranscribeFileApiArg = {
  sessionId: string;
  fromLang?: string;
  toLang?: string;
};
export type ListTranscriptSupportedLanguagesApiResponse =
  /** status 200 Successful Response */ LanguageResponse;
export type ListTranscriptSupportedLanguagesApiArg = void;
export type ListTranslateSupportedLanguagesApiResponse =
  /** status 200 Successful Response */ LanguageResponse;
export type ListTranslateSupportedLanguagesApiArg = void;
export type HelloGetApiResponse = /** status 200 Successful Response */ any;
export type HelloGetApiArg = void;
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type BodyUploadFile = {
  file: Blob;
  user_session_id?: string | null;
};
export type Language = {
  code: string;
  name: string;
};
export type LanguageResponse = {
  data: Language[];
};
export const {
  useListSessionsQuery,
  useGetSessionQuery,
  useDeleteSessionMutation,
  useUploadFileMutation,
  useGetTranscriptQuery,
  useTranscribeFileMutation,
  useListTranscriptSupportedLanguagesQuery,
  useListTranslateSupportedLanguagesQuery,
  useHelloGetQuery,
} = injectedRtkApi;
