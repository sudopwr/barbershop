export function formatPrice(value: number, { currency = 'INR', locale = 'en-IN' } = {}) {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    // Very old Android JS engines may lack full Intl support
    return `${currency} ${Number.isInteger(value) ? value : value.toFixed(2)}`;
  }
}

/** 45 → "45 min", 60 → "1 hr", 90 → "1 hr 30 min" */
export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

/** Strips spaces so "+91 98765 43210" works in a tel: link. */
export const toTelUrl = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
