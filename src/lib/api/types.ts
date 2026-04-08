export interface ApiSuccess<T> {
  success: true;
  data: T;
  status: number;
}

export interface ApiError {
  message: string;
  code: string | number;
  details?: Record<string, string[]>;
}

export interface ApiFailure {
  success: false;
  error: ApiError;
  status: number;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export interface BackendEnvelope<T> {
  data: T;
  message?: string;
}
