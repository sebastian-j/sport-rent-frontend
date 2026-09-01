import type { components } from '../../api/generated/schema.ts';
import type { InvoiceDetails, RecipientDetails } from './userDetailsTypes.ts';

type UserResponse = components['schemas']['UserResponse'];

export function mapRecipientDetails(user: UserResponse): RecipientDetails {
  return {
    firstName: user.first_name,
    lastName: user.last_name,
  };
}

export function mapInvoiceDetails(user: UserResponse): InvoiceDetails {
  return {
    firstName: user.first_name,
    lastName: user.last_name,
    company: '',
    nip: '',
    country: user.country,
    city: user.city,
    addressLine1: user.first_line,
    addressLine2: user.second_line ?? '',
    postalCode: user.postal_code,
  };
}
