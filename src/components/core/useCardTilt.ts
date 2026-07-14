import { useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type { PointerEvent } from 'react';

const MAX_CARD_TILT_DEGREES = 3;
const MAX_IMAGE_TILT_DEGREES = 1;
const MAX_IMAGE_SHIFT_PIXELS = 2;

type CardTiltOptions = {
  maxCardTiltDegrees?: number;
  maxImageTiltDegrees?: number;
  maxImageShiftPixels?: number;
};

export function useCardTilt({
  maxCardTiltDegrees = MAX_CARD_TILT_DEGREES,
  maxImageTiltDegrees = MAX_IMAGE_TILT_DEGREES,
  maxImageShiftPixels = MAX_IMAGE_SHIFT_PIXELS,
}: CardTiltOptions = {}) {
  const prefersReducedMotion = useReducedMotion();
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, { stiffness: 240, damping: 24 });
  const rotateY = useSpring(rotateYValue, { stiffness: 240, damping: 24 });
  const imageRotateXValue = useMotionValue(0);
  const imageRotateYValue = useMotionValue(0);
  const imageXValue = useMotionValue(0);
  const imageYValue = useMotionValue(0);
  const imageRotateX = useSpring(imageRotateXValue, { stiffness: 180, damping: 20 });
  const imageRotateY = useSpring(imageRotateYValue, { stiffness: 180, damping: 20 });
  const imageX = useSpring(imageXValue, { stiffness: 180, damping: 20 });
  const imageY = useSpring(imageYValue, { stiffness: 180, damping: 20 });

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontalPosition = (event.clientX - bounds.left) / bounds.width - 0.5;
    const verticalPosition = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateXValue.set(verticalPosition * -2 * maxCardTiltDegrees);
    rotateYValue.set(horizontalPosition * 2 * maxCardTiltDegrees);
    imageRotateXValue.set(verticalPosition * 2 * maxImageTiltDegrees);
    imageRotateYValue.set(horizontalPosition * -2 * maxImageTiltDegrees);
    imageXValue.set(horizontalPosition * -2 * maxImageShiftPixels);
    imageYValue.set(verticalPosition * -2 * maxImageShiftPixels);
  };

  const resetTilt = () => {
    rotateXValue.set(0);
    rotateYValue.set(0);
    imageRotateXValue.set(0);
    imageRotateYValue.set(0);
    imageXValue.set(0);
    imageYValue.set(0);
  };

  return {
    cardStyle: {
      rotateX,
      rotateY,
      transformPerspective: 900,
      transformStyle: 'preserve-3d' as const,
    },
    imageStyle: {
      rotateX: imageRotateX,
      rotateY: imageRotateY,
      x: imageX,
      y: imageY,
      scale: 1.1,
      transformPerspective: 700,
    },
    hoverAnimation: prefersReducedMotion
      ? undefined
      : { scale: 1.025, boxShadow: '0 16px 32px rgb(0 0 0 / 0.16)' },
    handlePointerMove,
    resetTilt,
  };
}
