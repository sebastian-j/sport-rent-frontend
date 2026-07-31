import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { addCartItem } from '../../api/cart.ts';
import ButtonCore from '../../components/core/ButtonCore';
import ContentPanel from '../../components/core/ContentPanel.tsx';
import { AUTH_ROUTES } from '../../routes.ts';
import { formatLocalDate } from '../../utils/localDate.ts';
import { useAuth } from '../auth/authContext.ts';
import { useCartStatus } from '../cart/cartStatusContext.ts';
import { getInclusiveDayCount, isDateAfter, isDateInPast } from '../cart/rentalDate.ts';
import DateRangeFields from './addToCart/DateRangeFields.tsx';
import QuantitySelector from './addToCart/QuantitySelector.tsx';
import RentalPriceSummary from './addToCart/RentalPriceSummary.tsx';
import SizeSelector from './addToCart/SizeSelector.tsx';
import { type ProductProps } from './productProps';

export default function AddToCart({ product }: { product: ProductProps }) {
  const { status: authStatus } = useAuth();
  const { refreshCartStatus } = useCartStatus();
  const navigate = useNavigate();
  const location = useLocation();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const isSizeSelectionRequired = Boolean(product.sizes?.length && !selectedSize);
  const rentalDayCount = getInclusiveDayCount(startDate, endDate);
  const totalPrice = rentalDayCount * quantity * product.price;

  const handleAddToCart = async () => {
    setMessage(null);
    setHasError(false);

    if (authStatus !== 'authenticated') {
      if (authStatus === 'anonymous') {
        navigate(AUTH_ROUTES.login, { state: { from: location } });
      } else {
        setMessage('Nie udało się potwierdzić sesji. Spróbuj ponownie.');
        setHasError(true);
      }
      return;
    }

    if (isDateAfter(startDate, endDate)) {
      setMessage('Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.');
      setHasError(true);
      return;
    }

    if (isDateInPast(startDate)) {
      setMessage('Data rozpoczęcia nie może być wcześniejsza niż dzisiejsza data.');
      setHasError(true);
      return;
    }

    if (isSizeSelectionRequired) {
      setMessage('Proszę wybrać rozmiar produktu.');
      setHasError(true);
      return;
    }

    setIsAdding(true);
    try {
      const result = await addCartItem({
        product_slug: product.slug,
        quantity,
        size: selectedSize,
        start_date: formatLocalDate(startDate),
        end_date: formatLocalDate(endDate),
      });
      if (result.error || !result.data) {
        setMessage('Nie udało się dodać produktu do koszyka. Sprawdź wybrany termin.');
        setHasError(true);
        return;
      }
      void refreshCartStatus();
      setMessage(
        `Dodano ${quantity} szt. produktu „${product.name}” do koszyka na okres ${startDate.toLocaleDateString('pl')}–${endDate.toLocaleDateString('pl')}.`
      );
    } catch {
      setMessage('Nie udało się połączyć z serwerem. Spróbuj ponownie.');
      setHasError(true);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <ContentPanel className="w-full gap-2 p-4 min-[961px]:px-20">
      <p className="text-center text-3xl font-semibold text-app-text">{product.price} zł/doba</p>
      <DateRangeFields
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      <QuantitySelector
        quantity={quantity}
        onDecrease={() => setQuantity((currentQuantity) => currentQuantity - 1)}
        onIncrease={() => setQuantity((currentQuantity) => currentQuantity + 1)}
      />
      {product.sizes && product.sizes.length > 0 && (
        <SizeSelector
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSelect={(size) =>
            setSelectedSize((currentSize) => (currentSize === size ? null : size))
          }
        />
      )}
      <RentalPriceSummary
        rentalDayCount={rentalDayCount}
        quantity={quantity}
        totalPrice={totalPrice}
      />
      <ButtonCore
        text={isAdding ? 'Dodawanie…' : 'Dodaj do koszyka'}
        onClick={handleAddToCart}
        disabled={isSizeSelectionRequired || isAdding}
        className="my-[1vh] w-full max-w-xl p-[1.5vh] text-base disabled:cursor-not-allowed disabled:opacity-50"
      />
      {message && (
        <p
          role={hasError ? 'alert' : 'status'}
          className={`text-center ${hasError ? 'text-app-danger' : 'text-app-success'}`}
        >
          {message}
        </p>
      )}
    </ContentPanel>
  );
}
