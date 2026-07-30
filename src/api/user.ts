import type { PersonalData } from '../features/profile/account/PersonalDataForm.tsx';
import { api } from './client.ts';
import type { components } from './generated/schema.ts';

export type OrderDetailResponse = components['schemas']['OrderDetailResponse'];

export const getUser = () => api.GET('/user');

export const getUserHistory = () => api.GET('/user/history');

export const getOrderDetails = (orderId: number) =>
  api.GET('/user/history/{order_id}', {
    params: { path: { order_id: orderId } },
  });

export const updateAddress = (data: PersonalData) =>
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
