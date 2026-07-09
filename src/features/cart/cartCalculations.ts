import { isRentalDateValid, toDayTimestamp } from './rentalDate.ts';
import type {
  CartProduct,
  InvalidRentalDate,
  OrderInformation,
  ProductInformation,
} from './cartTypes.ts';

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function getInclusiveDayCount(startDate: Date, endDate: Date) {
  const start = toDayTimestamp(startDate);
  const end = toDayTimestamp(endDate);

  return Math.floor(Math.abs(end - start) / DAY_IN_MILLISECONDS) + 1;
}

export function getProductInformation(product: CartProduct): ProductInformation {
  const rentalDays = new Set<number>();
  let totalCost = 0;
  const completeDates = product.dates.filter(isRentalDateValid);

  for (const date of completeDates) {
    const start = Math.min(toDayTimestamp(date.start_date), toDayTimestamp(date.end_date));
    const end = Math.max(toDayTimestamp(date.start_date), toDayTimestamp(date.end_date));

    for (let day = start; day <= end; day += DAY_IN_MILLISECONDS) {
      rentalDays.add(day);
    }

    totalCost +=
      getInclusiveDayCount(date.start_date, date.end_date) * date.quantity * product.price;
  }

  return {
    totalQuantity: completeDates.reduce((sum, date) => sum + date.quantity, 0),
    totalDays: rentalDays.size,
    totalCost,
  };
}

export function getOrderInformation(products: CartProduct[]): OrderInformation {
  return products.reduce(
    (summary, product) => {
      const information = getProductInformation(product);

      return {
        totalValue: summary.totalValue + information.totalCost,
        totalQuantity: summary.totalQuantity + information.totalQuantity,
      };
    },
    { totalValue: 0, totalQuantity: 0 }
  );
}

export function findFirstInvalidRentalDate(products: CartProduct[]): InvalidRentalDate | undefined {
  return products
    .flatMap((product) =>
      product.dates.map((date) => ({
        productId: product.id,
        date,
      }))
    )
    .find(({ date }) => !isRentalDateValid(date));
}
