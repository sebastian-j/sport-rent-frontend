import { useRef, useState } from 'react';
import { PRODUCTS } from '../assets/products/products.ts';
import { isRentalDateValid } from '../components/cart/rentalDate.ts';
import CartProductCard from '../components/cart/CartProductCard.tsx';
import type { CartProduct } from '../components/cart/CartProductCard.tsx';
import { formatPrice } from '../utils/formatPrice.ts';
import { useNavigate } from 'react-router-dom';
import { Badge, BadgeCheck } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import ButtonCore from '../components/core/ButtonCore.tsx';

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
  const [readTos, setReadTos] = useState(false);
  const [highlightTos, setHighlightTos] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const tosRef = useRef<HTMLDivElement | null>(null);
  const rentalDateRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navigate = useNavigate();

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

  const handleReadTos = () => {
    setReadTos(true);
  };

  const getRentalDateRefKey = (productId: number, dateId: number) => `${productId}-${dateId}`;

  const handleBuy = () => {
    const firstInvalidRentalDate = products
      .flatMap((product) =>
        product.dates.map((date) => ({
          productId: product.id,
          date,
        }))
      )
      .find(({ date }) => !isRentalDateValid(date));

    if (firstInvalidRentalDate) {
      const refKey = getRentalDateRefKey(
        firstInvalidRentalDate.productId,
        firstInvalidRentalDate.date.id
      );

      rentalDateRefs.current[refKey]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      return;
    }

    if (!readTos) {
      tosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightTos(true);
      window.setTimeout(() => setHighlightTos(false), 500);

      return;
    }

    alert('Kupiono!');
    navigate('/');
  };

  return (
    <div className="mx-auto mb-12 flex w-full max-w-[100rem] flex-col">
      <p className="text-center mt-12 font-semibold text-5xl text-slate-950">Koszyk</p>

      {products.length > 0 && (
        <div>
          <div className="flex flex-col bg-slate-200 p-8 rounded-xl mx-8 mt-12 border-slate-950 border-2 gap-4">
            {products.map((product) => {
              const information = getProductInformation(product);

              return (
                <CartProductCard
                  key={product.id}
                  product={product}
                  information={information}
                  onQuantityChange={(dateId, quantity) =>
                    updateQuantity(product.id, dateId, quantity)
                  }
                  onDateChange={(dateId, field, value) =>
                    updateRentalDate(product.id, dateId, field, value)
                  }
                  onRemoveDate={(dateId) => removeRentalDate(product.id, dateId)}
                  onAddDate={() => addRentalDate(product.id)}
                  onRemoveProduct={() => removeProduct(product.id)}
                  getRentalDateRef={(dateId) => (element) => {
                    rentalDateRefs.current[getRentalDateRefKey(product.id, dateId)] = element;
                  }}
                />
              );
            })}
          </div>

          <div
            className={twMerge(
              'flex-[2] flex-wrap items-center mx-8 mt-12 flex flex-row justify-between rounded-xl border-2 border-slate-950 bg-slate-200 p-8 transition-colors duration-200',
              highlightTos && 'border-red-600 bg-red-200'
            )}
            ref={tosRef}
          >
            <p className="text-2xl ">
              Przeczytaj{' '}
              <a
                className="underline font-semibold"
                href="https://dok.agh.edu.pl/doc.php?id=17184"
                target="_blank"
                onClick={handleReadTos}
              >
                Regulamin
              </a>
              , aby dokonać zakupu.
            </p>
            <div>
              {readTos ? (
                <BadgeCheck size={32} className="text-green-600" />
              ) : (
                <Badge size={32} className="text-red-600" />
              )}
            </div>
          </div>

          <div className="flex flex-row">
            <div className="mx-8 mt-12 flex flex-1 flex-col items-center rounded-xl border-2 border-slate-950 bg-slate-200 p-8">
              <p className="text-2xl">Kod promocyjny</p>
              <input
                type="text"
                value={promoCode}
                onChange={(event) => setPromoCode(event.currentTarget.value)}
                placeholder="Wpisz kod"
                className="select-none mt-4 h-14 w-full rounded-lg border-2 border-slate-950 bg-white px-4 text-xl text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-700"
              />
              <ButtonCore
                text="Sprawdź"
                className="mt-4 flex h-14 w-full items-center justify-center rounded-lg bg-slate-800 text-2xl text-white"
              />
            </div>

            <div className="flex flex-col flex-[2] items-center bg-slate-200 p-8 rounded-xl mx-8 mt-12 border-slate-950 border-2 gap-2">
              <p className="text-3xl">Podsumowanie zamówienia</p>
              <p className="text-xl">Wartość koszyka: {formatPrice(orderInformation.totalValue)}</p>
              <p className="text-xl">Liczba produktów: {orderInformation.totalQuantity}</p>

              <ButtonCore
                text="Kup teraz"
                onClick={handleBuy}
                className={
                  'mt-4 flex h-16 w-full items-center justify-center rounded-lg bg-slate-800 text-2xl text-white'
                }
              />
            </div>
          </div>
        </div>
      )}
      {products.length === 0 && (
        <div className="mx-8 mt-12 flex flex-col items-center rounded-xl border-2 border-slate-950 bg-slate-200 p-8 text-center">
          <p className="text-3xl font-semibold text-slate-950">Twój koszyk jest pusty</p>
          <p className="mt-3 max-w-xl text-lg text-slate-700">
            Wybierz sprzęt, który chcesz wypożyczyć, dodaj terminy rezerwacji i wróć tutaj, aby
            sfinalizować zamówienie.
          </p>
          <ButtonCore
            text="Przejdź do oferty"
            onClick={() => navigate('/')}
            className="mt-6 rounded-lg bg-slate-800 px-8 py-3 text-lg font-semibold text-white transition-colors"
          />
        </div>
      )}
    </div>
  );
}
