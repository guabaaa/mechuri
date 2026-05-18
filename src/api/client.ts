import { API_BASE_URL } from '../config/api';
import { getAuthToken } from './authToken';
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
  const token = getAuthToken();
  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError(
      'NETWORK',
      __DEV__
        ? `서버에 연결할 수 없어요. yarn server 실행 및 API(${API_BASE_URL})를 확인해 주세요.`
        : '서버에 연결할 수 없어요. 네트워크를 확인해 주세요.',
      0,
    );
  }

  let json: ApiResponse<T> | ApiErrorBody;
  try {
    const text = await res.text();
    json = text
      ? (JSON.parse(text) as ApiResponse<T> | ApiErrorBody)
      : ({ error: { code: 'EMPTY', message: '응답이 비어 있어요.' } } as ApiErrorBody);
  } catch {
    throw new ApiError(
      'PARSE_ERROR',
      '서버 응답을 읽지 못했어요.',
      res.status,
    );
  }

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
