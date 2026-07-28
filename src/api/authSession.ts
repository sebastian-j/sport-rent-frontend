import type { Middleware } from 'openapi-fetch';

import type { components } from './generated/schema.ts';

type AccessTokenResponse = components['schemas']['AccessTokenResponse'];

const API_URL = import.meta.env.VITE_API_URL;
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

const accessTokenListeners = new Set<(token: string | null) => void>();

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  accessTokenListeners.forEach((listener) => listener(token));
};

export const subscribeToAccessToken = (listener: (token: string | null) => void) => {
  accessTokenListeners.add(listener);
  return () => {
    accessTokenListeners.delete(listener);
  };
};

const getCookie = (name: string) => {
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${encodeURIComponent(name)}=`));

  if (!cookie) return null;

  return decodeURIComponent(cookie.slice(cookie.indexOf('=') + 1));
};

export const getCsrfHeaders = (): HeadersInit => {
  const csrfToken = getCookie(CSRF_COOKIE_NAME);
  return csrfToken ? { [CSRF_HEADER_NAME]: csrfToken } : {};
};

const requestNewAccessToken = async () => {
  const csrfToken = getCookie(CSRF_COOKIE_NAME);

  if (!csrfToken) {
    setAccessToken(null);
    return null;
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { [CSRF_HEADER_NAME]: csrfToken },
  });

  if (response.status === 401 || response.status === 403) {
    setAccessToken(null);
    return null;
  }

  if (!response.ok) {
    throw new Error(`Refreshing the session failed with HTTP ${response.status}`);
  }

  const data = (await response.json()) as AccessTokenResponse;
  setAccessToken(data.access_token);
  return data.access_token;
};

export const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = requestNewAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

type RetryRequest = {
  request: Request;
  token: string;
};

const retryRequests = new Map<string, RetryRequest>();

export const authMiddleware: Middleware = {
  onRequest({ request, id }) {
    const token = getAccessToken();
    if (!token) return;

    const headers = new Headers(request.headers);
    headers.set('Authorization', `Bearer ${token}`);
    const authenticatedRequest = new Request(request, { headers });

    retryRequests.set(id, {
      request: authenticatedRequest.clone(),
      token,
    });

    return authenticatedRequest;
  },
  async onResponse({ response, schemaPath, options, id }) {
    const retry = retryRequests.get(id);
    retryRequests.delete(id);

    if (response.status !== 401 || !retry || schemaPath.startsWith('/auth/')) {
      return;
    }

    let token = getAccessToken();

    if (!token || token === retry.token) {
      token = await refreshAccessToken();
    }

    if (!token) return;

    const headers = new Headers(retry.request.headers);
    headers.set('Authorization', `Bearer ${token}`);

    return options.fetch(new Request(retry.request, { headers }));
  },
  onError({ error, id }) {
    retryRequests.delete(id);
    return error instanceof Error ? error : new Error('API request failed', { cause: error });
  },
};
