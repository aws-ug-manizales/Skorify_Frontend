import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiError, ApiFailure, ApiResult, ApiSuccess } from './types';

const apiInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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

const toSuccess = <T>(response: AxiosResponse<T>): ApiSuccess<T> => ({
  success: true,
  data: response.data,
  status: response.status,
});

const toFailure = (error: AxiosError, status: number): ApiFailure => {
  const responseData = error.response?.data as Partial<ApiError> | undefined;

  const apiError: ApiError = {
    message: responseData?.message ?? error.message ?? 'Error desconocido',
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
