import { openWhispererApi as api } from '../dist/openWhispererApi';

export const enhancedOpenWhispererApi = api.enhanceEndpoints({
  addTagTypes: ['Session', 'Transcript', 'Language'],
  endpoints: {
    listSessions: {
      providesTags: ['Session'],
    },
    getSession: {
      providesTags: ['Session'],
    },
    deleteSession: {
      invalidatesTags: ['Session'],
    },
    getTranscript: {
      providesTags: ['Transcript'],
    },
    transcribeFile: {
      invalidatesTags: ['Transcript', 'Session'],
    },
    listTranscriptSupportedLanguages: {
      providesTags: ['Language'],
    },
    listTranslateSupportedLanguages: {
      providesTags: ['Language'],
    },
  }
});
