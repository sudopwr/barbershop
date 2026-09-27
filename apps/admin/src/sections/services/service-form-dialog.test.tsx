import userEvent from '@testing-library/user-event';
import { it, vi, expect, describe } from 'vitest';
import { screen, waitFor } from '@testing-library/react';

import { renderWithProviders } from 'src/test/render';

import { ServiceFormDialog } from './service-form-dialog';

const categories = [
  {
    id: 'c1',
    name: 'Haircuts',
    slug: 'haircuts',
    description: '',
    icon: 'mdi:content-cut',
    sortOrder: 0,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

describe('<ServiceFormDialog />', () => {
  it('rejects an empty price and a too-short duration', async () => {
    const onSubmit = vi.fn();
    renderWithProviders(<ServiceFormDialog open categories={categories} onClose={vi.fn()} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/service name/i), 'Skin Fade');
    await userEvent.clear(screen.getByLabelText(/^price/i));
    await userEvent.clear(screen.getByLabelText(/^duration/i));
    await userEvent.type(screen.getByLabelText(/^duration/i), '2');
    await userEvent.click(screen.getByRole('button', { name: /create service/i }));

    expect(await screen.findByText('Enter a price')).toBeInTheDocument();
    expect(screen.getByText('At least 5 minutes')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rejects image links that are not http(s)', async () => {
    renderWithProviders(<ServiceFormDialog open categories={categories} onClose={vi.fn()} onSubmit={vi.fn()} />);

    await userEvent.type(screen.getByLabelText(/service name/i), 'Skin Fade');
    await userEvent.type(screen.getByLabelText(/image url/i), 'javascript:alert(1)');
    await userEvent.click(screen.getByRole('button', { name: /create service/i }));

    expect(await screen.findByText('Must start with http:// or https://')).toBeInTheDocument();
  });

  it('submits numbers, not strings, and defaults to the first category', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(<ServiceFormDialog open categories={categories} onClose={vi.fn()} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/service name/i), 'Skin Fade');
    await userEvent.clear(screen.getByLabelText(/^price/i));
    await userEvent.type(screen.getByLabelText(/^price/i), '450.5');
    await userEvent.click(screen.getByRole('button', { name: /create service/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ categoryId: 'c1', name: 'Skin Fade', price: 450.5, durationMinutes: 30, isActive: true })
      )
    );
  });
});
