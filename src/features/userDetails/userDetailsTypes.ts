export type RecipientDetails = {
  firstName: string;
  lastName: string;
};

export type UserDetails = RecipientDetails & {
  country: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
};

export type InvoiceDetails = UserDetails & {
  company: string;
  nip: string;
};
