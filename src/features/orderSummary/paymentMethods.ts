export const PAYMENT_METHODS = [
  { id: 'instant-transfer', name: 'Szybki przelew', price: 0 },
  { id: 'blik', name: 'BLIK', price: 0 },
  { id: 'google-pay', name: 'Google Pay', price: 0 },
  { id: 'apple-pay', name: 'Apple Pay', price: 0 },
  { id: 'online-card', name: 'Karta płatnicza online', price: 0 },
  { id: 'traditional-transfer', name: 'Przelew tradycyjny', price: 9.99 },
  { id: 'points', name: 'Punkty', price: 0 },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]['id'];
