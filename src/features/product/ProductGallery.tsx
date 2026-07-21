import { useReducer } from 'react';
import { AnimatePresence, motion, type PanInfo, useReducedMotion } from 'motion/react';
import { type ProductProps } from './productProps';

const SWIPE_OFFSET_THRESHOLD_PX = 50;
const SWIPE_VELOCITY_THRESHOLD_PX = 500;

const SLIDE_VARIANTS = {
  enter: (direction: 1 | -1) => ({ x: direction === 1 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (direction: 1 | -1) => ({ x: direction === 1 ? '-100%' : '100%' }),
};

type GalleryState = {
  position: number;
  direction: 1 | -1;
};

type GalleryAction =
  | { type: 'change'; direction: 1 | -1 }
  | { type: 'select'; index: number; imageCount: number };

const INITIAL_GALLERY_STATE: GalleryState = { position: 0, direction: 1 };

function getImageIndex(position: number, imageCount: number) {
  return ((position % imageCount) + imageCount) % imageCount;
}

function galleryReducer(state: GalleryState, action: GalleryAction): GalleryState {
  if (action.type === 'change') {
    return {
      position: state.position + action.direction,
      direction: action.direction,
    };
  }

  const currentIndex = getImageIndex(state.position, action.imageCount);
  if (currentIndex === action.index) return state;

  return {
    position: state.position + action.index - currentIndex,
    direction: action.index > currentIndex ? 1 : -1,
  };
}

export default function ProductGallery({ product }: { product: ProductProps }) {
  const [{ position: slidePosition, direction: slideDirection }, dispatch] = useReducer(
    galleryReducer,
    INITIAL_GALLERY_STATE
  );
  const prefersReducedMotion = useReducedMotion();

  const images = product.images;
  const selectedImage = getImageIndex(slidePosition, images.length);

  const changeImage = (direction: 1 | -1) => {
    dispatch({ type: 'change', direction });
  };

  const selectImage = (index: number) => {
    dispatch({ type: 'select', index, imageCount: images.length });
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
            <div className="flex shrink-0 flex-col gap-2 align-middle">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={product.alt}
                  className={`h-24 w-32 shrink-0 rounded-lg border-[2px] object-contain ${index === selectedImage ? 'border-app-border' : 'border-app-borderSoft'}`}
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
