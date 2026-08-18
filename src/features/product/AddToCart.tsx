import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { addCartItem } from '../../api/cart.ts';
import { getProductAvailability, type ProductAvailabilityResponse } from '../../api/product.ts';
import ButtonCore from '../../components/core/ButtonCore';
import ContentPanel from '../../components/core/ContentPanel.tsx';
import LoadingDots from '../../components/core/LoadingDots.tsx';
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
  const [availableQuantity, setAvailableQuantity] = useState<number | null>(null);
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [sizeAvailability, setSizeAvailability] = useState<Map<string, boolean>>(new Map());
  const [isSizeAvailabilityLoading, setIsSizeAvailabilityLoading] = useState(false);
  const isSizeSelectionRequired = Boolean(product.sizes?.length && !selectedSize);
  const rentalDayCount = getInclusiveDayCount(startDate, endDate);
  const totalPrice = rentalDayCount * quantity * product.price;
  const isQuantityTooHigh = availableQuantity !== null && quantity > availableQuantity;
  const canAddToCart =
    !isSizeSelectionRequired && !isAdding && !isAvailabilityLoading && !isQuantityTooHigh;

  useEffect(() => {
    let isCurrent = true;

    const loadSizeAvailability = async () => {
      if (!product.sizes || product.sizes.length === 0) {
        setSizeAvailability(new Map());
        setIsSizeAvailabilityLoading(false);
        return;
      }

      if (isDateAfter(startDate, endDate) || isDateInPast(startDate)) {
        setSizeAvailability(new Map());
        setIsSizeAvailabilityLoading(false);
        return;
      }

      setIsSizeAvailabilityLoading(true);

      try {
        const availability = new Map<string, boolean>();

        for (const size of product.sizes) {
          const result = await getProductAvailability(
            product.slug,
            formatLocalDate(startDate),
            formatLocalDate(endDate),
            size.size
          );

          if (!isCurrent) {
            return;
          }

          const sizeAvail = result.data as ProductAvailabilityResponse | undefined;
          availability.set(size.size, (sizeAvail?.availableQuantity ?? 0) > 0);
        }

        if (isCurrent) {
          setSizeAvailability(availability);
        }
      } catch {
        if (isCurrent) {
          setSizeAvailability(new Map());
        }
      } finally {
        if (isCurrent) {
          setIsSizeAvailabilityLoading(false);
        }
      }
    };

    void loadSizeAvailability();

    return () => {
      isCurrent = false;
    };
  }, [product.slug, product.sizes, startDate, endDate]);

  useEffect(() => {
    let isCurrent = true;

    const loadAvailability = async () => {
      if (isDateAfter(startDate, endDate) || isDateInPast(startDate)) {
        setAvailableQuantity(null);
        setAvailabilityError(null);
        setIsAvailabilityLoading(false);
        return;
      }

      setAvailableQuantity(null);
      setIsAvailabilityLoading(true);
      setAvailabilityError(null);

      try {
        const result = await getProductAvailability(
          product.slug,
          formatLocalDate(startDate),
          formatLocalDate(endDate),
          selectedSize
        );

        if (!isCurrent) {
          return;
        }

        const availability = result.data as ProductAvailabilityResponse | undefined;

        if (result.error || !availability) {
          setAvailableQuantity(null);
          setAvailabilityError('Nie udało się sprawdzić dostępności.');
          return;
        }

        setAvailableQuantity(availability.availableQuantity);
      } catch {
        if (!isCurrent) {
          return;
        }

        setAvailableQuantity(null);
        setAvailabilityError('Nie udało się sprawdzić dostępności.');
      } finally {
        if (isCurrent) {
          setIsAvailabilityLoading(false);
        }
      }
    };

    void loadAvailability();

    return () => {
      isCurrent = false;
    };
  }, [product.slug, selectedSize, startDate, endDate]);

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

    if (availableQuantity !== null && quantity > availableQuantity) {
      setMessage(
        availableQuantity === 0
          ? 'Nie ma teraz tego produktu na stanie.'
          : `Teraz na stanie jest ${availableQuantity} szt.`
      );
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
        canIncrease={availableQuantity === null ? true : quantity < availableQuantity}
      />
      {isAvailabilityLoading ? (
        <p className="text-center text-sm text-app-textMuted">Sprawdzanie dostępności...</p>
      ) : availabilityError ? (
        <p role="status" className="text-center text-sm text-app-textMuted">
          {availabilityError}
        </p>
      ) : availableQuantity !== null ? (
        <p
          className={`text-center text-sm ${isQuantityTooHigh ? 'text-app-danger' : 'text-app-textMuted'}`}
        >
          {isQuantityTooHigh
            ? `Teraz na stanie jest ${availableQuantity} szt.`
            : `Na ten termin dostępne są ${availableQuantity} szt.`}
        </p>
      ) : null}
      {product.sizes && product.sizes.length > 0 && (
        <SizeSelector
          sizes={product.sizes.map((size) => ({
            ...size,
            available: sizeAvailability.get(size.size) ?? true,
          }))}
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
        onClick={handleAddToCart}
        disabled={!canAddToCart}
        className="my-[1vh] w-full max-w-xl p-[1.5vh] text-base disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isAdding ? (
          <span className="inline-flex items-center gap-2">
            Dodawanie <LoadingDots />
          </span>
        ) : (
          'Dodaj do koszyka'
        )}
      </ButtonCore>
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
