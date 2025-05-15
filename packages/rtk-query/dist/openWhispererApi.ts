import { baseSplitApi as api } from "../src/baseSplitApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSession: build.query<GetSessionApiResponse, GetSessionApiArg>({
      query: (queryArg) => ({ url: `/sessions/${queryArg.sessionId}` }),
    }),
    deleteSession: build.mutation<
      DeleteSessionApiResponse,
      DeleteSessionApiArg
    >({
      query: (queryArg) => ({
        url: `/sessions/${queryArg.sessionId}`,
        method: "DELETE",
      }),
    }),
    uploadFile: build.mutation<UploadFileApiResponse, UploadFileApiArg>({
      query: (queryArg) => ({
        url: `/uploads`,
        method: "POST",
        body: queryArg.bodyUploadFile,
      }),
    }),
    transcribeFile: build.mutation<
      TranscribeFileApiResponse,
      TranscribeFileApiArg
    >({
      query: (queryArg) => ({
        url: `/transcript/${queryArg.sessionId}`,
        method: "POST",
      }),
    }),
    extractAudioFromVideo: build.mutation<
      ExtractAudioFromVideoApiResponse,
      ExtractAudioFromVideoApiArg
    >({
      query: (queryArg) => ({
        url: `/transcript/${queryArg.sessionId}/extract`,
        method: "POST",
      }),
    }),
    getTranscriptSupportedLanguages: build.query<
      GetTranscriptSupportedLanguagesApiResponse,
      GetTranscriptSupportedLanguagesApiArg
    >({
      query: () => ({ url: `/transcript/languages` }),
    }),
    helloGet: build.query<HelloGetApiResponse, HelloGetApiArg>({
      query: () => ({ url: `/` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as openWhispererApi };
export type GetSessionApiResponse = /** status 200 Successful Response */ any;
export type GetSessionApiArg = {
  sessionId: string;
};
export type DeleteSessionApiResponse =
  /** status 200 Successful Response */ any;
export type DeleteSessionApiArg = {
  sessionId: string;
};
export type UploadFileApiResponse = /** status 200 Successful Response */ any;
export type UploadFileApiArg = {
  bodyUploadFile: BodyUploadFile;
};
export type TranscribeFileApiResponse =
  /** status 200 Successful Response */ any;
export type TranscribeFileApiArg = {
  sessionId: string;
};
export type ExtractAudioFromVideoApiResponse =
  /** status 200 Successful Response */ any;
export type ExtractAudioFromVideoApiArg = {
  sessionId: string;
};
export type GetTranscriptSupportedLanguagesApiResponse =
  /** status 200 Successful Response */ any;
export type GetTranscriptSupportedLanguagesApiArg = void;
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
