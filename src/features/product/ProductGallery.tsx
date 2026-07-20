import { useState } from 'react';
import { AnimatePresence, motion, type PanInfo, useReducedMotion } from 'motion/react';
import { type ProductProps } from './productProps';

const SWIPE_OFFSET_THRESHOLD_PX = 50;
const SWIPE_VELOCITY_THRESHOLD_PX = 500;

const SLIDE_VARIANTS = {
  enter: (direction: 1 | -1) => ({ x: direction === 1 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (direction: 1 | -1) => ({ x: direction === 1 ? '-100%' : '100%' }),
};

export default function ProductGallery({ product }: { product: ProductProps }) {
  const [slidePosition, setSlidePosition] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const prefersReducedMotion = useReducedMotion();

  const images = product.images;
  const selectedImage = ((slidePosition % images.length) + images.length) % images.length;

  const changeImage = (direction: 1 | -1) => {
    setSlideDirection(direction);
    setSlidePosition((currentPosition) => currentPosition + direction);
  };

  const selectImage = (index: number) => {
    if (index === selectedImage) return;

    setSlideDirection(index > selectedImage ? 1 : -1);
    setSlidePosition((currentPosition) => {
      const currentIndex = ((currentPosition % images.length) + images.length) % images.length;
      return currentPosition + index - currentIndex;
    });
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipedLeft =
      info.offset.x < -SWIPE_OFFSET_THRESHOLD_PX || info.velocity.x < -SWIPE_VELOCITY_THRESHOLD_PX;
    const swipedRight =
      info.offset.x > SWIPE_OFFSET_THRESHOLD_PX || info.velocity.x > SWIPE_VELOCITY_THRESHOLD_PX;

    if (swipedLeft) {
      changeImage(1);
    } else if (swipedRight) {
      changeImage(-1);
    }
  };

  return (
    <>
      <section
        aria-label={`Galeria produktu ${product.name}`}
        className="w-full min-[961px]:hidden"
      >
        <div
          className={
            images.length === 1
              ? 'relative w-full overflow-hidden rounded-lg'
              : 'relative aspect-[4/3] w-full overflow-hidden rounded-lg'
          }
        >
          <AnimatePresence initial={false} custom={slideDirection}>
            <motion.img
              key={slidePosition}
              src={images[selectedImage]}
              alt={`${product.alt} — zdjęcie ${selectedImage + 1}`}
              className={
                images.length === 1
                  ? 'relative block h-auto w-full select-none'
                  : 'absolute inset-0 h-full w-full select-none object-contain'
              }
              custom={slideDirection}
              variants={SLIDE_VARIANTS}
              drag={images.length > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.35}
              dragMomentum={false}
              draggable={false}
              onDragEnd={handleDragEnd}
              initial="enter"
              animate="center"
              exit="exit"
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 300, damping: 32 }
              }
            />
          </AnimatePresence>
        </div>

        {images.length > 1 && (
          <div className="flex h-8 items-center justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Pokaż zdjęcie ${index + 1} z ${images.length}`}
                aria-current={index === selectedImage ? 'true' : undefined}
                onClick={() => selectImage(index)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  index === selectedImage ? 'bg-app-textStrong' : 'bg-app-borderSoft'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      <div className="hidden w-full flex-col gap-4 min-[961px]:flex">
        <div className="flex w-full flex-row gap-4">
          {images.length > 1 && (
            <div className="flex flex-col gap-2 align-middle">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={product.alt}
                  className={`h-[12vh] w-auto rounded-lg border-[2px] ${index === selectedImage ? 'border-app-border' : 'border-app-borderSoft'}`}
                  onClick={() => selectImage(index)}
                />
              ))}
            </div>
          )}
          <div className={`flex flex-col gap-2 ${images.length === 1 ? 'w-full' : ''}`}>
            <img
              src={images[selectedImage]}
              alt={product.alt}
              className={images.length === 1 ? 'h-auto w-full rounded-lg' : 'w-[30vw] rounded-lg'}
            />
          </div>
        </div>
      </div>
    </>
  );
}
