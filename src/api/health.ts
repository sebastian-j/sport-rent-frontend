import { request } from './client.ts';
import type { components } from './generated/schema.ts';

type HealthResponse = components['schemas']['HealthResponse'];

export const healthCheck = (): Promise<HealthResponse | undefined> =>
  request<HealthResponse>('/health');
