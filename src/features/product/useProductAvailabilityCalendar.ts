import { useCallback, useEffect, useState } from 'react';

import {
  getProductAvailabilityCalendar,
  type ProductAvailabilityCalendarResponse,
} from '../../api/product.ts';
import { formatLocalDate } from '../../utils/localDate.ts';

type ProductAvailabilityCalendarOptions = {
  productSlug: string;
  quantity: number;
  size?: string | null;
};

export function useProductAvailabilityCalendar({
  productSlug,
  quantity,
  size,
}: ProductAvailabilityCalendarOptions) {
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set());
  const [isFullyUnavailable, setIsFullyUnavailable] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    const loadAvailability = async () => {
      try {
        const result = await getProductAvailabilityCalendar(productSlug, quantity, size);
        if (!isCurrent) return;

        const availability = result.data as ProductAvailabilityCalendarResponse | undefined;
        if (result.error || !availability) {
          setUnavailableDates(new Set());
          setIsFullyUnavailable(false);
          return;
        }

        setUnavailableDates(new Set(availability.unavailableDates));
        setIsFullyUnavailable(availability.fullyUnavailable);
      } catch {
        if (isCurrent) {
          setUnavailableDates(new Set());
          setIsFullyUnavailable(false);
        }
      }
    };

    void loadAvailability();
    return () => {
      isCurrent = false;
    };
  }, [productSlug, quantity, size]);

  const isDateAvailable = useCallback(
    (date: Date) => !isFullyUnavailable && !unavailableDates.has(formatLocalDate(date)),
    [isFullyUnavailable, unavailableDates]
  );

  const isEndDateAvailable = useCallback(
    (date: Date, startDate: Date | null) => {
      if (!isDateAvailable(date) || !startDate) return isDateAvailable(date);

      const formattedStartDate = formatLocalDate(startDate);
      const formattedDate = formatLocalDate(date);
      const firstUnavailableDateAfterStart = [...unavailableDates]
        .filter((unavailableDate) => unavailableDate > formattedStartDate)
        .sort()[0];

      return !firstUnavailableDateAfterStart || formattedDate < firstUnavailableDateAfterStart;
    },
    [isDateAvailable, unavailableDates]
  );

  return { isDateAvailable, isEndDateAvailable };
}
