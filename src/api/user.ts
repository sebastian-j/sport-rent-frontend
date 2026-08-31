import type { PersonalData } from '../features/profile/account/PersonalDataForm.tsx';
import { api } from './client.ts';

export const getUser = () => api.GET('/user');

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
