import { apiRequest } from './client';
import type { MbtiQuestionsResponse, MbtiResult } from './types';

export function fetchMbtiQuestions() {
  return apiRequest<MbtiQuestionsResponse>('/api/v1/mbti/questions');
}

export function fetchMbtiResult(counts: Record<string, number>) {
  return apiRequest<MbtiResult>('/api/v1/mbti/result', {
    method: 'POST',
    body: JSON.stringify({ counts }),
  });
}

export function fetchMbtiResultByPersona(personaKey: string) {
  return apiRequest<MbtiResult>(`/api/v1/mbti/result/${personaKey}`);
}
