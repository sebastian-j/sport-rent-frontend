import createClient from 'openapi-fetch';

import { authMiddleware } from './authSession.ts';
import type { paths } from './generated/schema.ts';

const API_URL = import.meta.env.VITE_API_URL;

export const api = createClient<paths>({
  baseUrl: API_URL,
  credentials: 'include',
  querySerializer: (query) => {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
    return searchParams.toString();
  },
});

api.use(authMiddleware);
