import applePayLogo from '../../assets/payments/apple-pay.svg';
import blikLogo from '../../assets/payments/blik.svg';
import googlePayLogo from '../../assets/payments/google-pay.svg';
import instantTransferLogo from '../../assets/payments/instant-transfer.svg';
import mastercardLogo from '../../assets/payments/mastercard.svg';
import traditionalTransferLogo from '../../assets/payments/traditional-transfer.svg';
import visaLogo from '../../assets/payments/visa.png';

export const PAYMENT_METHODS = [
  {
    id: 'instant-transfer',
    name: 'Szybki przelew',
    price: 0,
    logos: [instantTransferLogo],
  },
  {
    id: 'blik',
    name: 'BLIK',
    price: 0,
    logos: [blikLogo],
  },
  {
    id: 'google-pay',
    name: 'Google Pay',
    price: 0,
    logos: [googlePayLogo],
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    price: 0,
    logos: [applePayLogo],
  },
  {
    id: 'online-card',
    name: 'Karta płatnicza online',
    price: 0,
    logos: [visaLogo, mastercardLogo],
  },
  {
    id: 'traditional-transfer',
    name: 'Przelew tradycyjny',
    price: 9.99,
    logos: [traditionalTransferLogo],
  },
  {
    id: 'points',
    name: 'Punkty',
    price: 0,
    logos: [],
  },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]['id'];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
