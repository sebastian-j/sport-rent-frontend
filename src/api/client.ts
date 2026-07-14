const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const request = async <T>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    body?: unknown;
    timeoutMs?: number;
  } = {}
): Promise<T | undefined> => {
  const { method = 'GET', body, timeoutMs = 3000 } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const accessToken = localStorage.getItem('accessToken');

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new ApiError(res.status, res.statusText);
    }

    const text = await res.text();

    return text ? (JSON.parse(text) as T) : undefined;
  } finally {
    clearTimeout(timeout);
  }
};
