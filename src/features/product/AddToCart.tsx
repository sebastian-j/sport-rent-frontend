import { useState } from 'react';

import ButtonCore from '../../components/core/ButtonCore';
import ContentPanel from '../../components/core/ContentPanel.tsx';
import { checkProductAvailability } from '../../assets/products/products.ts';
import { getInclusiveDayCount, isDateAfter, isDateInPast } from '../cart/rentalDate.ts';
import DateRangeFields from './addToCart/DateRangeFields.tsx';
import QuantitySelector from './addToCart/QuantitySelector.tsx';
import RentalPriceSummary from './addToCart/RentalPriceSummary.tsx';
import SizeSelector from './addToCart/SizeSelector.tsx';
import { type ProductProps } from './productProps';

export default function AddToCart({ product }: { product: ProductProps }) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const isSizeSelectionRequired = Boolean(product.sizes?.length && !selectedSize);
  const rentalDayCount = getInclusiveDayCount(startDate, endDate);
  const totalPrice = rentalDayCount * quantity * product.price;

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);

    if (isDateAfter(date, endDate)) {
      setEndDate(date);
    }
  };

  const handleAddToCart = () => {
    if (isDateAfter(startDate, endDate)) {
      alert('Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.');
      return;
    }

    if (isDateInPast(startDate)) {
      alert('Data rozpoczęcia nie może być wcześniejsza niż dzisiejsza data.');
      return;
    }

    if (isSizeSelectionRequired) {
      alert('Proszę wybrać rozmiar produktu.');
      return;
    }

    if (
      !checkProductAvailability(
        product.slug,
        startDate.toLocaleDateString('pl'),
        endDate.toLocaleDateString('pl')
      )
    ) {
      alert(
        `Produkt niedostępny w okresie od ${startDate.toLocaleDateString('pl')} do ${endDate.toLocaleDateString('pl')}.`
      );
    }

    alert(
      `Dodano ${quantity} sztuk produktu ${product.name}${selectedSize ? ` o rozmiarze ${selectedSize}` : ''} do koszyka na okres od ${startDate.toLocaleDateString('pl')} do ${endDate.toLocaleDateString('pl')}.`
    );
  };

  return (
    <ContentPanel className="w-full gap-2 p-4 min-[961px]:px-20">
      <p className="text-center text-3xl font-semibold text-app-text">{product.price} zł/doba</p>
      <DateRangeFields
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={handleStartDateChange}
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
        text="Dodaj do koszyka"
        onClick={handleAddToCart}
        disabled={isSizeSelectionRequired}
        className="my-[1vh] w-full max-w-xl p-[1.5vh] text-base disabled:cursor-not-allowed disabled:opacity-50"
      />
    </ContentPanel>
  );
}
