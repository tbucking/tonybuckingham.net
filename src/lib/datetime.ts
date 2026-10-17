const pad = (value: number) => String(value).padStart(2, '0');

const DEFAULT_RANGE_MS = 24 * 60 * 60 * 1000;

// Formats a Date as the local `YYYY-MM-DDTHH:mm` string the activity filters
// use, which is also what `<input type="datetime-local">` expects.
export function toDateTimeInputValue(date: Date): string {
  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    'T',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes())
  ].join('');
}

// Default filter window: the last 24 hours.
export function defaultDateRange(now: Date = new Date()): { from: string; to: string } {
  return {
    from: toDateTimeInputValue(new Date(now.getTime() - DEFAULT_RANGE_MS)),
    to: toDateTimeInputValue(now)
  };
}
