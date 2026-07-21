import { useRef, useState } from 'react';
import CartProductCard from '../../features/cart/CartProductCard.tsx';
import { useNavigate } from 'react-router-dom';
import {
  findFirstInvalidRentalDate,
  getOrderInformation,
  getProductInformation,
} from '../../features/cart/cartCalculations.ts';
import TermsPanel from '../../features/cart/TermsPanel.tsx';
import CartSummaryPanel from '../../features/cart/CartSummaryPanel.tsx';
import EmptyCartPanel from '../../features/cart/EmptyCartPanel.tsx';
import { useCart } from '../../features/cart/useCart.ts';
import { INITIAL_CART } from '../../features/cart/initialCart.ts';
import ContentPanel from '../../components/core/ContentPanel.tsx';

export default function CartPage() {
  const {
    products,
    updateRentalDate,
    updateQuantity,
    updateSize,
    removeRentalDate,
    addRentalDate,
    removeProduct,
  } = useCart(INITIAL_CART);
  const [readTos, setReadTos] = useState(false);
  const [highlightTos, setHighlightTos] = useState(false);
  const tosRef = useRef<HTMLDivElement | null>(null);
  const rentalDateRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navigate = useNavigate();

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

    navigate('/summary');
  };

  return (
    <div className="mx-auto mb-12 flex w-full max-w-[100rem] flex-col">
      <p className="text-center mt-12 font-semibold text-5xl text-app-text">Koszyk</p>

      {products.length > 0 && (
        <div>
          <ContentPanel className="mx-4 mt-12 items-stretch gap-4 p-4 sm:mx-8 sm:p-8">
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
                  onSizeChange={(dateId, size) => updateSize(product.id, dateId, size)}
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
          </ContentPanel>

          <TermsPanel
            readTos={readTos}
            highlighted={highlightTos}
            onReadTos={handleReadTos}
            ref={tosRef}
          />

          <CartSummaryPanel orderInformation={orderInformation} onBuy={handleBuy} />
        </div>
      )}
      {products.length === 0 && <EmptyCartPanel onGoToOffer={() => navigate('/')} />}
    </div>
  );
}
