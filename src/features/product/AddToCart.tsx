import { useState } from 'react';
import { CircleMinus, CirclePlus } from 'lucide-react';
import ButtonCore from '../../components/core/ButtonCore';
import { type ProductProps } from './productProps';
import { isDateAfter, isDateInPast } from '../cart/rentalDate.ts';
import DatePickerElem from '../../components/core/DatePickerElem.tsx';

export default function AddToCart({
  product,
  selectedSize,
}: {
  product: ProductProps;
  selectedSize: string | null;
}) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    if (isDateAfter(startDate, endDate)) {
      alert('Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.');
      return;
    }

    if (isDateInPast(startDate)) {
      alert('Data rozpoczęcia nie może być wcześniejsza niż dzisiejsza data.');
      return;
    }

    if (product.sizes && !selectedSize) {
      alert('Proszę wybrać rozmiar produktu.');
      return;
    }

    alert(
      `Dodano ${quantity} sztuk produktu ${product.name}${selectedSize ? `o rozmiarze ${selectedSize} ` : ' '}do koszyka na okres od ${startDate.toLocaleDateString('pl')} do ${endDate.toLocaleDateString('pl')}.`
    );
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-app-border bg-app-panel p-10 pl-20 pr-20">
      <p className="text-center text-6xl font-semibold text-app-text">{product.price} zł/doba</p>
      <div className="flex flex-row gap-2">
        <div className="flex flex-col gap-1 w-full">
          <p className="mb-[0.5vh] mt-[0.5vh] text-[2.5vh] font-semibold text-app-text">
            Data rozpoczęcia
          </p>
          <DatePickerElem
            selected={startDate}
            onChange={(date: Date | null) => {
              if (!date) return;

              setStartDate(date);

              if (isDateAfter(date, endDate)) {
                setEndDate(date);
              }
            }}
            minDate={new Date()}
            wrapperClassName="w-full flex-none"
            className="mb-[0.5vh] mt-[0.5vh] h-auto rounded-lg border border-app-borderSoft bg-app-surface p-2 text-left text-[2.5vh] font-semibold text-app-text"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <p className="mb-[0.5vh] mt-[0.5vh] text-[2.5vh] font-semibold text-app-text">
            Data zakończenia
          </p>
          <DatePickerElem
            selected={endDate}
            onChange={(date: Date | null) => date && setEndDate(date)}
            minDate={startDate}
            wrapperClassName="w-full flex-none"
            className="mb-[0.5vh] mt-[0.5vh] h-auto rounded-lg border border-app-borderSoft bg-app-surface p-2 text-left text-[2.5vh] font-semibold text-app-text"
          />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center w-full mt-[0.5vh] mb-[0.5vh]">
        <div className="text-[2.5vh] font-semibold text-app-text">
          <p> Liczba </p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <CircleMinus
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            className="h-[2.5vw] w-[4vw] max-w-[67px] cursor-pointer text-app-text hover:opacity-80"
          />
          <span className="w-[2vw] text-center text-[2.5vh] font-semibold text-app-text">
            {quantity}
          </span>
          <CirclePlus
            onClick={() => setQuantity(quantity + 1)}
            className="h-[2.5vw] w-[4vw] max-w-[67px] cursor-pointer text-app-text hover:opacity-80"
          />
        </div>
      </div>
      <ButtonCore
        text="Dodaj do koszyka"
        onClick={handleAddToCart}
        className="w-full p-[1.5vh] mt-[1vh] mb-[1vh] text-[2vh]"
      />
    </div>
  );
}
