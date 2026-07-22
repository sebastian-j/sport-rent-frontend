import createClient from 'openapi-fetch';

import type { paths } from './generated/schema.ts';

const API_URL = import.meta.env.VITE_API_URL;

export const api = createClient<paths>({ baseUrl: API_URL, credentials: 'include' });
