import { openWhispererApi as api } from './generated/openWhispererApi';

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
    generateTranscript: {
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
