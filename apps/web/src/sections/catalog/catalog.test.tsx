import userEvent from '@testing-library/user-event';
import { it, vi, expect, describe } from 'vitest';
import { screen, within } from '@testing-library/react';

import { renderWithTheme } from 'src/test/render';
import { catalogFixture } from 'src/test/fixtures';

import { Catalog } from './catalog';

const { categories } = catalogFixture;

describe('<Catalog />', () => {
  it('lists every category with its services, prices and durations', () => {
    renderWithTheme(<Catalog status="success" categories={categories} onRetry={vi.fn()} />);

    const haircuts = screen.getByRole('article', { name: 'Haircuts' });
    expect(within(haircuts).getByText('Classic Cut')).toBeInTheDocument();
    expect(within(haircuts).getByText('₹350')).toBeInTheDocument();
    expect(within(haircuts).getByText('45 min')).toBeInTheDocument();

    const beard = screen.getByRole('article', { name: 'Beard & Shave' });
    expect(within(beard).getByText('1 hr 30 min')).toBeInTheDocument();
  });

  it('filters by category with the tabs', async () => {
    renderWithTheme(<Catalog status="success" categories={categories} onRetry={vi.fn()} />);

    await userEvent.click(screen.getByRole('tab', { name: /beard & shave/i }));

    expect(screen.queryByRole('article', { name: 'Haircuts' })).not.toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Beard & Shave' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: 'All' }));
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });

  it('hides the tabs when there is only one category', () => {
    renderWithTheme(<Catalog status="success" categories={categories.slice(0, 1)} onRetry={vi.fn()} />);
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('shows a friendly message when the menu is empty', () => {
    renderWithTheme(<Catalog status="success" categories={[]} onRetry={vi.fn()} />);
    expect(screen.getByText('Our menu is being updated')).toBeInTheDocument();
  });

  it('offers a retry when loading fails', async () => {
    const onRetry = vi.fn();
    renderWithTheme(<Catalog status="error" categories={[]} onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent(/couldn.t load the menu/i);
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('shows a skeleton while loading', () => {
    renderWithTheme(<Catalog status="loading" categories={[]} onRetry={vi.fn()} />);
    expect(screen.getByLabelText('Loading services')).toBeInTheDocument();
  });
});
