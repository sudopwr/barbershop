export type OpeningHours = { label: string; time: string }[];

/** "Mon – Fri=10:00 – 21:00|Sunday=Closed" → [{ label, time }] */
export function parseHours(value: string): OpeningHours {
  return value
    .split('|')
    .map((part) => part.split('='))
    .filter(([label, time]) => label?.trim() && time?.trim())
    .map(([label, time]) => ({ label: label!.trim(), time: time!.trim() }));
}
