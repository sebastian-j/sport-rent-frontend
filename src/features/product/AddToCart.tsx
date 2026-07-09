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
    <div className="flex flex-col gap-2 p-10 pl-20 pr-20 border rounded-lg border-black bg-gray-200">
      <p className="text-6xl font-semibold text-[#193556] text-center">{product.price} zł/doba</p>
      <div className="flex flex-row gap-2">
        <div className="flex flex-col gap-1 w-full">
          <p className="font-semibold text-[2.5vh] mt-[0.5vh] mb-[0.5vh] text-[#193556]">
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
            className="mt-[0.5vh] mb-[0.5vh] h-auto rounded-lg border border-slate-300 bg-white p-2 text-left text-[2.5vh] font-semibold text-[#193556]"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <p className="font-semibold text-[2.5vh] mt-[0.5vh] mb-[0.5vh] text-[#193556]">
            Data zakończenia
          </p>
          <DatePickerElem
            selected={endDate}
            onChange={(date: Date | null) => date && setEndDate(date)}
            minDate={startDate}
            wrapperClassName="w-full flex-none"
            className="mt-[0.5vh] mb-[0.5vh] h-auto rounded-lg border border-slate-300 bg-white p-2 text-left text-[2.5vh] font-semibold text-[#193556]"
          />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center w-full mt-[0.5vh] mb-[0.5vh]">
        <div className="font-semibold text-[2.5vh] text-[#193556]">
          <p> Liczba </p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <CircleMinus
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            className="h-[2.5vw] w-[4vw] max-w-[67px] text-[#193556] cursor-pointer hover:opacity-80"
          />
          <span className="font-semibold text-[2.5vh] w-[2vw] text-center text-[#193556]">
            {quantity}
          </span>
          <CirclePlus
            onClick={() => setQuantity(quantity + 1)}
            className="h-[2.5vw] w-[4vw] max-w-[67px] text-[#193556] cursor-pointer hover:opacity-80"
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
