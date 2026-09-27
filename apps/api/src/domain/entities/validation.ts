import { ValidationError } from '../errors/index.js';

/** Collects field errors so a single ValidationError reports all of them. */
export class Validator {
  private readonly errors: Record<string, string> = {};

  requireText(field: string, value: unknown, { min = 1, max = 120 } = {}): string {
    const text = typeof value === 'string' ? value.trim() : '';
    if (text.length < min) this.errors[field] = `${field} is required`;
    else if (text.length > max) this.errors[field] = `${field} must be at most ${max} characters`;
    return text;
  }

  optionalText(field: string, value: unknown, { max = 500 } = {}): string {
    if (value === undefined || value === null) return '';
    if (typeof value !== 'string') {
      this.errors[field] = `${field} must be text`;
      return '';
    }
    const text = value.trim();
    if (text.length > max) this.errors[field] = `${field} must be at most ${max} characters`;
    return text;
  }

  optionalUrl(field: string, value: unknown): string {
    const text = this.optionalText(field, value, { max: 2048 });
    if (text && !/^https?:\/\/\S+$/i.test(text)) this.errors[field] = `${field} must be a valid http(s) URL`;
    return text;
  }

  money(field: string, value: unknown, { max = 1_000_000 } = {}): number {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max) {
      this.errors[field] = `${field} must be a number between 0 and ${max}`;
      return 0;
    }
    // Stored with at most two decimals
    return Math.round(value * 100) / 100;
  }

  integer(field: string, value: unknown, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}): number {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
      this.errors[field] = `${field} must be a whole number between ${min} and ${max}`;
      return min;
    }
    return value;
  }

  boolean(field: string, value: unknown, fallback: boolean): boolean {
    if (value === undefined) return fallback;
    if (typeof value !== 'boolean') {
      this.errors[field] = `${field} must be true or false`;
      return fallback;
    }
    return value;
  }

  assertValid(message = 'Invalid input'): void {
    if (Object.keys(this.errors).length > 0) throw new ValidationError(message, { ...this.errors });
  }
}

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
