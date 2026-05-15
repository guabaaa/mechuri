import { NextFunction, Request, Response } from 'express';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    });
    return;
  }

  if (err instanceof Error && err.message === 'INVALID_BIRTHDAY') {
    res.status(400).json({
      error: {
        code: 'INVALID_BIRTHDAY',
        message: '올바른 생년월일을 입력해 주세요.',
      },
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: '서버 오류가 발생했습니다.' },
  });
}
