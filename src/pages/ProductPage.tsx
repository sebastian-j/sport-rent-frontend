import { useParams } from 'react-router-dom';
import { getProductById } from '../assets/products/products';
import ProductGallery from '../components/product/ProductGallery';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import { CircleMinus, CirclePlus } from 'lucide-react';
import ButtonCore from '../components/core/ButtonCore';

export default function ProductPage() {
  const { id } = useParams();
  const productId = id ? parseInt(id) : null;

  const product = productId ? getProductById(productId) : null;

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    alert(
      `Dodano ${quantity} sztuk produktu ${product?.name} do koszyka na okres od ${startDate.toLocaleDateString()} do ${endDate.toLocaleDateString()}.`
    );
  };

  return (
    <div className="flex flex-col bg-white mx-[5vw]">
      <main className="flex-grow mt-[2vh]">
        <h1 className="text-6xl font-semibold mb-4 text-center text-[#193556]">{product?.name}</h1>
        <div className="mb-8 text-lg text-gray-600 flex flex-row gap-4 mt-[2vh]">
          <div className="font-bold w-full items-center justify-center flex flex-col gap-4">
            <ProductGallery product={product} />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2 p-10 pl-20 pr-20 border rounded-lg border-black bg-gray-200">
              <p className="text-6xl font-semibold text-[#193556] text-center">
                {product?.price} zł/doba
              </p>
              <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-1 w-full">
                  <p className="font-semibold text-[2.5vh] mt-[0.5vh] mb-[0.5vh] text-[#193556]">
                    {' '}
                    Data rozpoczęcia{' '}
                  </p>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => date && setStartDate(date)}
                    dateFormat="dd.MM.yyyy"
                    className="font-semibold text-[2.5vh] mt-[0.5vh] mb-[0.5vh] w-full text-[#193556]"
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <p className="font-semibold text-[2.5vh] mt-[0.5vh] mb-[0.5vh] text-[#193556]">
                    {' '}
                    Data zakończenia{' '}
                  </p>
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => date && setEndDate(date)}
                    dateFormat="dd.MM.yyyy"
                    className="font-semibold text-[2.5vh] mt-[0.5vh] mb-[0.5vh] w-full text-[#193556]"
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
          </div>
        </div>
      </main>
    </div>
  );
}
