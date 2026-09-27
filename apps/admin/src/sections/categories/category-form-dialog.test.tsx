import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { it, vi, expect, describe } from 'vitest';

import { ApiError } from 'src/lib/http';
import { renderWithProviders } from 'src/test/render';

import { CategoryFormDialog } from './category-form-dialog';

const category = {
  id: 'c1',
  name: 'Haircuts',
  slug: 'haircuts',
  description: 'All the cuts',
  icon: 'mdi:content-cut',
  sortOrder: 2,
  isActive: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

describe('<CategoryFormDialog />', () => {
  it('requires a name of at least two characters', async () => {
    const onSubmit = vi.fn();
    renderWithProviders(<CategoryFormDialog open onClose={vi.fn()} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/name/i), 'A');
    await userEvent.click(screen.getByRole('button', { name: /create category/i }));

    expect(await screen.findByText('At least 2 characters')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the chosen icon and values, then closes', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    renderWithProviders(<CategoryFormDialog open onClose={onClose} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/name/i), 'Beard & Shave');
    await userEvent.click(screen.getByRole('radio', { name: 'mdi:mustache' }));
    await userEvent.click(screen.getByRole('button', { name: /create category/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Beard & Shave',
        description: '',
        icon: 'mdi:mustache',
        sortOrder: 0,
        isActive: true,
      })
    );
    expect(onClose).toHaveBeenCalled();
  });

  it('pre-fills the form when editing', () => {
    renderWithProviders(<CategoryFormDialog open category={category} onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/name/i)).toHaveValue('Haircuts');
    expect(screen.getByRole('radio', { name: 'mdi:content-cut' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('shows a conflict from the API and stays open', async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new ApiError(409, 'CONFLICT', 'A category named "Haircuts" already exists', { name: 'Already exists' }));
    const onClose = vi.fn();
    renderWithProviders(<CategoryFormDialog open onClose={onClose} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/name/i), 'haircuts');
    await userEvent.click(screen.getByRole('button', { name: /create category/i }));

    expect(await screen.findByText('A category named "Haircuts" already exists')).toBeInTheDocument();
    expect(screen.getByText('Already exists')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });
});
