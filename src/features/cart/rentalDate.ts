export type RentalDate = {
  id: number;
  quantity: number;
  size: string | null;
  start_date: Date | null;
  end_date: Date | null;
};

export function toDayTimestamp(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isDateInPast(date: Date) {
  return toDayTimestamp(date) < toDayTimestamp(new Date());
}

export function isDateAfter(firstDate: Date, secondDate: Date) {
  return toDayTimestamp(firstDate) > toDayTimestamp(secondDate);
}

export function isDateRangeValid(startDate: Date, endDate: Date) {
  return !isDateInPast(startDate) && !isDateAfter(startDate, endDate);
}

export function isRentalDateValid(
  date: RentalDate,
  requiresSize = false
): date is RentalDate & { start_date: Date; end_date: Date } {
  if (!date.start_date || !date.end_date) return false;
  if (requiresSize && !date.size) return false;

  return isDateRangeValid(date.start_date, date.end_date);
}
