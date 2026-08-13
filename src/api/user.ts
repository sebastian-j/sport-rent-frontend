import type { PersonalData } from '../features/profile/account/PersonalDataForm.tsx';
import { api } from './client.ts';
import type { components, paths } from './generated/schema.ts';

export type OrderDetailResponse = components['schemas']['OrderDetailResponse'];
export type UserHistoryQuery = NonNullable<paths['/user/history']['get']['parameters']['query']>;
export const getUser = () => api.GET('/user');

export const getUserHistory = (query: UserHistoryQuery = {}) =>
  api.GET('/user/history', {
    params: { query },
  });

export const getOrderDetails = (orderId: number) =>
  api.GET('/user/history/{order_id}', {
    params: { path: { order_id: orderId } },
  });

export const updatePersonalAddress = (data: PersonalData) =>
  api.PATCH('/user/address', {
    body: {
      first_name: data.firstName,
      last_name: data.lastName,
      country: data.country,
      city: data.city,
      first_line: data.addressLine1,
      second_line: data.addressLine2,
      postal_code: data.postalCode,
    },
  });
