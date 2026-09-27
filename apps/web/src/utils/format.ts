import { APP } from 'src/config/shop';

export function formatPrice(value: number, { currency = APP.currency, locale = APP.locale } = {}) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** 45 → "45 min", 60 → "1 hr", 90 → "1 hr 30 min" */
export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}
