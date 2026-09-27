import { it, vi, expect, describe } from 'vitest';

import { ApiError } from './http';
import { applyServerErrors } from './form-errors';

describe('applyServerErrors', () => {
  it('maps known field errors onto the form and hides the generic message', () => {
    const setError = vi.fn();
    const error = new ApiError(400, 'VALIDATION_ERROR', 'Invalid service', { price: 'too high', other: 'x' });

    const message = applyServerErrors(error, setError, ['price', 'name']);

    expect(setError).toHaveBeenCalledExactlyOnceWith('price', { type: 'server', message: 'too high' });
    expect(message).toBeNull();
  });

  it('keeps the message for conflicts so the user sees the reason', () => {
    const error = new ApiError(409, 'CONFLICT', '"Hair" already exists', { name: 'Already exists' });
    expect(applyServerErrors(error, vi.fn(), ['name'])).toBe('"Hair" already exists');
  });

  it('falls back to a generic message for unexpected errors', () => {
    expect(applyServerErrors(new Error('boom'), vi.fn(), ['name'])).toMatch(/something went wrong/i);
  });
});
