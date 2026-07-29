import type { MouseEvent } from 'react';

export const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
  event.preventDefault();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  });
};
