import { request } from './client.ts';

type HealthResponse = {
  status: string;
};

export const healthCheck = (): Promise<HealthResponse | undefined> =>
  request<HealthResponse>('/health');
