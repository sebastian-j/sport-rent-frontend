export type RentalDate = {
  id: number;
  quantity: number;
  start_date: Date | null;
  end_date: Date | null;
};

export function toDayTimestamp(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isRentalDateValid(
  date: RentalDate
): date is RentalDate & { start_date: Date; end_date: Date } {
  if (!date.start_date || !date.end_date) return false;

  const today = toDayTimestamp(new Date());
  const start = toDayTimestamp(date.start_date);
  const end = toDayTimestamp(date.end_date);

  return start >= today && end >= start;
}
