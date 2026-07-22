import { api } from './client.ts';

export const healthCheck = () => api.GET('/health');
