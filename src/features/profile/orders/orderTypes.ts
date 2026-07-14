export type OrderStatus = 'PENDING' | 'UNPAID' | 'PAID' | 'GIVEN_OUT' | 'FINISHED' | 'CANCELLED';

export const ORDER_STATUS_MAP: Record<OrderStatus, string> = {
  PENDING: 'Oczekujące',
  UNPAID: 'Nieopłacone',
  PAID: 'Opłacone',
  GIVEN_OUT: 'Wydane',
  FINISHED: 'Zakończone',
  CANCELLED: 'Anulowane',
};

export type Order = {
  id: string;
  date: string;
  price: number;
  status: OrderStatus;
};
