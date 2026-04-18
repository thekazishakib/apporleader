/** Parse event.date from ISO or human strings like "Oct 15, 2026". */
export function parseFlexibleDate(dateStr: string): number {
  if (!dateStr) return 0;
  const trimmed = dateStr.trim();
  const parsed = Date.parse(trimmed);
  if (!isNaN(parsed)) return parsed;
  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

function startOfTodayTs(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function isUpcomingEvent(dateStr: string): boolean {
  return parseFlexibleDate(dateStr) >= startOfTodayTs();
}

/** Upcoming first (soonest first), then past (most recent first). */
export function sortEventsForDisplay<T extends { date: string }>(events: T[]): T[] {
  const today = startOfTodayTs();
  return [...events].sort((a, b) => {
    const ta = parseFlexibleDate(a.date);
    const tb = parseFlexibleDate(b.date);
    const aPast = ta < today;
    const bPast = tb < today;
    if (aPast !== bPast) return aPast ? 1 : -1;
    if (aPast) return tb - ta;
    return ta - tb;
  });
}
