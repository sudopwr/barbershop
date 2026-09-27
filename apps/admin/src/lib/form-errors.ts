import type { FieldValues, UseFormSetError, Path } from 'react-hook-form';

import { ApiError } from './http';

/**
 * Copies field-level errors from an API response onto the form.
 * Returns a message for anything that isn't tied to a field.
 */
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[]
): string | null {
  if (!(error instanceof ApiError)) return 'Something went wrong. Please try again.';

  let mapped = false;
  Object.entries(error.details ?? {}).forEach(([field, message]) => {
    if ((fields as readonly string[]).includes(field)) {
      setError(field as Path<T>, { type: 'server', message });
      mapped = true;
    }
  });

  return mapped && error.status !== 409 ? null : error.message;
}
