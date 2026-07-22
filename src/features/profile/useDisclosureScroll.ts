import { useEffect, useRef } from 'react';

import { scrollElementIntoViewIfBelow } from '../../utils/scrollElementIntoViewIfBelow.ts';

type DisclosureScrollOptions = {
  scrollOnCollapse?: boolean;
};

export function useDisclosureScroll(
  isExpanded: boolean,
  { scrollOnCollapse = false }: DisclosureScrollOptions = {}
) {
  const elementRef = useRef<HTMLDivElement>(null);
  const previousExpandedStateRef = useRef(isExpanded);

  useEffect(() => {
    if (previousExpandedStateRef.current === isExpanded) return;

    previousExpandedStateRef.current = isExpanded;
    if ((!isExpanded && !scrollOnCollapse) || !elementRef.current) return;

    return scrollElementIntoViewIfBelow(elementRef.current);
  }, [isExpanded, scrollOnCollapse]);

  return elementRef;
}
