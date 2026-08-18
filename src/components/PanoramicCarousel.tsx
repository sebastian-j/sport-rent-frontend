import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, type PanInfo, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import type { CategoryItem } from '../api/category.ts';
import PanoramicImage from './PanoramicImage.tsx';

type PanoramicCarouselProps = {
  categories: CategoryItem[];
  onCategoryClick: (slug: string) => void;
};

const SLIDE_DURATION_MS = 8000;
const SWIPE_OFFSET_THRESHOLD_PX = 50;
const SWIPE_VELOCITY_THRESHOLD_PX = 500;

const SLIDE_VARIANTS = {
  enter: (direction: 1 | -1) => ({ x: direction === 1 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (direction: 1 | -1) => ({ x: direction === 1 ? '-100%' : '100%' }),
};

const arrowButtonClassName =
  'absolute top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export default function PanoramicCarousel({ categories, onCategoryClick }: PanoramicCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const prefersReducedMotion = useReducedMotion();
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (categories.length < 2 || prefersReducedMotion) return;

    const timeout = window.setTimeout(() => {
      setSlideDirection(1);
      setActiveIndex((currentIndex) => (currentIndex + 1) % categories.length);
    }, SLIDE_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, categories.length, prefersReducedMotion]);

  const changeSlide = (direction: 1 | -1) => {
    setSlideDirection(direction);
    setActiveIndex(
      (currentIndex) => (currentIndex + direction + categories.length) % categories.length
    );
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipedLeft =
      info.offset.x < -SWIPE_OFFSET_THRESHOLD_PX || info.velocity.x < -SWIPE_VELOCITY_THRESHOLD_PX;
    const swipedRight =
      info.offset.x > SWIPE_OFFSET_THRESHOLD_PX || info.velocity.x > SWIPE_VELOCITY_THRESHOLD_PX;

    if (swipedLeft) {
      changeSlide(1);
    } else if (swipedRight) {
      changeSlide(-1);
    }

    window.setTimeout(() => {
      isDraggingRef.current = false;
    }, 0);
  };

  if (categories.length === 0) return null;

  const activeCategory = categories[activeIndex];
  const showControls = categories.length > 1;

  return (
    <section aria-label="Wyróżnione kategorie" className="relative h-[50vh] w-full overflow-hidden">
      <AnimatePresence initial={false} custom={slideDirection}>
        <motion.div
          key={activeIndex}
          className="absolute inset-0"
          custom={slideDirection}
          variants={SLIDE_VARIANTS}
          drag={showControls ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.35}
          dragMomentum={false}
          onDragStart={() => {
            isDraggingRef.current = true;
          }}
          onDragEnd={handleDragEnd}
          onClickCapture={(event) => {
            if (!isDraggingRef.current) return;

            event.preventDefault();
            event.stopPropagation();
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={
            prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 32 }
          }
        >
          <PanoramicImage
            image={activeCategory.image}
            title={activeCategory.name}
            onButtonClick={() => onCategoryClick(activeCategory.slug)}
          />
        </motion.div>
      </AnimatePresence>

      {showControls && (
        <>
          <button
            type="button"
            aria-label="Poprzednia kategoria"
            onClick={() => changeSlide(-1)}
            className={`${arrowButtonClassName} left-4`}
          >
            <ChevronLeft size={28} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Następna kategoria"
            onClick={() => changeSlide(1)}
            className={`${arrowButtonClassName} right-4`}
          >
            <ChevronRight size={28} aria-hidden="true" />
          </button>
        </>
      )}
    </section>
  );
}
