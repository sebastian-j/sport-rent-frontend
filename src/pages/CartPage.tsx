import { useRef, useState } from 'react';
import { PRODUCTS } from '../assets/products/products.ts';
import CartProductCard from '../components/cart/CartProductCard.tsx';
import { useNavigate } from 'react-router-dom';
import type { CartProduct } from '../components/cart/cartTypes.ts';
import {
  findFirstInvalidRentalDate,
  getOrderInformation,
  getProductInformation,
} from '../components/cart/cartCalculations.ts';
import TermsPanel from '../components/cart/TermsPanel.tsx';
import PromoCodePanel from '../components/cart/PromoCodePanel.tsx';
import CartSummaryPanel from '../components/cart/CartSummaryPanel.tsx';
import EmptyCartPanel from '../components/cart/EmptyCartPanel.tsx';

// Mockup: creates cart's content when entering /cart
const INITIAL_CART: CartProduct[] = PRODUCTS.filter(
  (product) => product.id === 1 || product.id === 2
).map((product) => ({
  ...product,
  dates: [],
}));

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

  const orderInformation = getOrderInformation(products);

  const handleReadTos = () => {
    setReadTos(true);
  };

  const getRentalDateRefKey = (productId: number, dateId: number) => `${productId}-${dateId}`;

  const handleBuy = () => {
    const firstInvalidRentalDate = findFirstInvalidRentalDate(products);

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

          <TermsPanel
            readTos={readTos}
            highlighted={highlightTos}
            onReadTos={handleReadTos}
            ref={tosRef}
          />

          <div className="flex flex-row">
            <PromoCodePanel promoCode={promoCode} onPromoCodeChange={setPromoCode} />
            <CartSummaryPanel orderInformation={orderInformation} onBuy={handleBuy} />
          </div>
        </div>
      )}
      {products.length === 0 && <EmptyCartPanel onGoToOffer={() => navigate('/')} />}
    </div>
  );
}
