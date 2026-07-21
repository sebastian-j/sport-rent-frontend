export function scrollElementIntoViewIfBelow(element: HTMLElement) {
  const startPosition = window.scrollY;
  const scrollMarginTop = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
  const targetPosition = startPosition + element.getBoundingClientRect().top - scrollMarginTop;

  if (startPosition <= targetPosition) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || window.matchMedia('(min-width: 768px)').matches) {
    element.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
    return;
  }

  const distance = targetPosition - startPosition;
  const animationDuration = 200;
  let animationFrameId = 0;
  let startTime: number | undefined;

  const animateScroll = (currentTime: number) => {
    startTime ??= currentTime;
    const progress = Math.min((currentTime - startTime) / animationDuration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    window.scrollTo({ top: startPosition + distance * easedProgress });

    if (progress < 1) animationFrameId = requestAnimationFrame(animateScroll);
  };

  animationFrameId = requestAnimationFrame(animateScroll);

  return () => cancelAnimationFrame(animationFrameId);
}
