import { API_BASE_URL } from '../config/api';
import type { ApiErrorBody } from './types';

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiResponse<T> = { data: T };

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  const json = (await res.json()) as ApiResponse<T> | ApiErrorBody;

  if (!res.ok) {
    const err = json as ApiErrorBody;
    throw new ApiError(
      err.error?.code ?? 'UNKNOWN',
      err.error?.message ?? '요청에 실패했습니다.',
      res.status,
    );
  }

  return (json as ApiResponse<T>).data;
}
