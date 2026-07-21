import { Children, type ReactNode, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, type PanInfo, useReducedMotion } from 'motion/react';

type CategoryCardSliderProps = {
  children: ReactNode;
};

const SLIDE_DURATION_MS = 5000;
const SWIPE_OFFSET_THRESHOLD_PX = 50;
const SWIPE_VELOCITY_THRESHOLD_PX = 500;

const SLIDE_VARIANTS = {
  enter: (direction: 1 | -1) => ({ x: direction === 1 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (direction: 1 | -1) => ({ x: direction === 1 ? '-100%' : '100%' }),
};

export default function CategoryCardSlider({ children }: CategoryCardSliderProps) {
  const cards = Children.toArray(children);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const prefersReducedMotion = useReducedMotion();
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (cards.length < 2 || prefersReducedMotion) return;

    const timeout = window.setTimeout(() => {
      setSlideDirection(1);
      setActiveIndex((currentIndex) => (currentIndex + 1) % cards.length);
    }, SLIDE_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, cards.length, prefersReducedMotion]);

  const changeCard = (direction: 1 | -1) => {
    setSlideDirection(direction);
    setActiveIndex((currentIndex) => (currentIndex + direction + cards.length) % cards.length);
  };

  const selectCard = (index: number) => {
    if (index === activeIndex) return;

    setSlideDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipedLeft =
      info.offset.x < -SWIPE_OFFSET_THRESHOLD_PX || info.velocity.x < -SWIPE_VELOCITY_THRESHOLD_PX;
    const swipedRight =
      info.offset.x > SWIPE_OFFSET_THRESHOLD_PX || info.velocity.x > SWIPE_VELOCITY_THRESHOLD_PX;

    if (swipedLeft) {
      changeCard(1);
    } else if (swipedRight) {
      changeCard(-1);
    }

    window.setTimeout(() => {
      isDraggingRef.current = false;
    }, 0);
  };

  if (cards.length === 0) return null;

  return (
    <section aria-label="Polecane kategorie" className="lg:hidden">
      <div className="relative h-[16rem] overflow-hidden">
        <AnimatePresence initial={false} custom={slideDirection}>
          <motion.div
            key={activeIndex}
            className="absolute inset-0"
            custom={slideDirection}
            variants={SLIDE_VARIANTS}
            drag={cards.length > 1 ? 'x' : false}
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
              prefersReducedMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 300, damping: 32 }
            }
          >
            {cards[activeIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {cards.length > 1 && (
        <div className="relative flex h-8 items-center justify-center gap-2 bg-app-surface">
          {cards.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Pokaż kategorię ${index + 1} z ${cards.length}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => selectCard(index)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                index === activeIndex ? 'bg-app-textStrong' : 'bg-app-borderSoft'
              }`}
            />
          ))}

          {!prefersReducedMotion && (
            <div className="absolute bottom-0 left-1/2 h-0.5 w-16 -translate-x-1/2 overflow-hidden rounded-full bg-app-borderSoft">
              <motion.div
                key={activeIndex}
                className="h-full origin-left rounded-full bg-app-textStrong"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: SLIDE_DURATION_MS / 1000, ease: 'linear' }}
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
