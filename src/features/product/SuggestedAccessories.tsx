import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getProductAccessories } from '../../api/product.ts';
import ActivityIndicator from '../../components/core/ActivityIndicator.tsx';
import { RENT_ROUTES } from '../../routes.ts';
import type { ProductProps } from './productProps.ts';

type LoadStatus = 'loading' | 'ready' | 'error';
const VISIBLE_ACCESSORY_COUNT = 3;

export default function SuggestedAccessories({ productSlug }: { productSlug: string }) {
  const [accessories, setAccessories] = useState<ProductProps[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [firstVisibleIndex, setFirstVisibleIndex] = useState(0);

  useEffect(() => {
    let active = true;

    const loadAccessories = async () => {
      setStatus('loading');
      setFirstVisibleIndex(0);

      try {
        const { data, error } = await getProductAccessories(productSlug);
        if (!active) return;

        if (error || !data) {
          setAccessories([]);
          setStatus('error');
          return;
        }

        setAccessories(
          data.map((accessory) => ({
            id: accessory.id,
            name: accessory.name,
            description: accessory.description ?? '',
            price: accessory.price ?? 0,
            slug: accessory.slug,
            images: accessory.images ?? [],
            imageAlts: accessory.imageAlts ?? [],
            category: accessory.category ?? '',
            sizes: accessory.sizes ?? [],
            isFavorite: accessory.isFavorite,
          }))
        );
        setStatus('ready');
      } catch (error) {
        if (!active) return;

        console.error(error);
        setAccessories([]);
        setStatus('error');
      }
    };

    void loadAccessories();

    return () => {
      active = false;
    };
  }, [productSlug]);

  if (status === 'ready' && accessories.length === 0) return null;

  const canSwitchAccessories = accessories.length > VISIBLE_ACCESSORY_COUNT;
  const visibleAccessories = canSwitchAccessories
    ? Array.from(
        { length: VISIBLE_ACCESSORY_COUNT },
        (_, offset) => accessories[(firstVisibleIndex + offset) % accessories.length]
      )
    : accessories;

  const showPreviousAccessories = () => {
    setFirstVisibleIndex(
      (currentIndex) => (currentIndex - 1 + accessories.length) % accessories.length
    );
  };

  const showNextAccessories = () => {
    setFirstVisibleIndex((currentIndex) => (currentIndex + 1) % accessories.length);
  };

  return (
    <section className="w-full rounded-xl border border-app-borderSoft bg-app-surfaceSoft p-3 text-app-text">
      <div className="flex min-h-8 items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Sugerowane akcesoria</h2>
        {canSwitchAccessories && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={showPreviousAccessories}
              aria-label="Pokaż poprzednie akcesoria"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-app-surface transition-colors hover:bg-app-surfaceStrong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-surfaceStrong"
            >
              <ChevronLeft aria-hidden="true" size={18} />
            </button>
            <button
              type="button"
              onClick={showNextAccessories}
              aria-label="Pokaż następne akcesoria"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-app-surface transition-colors hover:bg-app-surfaceStrong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-surfaceStrong"
            >
              <ChevronRight aria-hidden="true" size={18} />
            </button>
          </div>
        )}
      </div>

      {status === 'loading' ? (
        <div className="flex min-h-24 items-center justify-center" role="status">
          <ActivityIndicator label="Ładowanie sugerowanych akcesoriów" size={28} />
        </div>
      ) : status === 'error' ? (
        <p className="py-6 text-center text-sm text-app-textMuted">
          Nie udało się załadować sugerowanych akcesoriów.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {visibleAccessories.map((accessory) => (
            <Link
              key={accessory.slug}
              to={RENT_ROUTES.product(accessory.slug)}
              aria-label={`Zobacz akcesorium: ${accessory.name}`}
              className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-app-borderSoft bg-app-surface transition-colors hover:border-app-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-surfaceStrong"
            >
              {accessory.images[0] ? (
                <img
                  src={accessory.images[0]}
                  alt={accessory.imageAlts?.[0] ?? accessory.name}
                  loading="lazy"
                  decoding="async"
                  className="h-24 w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-24 w-full items-center justify-center bg-app-surfaceStrong text-xs text-app-textMuted"
                  aria-hidden="true"
                >
                  Brak zdjęcia
                </div>
              )}
              <div className="flex min-w-0 flex-1 flex-col p-2 text-center">
                <h3 className="truncate text-sm font-semibold">{accessory.name}</h3>
                <span className="mt-1 text-sm font-semibold">{accessory.price} zł/doba</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
