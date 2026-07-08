import { useState } from 'react';
import { motion } from 'motion/react';
import { PRODUCTS } from '../assets/products/products.ts';
import { isRentalDateValid } from '../components/cart/rentalDate.ts';
import CartProductCard from '../components/cart/CartProductCard.tsx';
import type { CartProduct } from '../components/cart/CartProductCard.tsx';
import { formatPrice } from '../utils/formatPrice.ts';
import { Link } from 'react-router-dom';

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

// Mockup: creates cart's content when entering /cart
const INITIAL_CART: CartProduct[] = PRODUCTS.filter(
  (product) => product.id === 1 || product.id === 2
).map((product) => ({
  ...product,
  dates: [],
}));

function toDayTimestamp(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function getInclusiveDayCount(startDate: Date, endDate: Date) {
  const start = toDayTimestamp(startDate);
  const end = toDayTimestamp(endDate);
  return Math.floor(Math.abs(end - start) / DAY_IN_MILLISECONDS) + 1;
}

function getProductInformation(product: CartProduct) {
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

export default function CartPage() {
  const [products, setProducts] = useState(INITIAL_CART);

  const updateRentalDate = (
    productId: number,
    dateId: number,
    field: 'start_date' | 'end_date',
    value: Date | null
  ) => {
    setProducts((previous) =>
      previous.map((product) =>
        product.id === productId
          ? {
              ...product,
              dates: product.dates.map((date) =>
                date.id === dateId ? { ...date, [field]: value } : date
              ),
            }
          : product
      )
    );
  };

  const updateQuantity = (productId: number, dateId: number, quantity: number) => {
    setProducts((previous) =>
      previous.map((product) =>
        product.id === productId
          ? {
              ...product,
              dates: product.dates.map((date) =>
                date.id === dateId ? { ...date, quantity } : date
              ),
            }
          : product
      )
    );
  };

  const removeRentalDate = (productId: number, dateId: number) => {
    setProducts((previous) =>
      previous.flatMap((product) => {
        if (product.id !== productId) return [product];

        const dates = product.dates.filter((date) => date.id !== dateId);
        return dates.length > 0 ? [{ ...product, dates }] : [];
      })
    );
  };

  const addRentalDate = (productId: number) => {
    setProducts((previous) =>
      previous.map((product) => {
        if (product.id !== productId) return product;

        const nextDateId = Math.max(0, ...product.dates.map((date) => date.id)) + 1;

        return {
          ...product,
          dates: [
            ...product.dates,
            {
              id: nextDateId,
              quantity: 1,
              start_date: null,
              end_date: null,
            },
          ],
        };
      })
    );
  };

  const removeProduct = (productId: number) => {
    setProducts((previous) => previous.filter((product) => product.id !== productId));
  };

  const orderInformation = products.reduce(
    (summary, product) => {
      const information = getProductInformation(product);

      return {
        totalValue: summary.totalValue + information.totalCost,
        totalQuantity: summary.totalQuantity + information.totalQuantity,
      };
    },
    { totalValue: 0, totalQuantity: 0 }
  );

  return (
    <div className="mx-auto mb-12 flex w-full max-w-[100rem] flex-col">
      <p className="text-center mt-12 font-semibold text-5xl text-slate-950">Koszyk</p>

      {products.length > 0 && <div>
          <div className="flex flex-col bg-slate-200 p-8 rounded-xl mx-8 mt-12 border-slate-950 border-2 gap-4">
            {products.map((product) => {
              const information = getProductInformation(product);

              return (
                  <CartProductCard
                      key={product.id}
                      product={product}
                      information={information}
                      onQuantityChange={(dateId, quantity) => updateQuantity(product.id, dateId, quantity)}
                      onDateChange={(dateId, field, value) =>
                          updateRentalDate(product.id, dateId, field, value)
                      }
                      onRemoveDate={(dateId) => removeRentalDate(product.id, dateId)}
                      onAddDate={() => addRentalDate(product.id)}
                      onRemoveProduct={() => removeProduct(product.id)}
                  />
              );
            })}
          </div>

          <div className="flex flex-col bg-slate-200 p-8 rounded-xl mx-8 mt-12 border-slate-950 border-2">
              <p className="text-2xl">Podsumowanie zamówienia</p>
              <p className="text-lg">Wartość koszyka: {formatPrice(orderInformation.totalValue)}</p>
              <p className="text-lg">Liczba produktów: {orderInformation.totalQuantity}</p>

              <motion.button
                  type="button"
                  whileHover={{ scale: 1.003 }}
                  whileTap={{ scale: 0.997 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="mt-4 flex h-16 items-center justify-center rounded-lg bg-slate-800 text-2xl text-white"
              >
                  Kup teraz
              </motion.button>
          </div>
      </div>}
      {products.length === 0 && (
        <div className="mx-8 mt-12 flex flex-col items-center rounded-xl border-2 border-slate-950 bg-slate-200 p-8 text-center">
          <p className="text-3xl font-semibold text-slate-950">Twój koszyk jest pusty</p>
          <p className="mt-3 max-w-xl text-lg text-slate-700">
            Wybierz sprzęt, który chcesz wypożyczyć, dodaj terminy rezerwacji i wróć tutaj,
            aby sfinalizować zamówienie.
          </p>
          <Link
            to="/"
            className="mt-6 rounded-lg bg-slate-800 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-slate-700"
          >
            Przejdź do oferty
          </Link>
        </div>
      )}

    </div>
  );
}
