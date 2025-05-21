import { baseSplitApi as api } from "../baseSplitApi";
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
      query: (queryArg) => ({ url: `/transcripts/${queryArg}` }),
    }),
    generateTranscript: build.mutation<
      GenerateTranscriptApiResponse,
      GenerateTranscriptApiArg
    >({
      query: (queryArg) => ({
        url: `/transcripts/${queryArg.sessionId}`,
        method: "POST",
        params: {
          from_lang: queryArg.fromLang,
          to_lang: queryArg.toLang,
        },
      }),
    }),
    updateTranscript: build.mutation<
      UpdateTranscriptApiResponse,
      UpdateTranscriptApiArg
    >({
      query: (queryArg) => ({
        url: `/transcripts/${queryArg}`,
        method: "PATCH",
      }),
    }),
    applySubtitles: build.mutation<
      ApplySubtitlesApiResponse,
      ApplySubtitlesApiArg
    >({
      query: (queryArg) => ({
        url: `/transcripts/${queryArg.sessionId}/apply`,
        method: "POST",
        params: {
          lang: queryArg.lang,
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
    sayHello: build.query<SayHelloApiResponse, SayHelloApiArg>({
      query: () => ({ url: `/` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
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
export type GenerateTranscriptApiResponse =
  /** status 200 Successful Response */ any;
export type GenerateTranscriptApiArg = {
  sessionId: string;
  fromLang?: string;
  toLang?: string;
};
export type UpdateTranscriptApiResponse =
  /** status 200 Successful Response */ any;
export type UpdateTranscriptApiArg = string;
export type ApplySubtitlesApiResponse =
  /** status 200 Successful Response */ any;
export type ApplySubtitlesApiArg = {
  sessionId: string;
  lang?: string;
};
export type ListTranscriptSupportedLanguagesApiResponse =
  /** status 200 Successful Response */ LanguageResponse;
export type ListTranscriptSupportedLanguagesApiArg = void;
export type ListTranslateSupportedLanguagesApiResponse =
  /** status 200 Successful Response */ LanguageResponse;
export type ListTranslateSupportedLanguagesApiArg = void;
export type SayHelloApiResponse = /** status 200 Successful Response */ any;
export type SayHelloApiArg = void;
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
  useGenerateTranscriptMutation,
  useUpdateTranscriptMutation,
  useApplySubtitlesMutation,
  useListTranscriptSupportedLanguagesQuery,
  useListTranslateSupportedLanguagesQuery,
  useSayHelloQuery,
} = injectedRtkApi;
