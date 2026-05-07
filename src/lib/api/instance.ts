import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { env } from '@lib/env';
import type { ApiError, ApiFailure, ApiResult, ApiSuccess } from './types';
import {
  getSkorifyErrorTranslationKey,
  isDomainErrorCode,
  isSkorifyEnvelope,
  stripControllerPrefix,
} from './skorify-events';

const apiInstance: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

/**
 * Builds the `ApiError`-shaped payload that the interceptor injects into
 * `error.response.data` so `toFailure` can pick it up. The user-facing copy
 * is resolved later at the React layer via `useApiErrorMessage`, which reads
 * `error.code` and falls back to `details.translationKey`.
 *
 * `T` is the original event payload; we serialize it into `details.payload`
 * for debugging without losing its shape at the call site.
 */
const buildSkorifyError = <T>(
  bareCode: string,
  payload?: T,
  technicalMessage?: string,
): ApiError => ({
  message: technicalMessage ?? bareCode,
  code: bareCode,
  details: {
    translationKey: [getSkorifyErrorTranslationKey(bareCode)],
    ...(payload !== undefined && payload !== null ? { payload: [JSON.stringify(payload)] } : {}),
  },
});

apiInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Iraca always returns 200 for both success and "domain-error" outcomes.
    // Detect the envelope shape and reject when the meta.code matches a known
    // domain-error event so consumers fall through the standard ApiFailure path.
    const envelope = response.data;
    if (isSkorifyEnvelope(envelope)) {
      const bareCode = stripControllerPrefix(envelope.meta.code);
      if (isDomainErrorCode(bareCode)) {
        const error = new AxiosError(bareCode, bareCode, response.config, response.request, {
          ...response,
          data: buildSkorifyError(bareCode, envelope.data),
        });
        return Promise.reject(error);
      }
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/auth';
      }
    }

    // Normalize iraca-shape error envelopes that arrived with a non-2xx status
    // (e.g. NotValidParams → 400) into the ApiError shape `toFailure` expects.
    const responseData = error.response?.data;
    if (responseData && typeof responseData === 'object' && 'meta' in responseData) {
      const meta = (responseData as { meta?: { code?: string; message?: string } }).meta;
      if (meta && typeof meta.code === 'string') {
        const bareCode = stripControllerPrefix(meta.code);
        error.response!.data = buildSkorifyError(bareCode, undefined, meta.message);
      }
    }

    return Promise.reject(error);
  },
);

const toSuccess = <T>(response: AxiosResponse<T>): ApiSuccess<T> => ({
  success: true,
  data: response.data,
  status: response.status,
});

const toFailure = (error: AxiosError, status: number): ApiFailure => {
  const responseData = error.response?.data as Partial<ApiError> | undefined;

  const apiError: ApiError = {
    message: responseData?.message ?? error.message ?? '',
    code: responseData?.code ?? error.code ?? error.response?.status ?? 0,
    details: responseData?.details,
  };

  return { success: false, error: apiError, status };
};

const request = async <T>(fn: () => Promise<AxiosResponse<T>>): Promise<ApiResult<T>> => {
  try {
    const response = await fn();
    return toSuccess(response);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return toFailure(err, err.response?.status ?? 0);
    }
    return {
      success: false,
      error: { message: String(err), code: 'UNKNOWN' },
      status: 0,
    };
  }
};

export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) =>
    request<T>(() => apiInstance.get<T>(url, { params })),

  post: <T, B = Record<string, unknown>>(url: string, body?: B) =>
    request<T>(() => apiInstance.post<T>(url, body)),

  put: <T, B = Record<string, unknown>>(url: string, body?: B) =>
    request<T>(() => apiInstance.put<T>(url, body)),

  patch: <T, B = Record<string, unknown>>(url: string, body?: B) =>
    request<T>(() => apiInstance.patch<T>(url, body)),

  delete: <T>(url: string) => request<T>(() => apiInstance.delete<T>(url)),
};

export default apiInstance;
