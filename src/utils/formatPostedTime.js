/** Human-readable "Posted …" label for job listings (design / API `postedAt` ISO string). */
export function formatPostedTime(isoOrDate) {
  if (!isoOrDate) return null;
  const then = new Date(isoOrDate).getTime();
  if (Number.isNaN(then)) return null;

  const diffSec = Math.round((then - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

  const abs = Math.abs(diffSec);
  if (abs < 60) return `Posted ${rtf.format(diffSec, 'second')}`;
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return `Posted ${rtf.format(diffMin, 'minute')}`;
  const diffHr = Math.round(diffMin / 60);
  if (Math.abs(diffHr) < 24) return `Posted ${rtf.format(diffHr, 'hour')}`;
  const diffDay = Math.round(diffHr / 24);
  if (Math.abs(diffDay) < 30) return `Posted ${rtf.format(diffDay, 'day')}`;
  const diffMonth = Math.round(diffDay / 30);
  if (Math.abs(diffMonth) < 12) return `Posted ${rtf.format(diffMonth, 'month')}`;
  const diffYear = Math.round(diffMonth / 12);
  return `Posted ${rtf.format(diffYear, 'year')}`;
}
