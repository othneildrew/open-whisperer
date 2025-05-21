import { api as rawApi } from "./generated/openWhispererApi";

const enhancedOpenWhispererApi = rawApi.enhanceEndpoints({
  addTagTypes: ["Session", "Transcript", "Language"],
  endpoints: {
    listSessions: {
      providesTags: ["Session"],
    },
    getSession: {
      providesTags: ["Session"],
    },
    deleteSession: {
      invalidatesTags: ["Session"],
    },
    getTranscript: {
      providesTags: ["Transcript"],
    },
    generateTranscript: {
      invalidatesTags: ["Transcript", "Session"],
    },
    listTranscriptSupportedLanguages: {
      providesTags: ["Language"],
    },
    listTranslateSupportedLanguages: {
      providesTags: ["Language"],
    },
    uploadFile: {
      invalidatesTags: ["Session"],
    },
    applySubtitles: {
      invalidatesTags: ["Session"],
    }
  },
});

// Debug flag to ensure correct api being exported
(enhancedOpenWhispererApi as any).__isEnhanced = true;

// Export "api" with same name as generated one
export const api = enhancedOpenWhispererApi;

/**
 * Re-export everything (for hooks/types), since api is already exported,
 * it shouldn't be overwritten. This pattern will work because the enhanced
 * api's middleware gets registered and the hooks should be able to be used
 * without explicitly having to call "api.useHook," "useHook" should work
 * fine with proper cache invalidation.
 */
export * from "./generated/openWhispererApi";
