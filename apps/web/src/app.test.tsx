import userEvent from '@testing-library/user-event';
import { it, vi, expect, describe } from 'vitest';
import { screen, waitFor } from '@testing-library/react';

import { catalogFixture } from 'src/test/fixtures';
import { jsonResponse, renderWithTheme } from 'src/test/render';

import App from './app';

describe('<App />', () => {
  it('loads the public catalog and renders the landing page', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(catalogFixture));

    renderWithTheme(<App />);

    expect(fetchMock).toHaveBeenCalledWith('/api/public/catalog', expect.anything());
    expect(await screen.findByRole('article', { name: 'Haircuts' })).toBeInTheDocument();
    expect(screen.getByText('From ₹300')).toBeInTheDocument();
    expect(screen.getByText('3 services')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Featured services' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Opening hours' })).toBeInTheDocument();
  });

  it('has no admin or sign-up entry points — visitors can only browse', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(catalogFixture));
    renderWithTheme(<App />);
    await screen.findByRole('article', { name: 'Haircuts' });

    expect(screen.queryByText(/sign in|sign up|register|log in/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('recovers after a failed request when the visitor retries', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(jsonResponse({}, 500))
      .mockResolvedValueOnce(jsonResponse(catalogFixture));

    renderWithTheme(<App />);

    await userEvent.click(await screen.findByRole('button', { name: /try again/i }));

    await waitFor(() => expect(screen.getByRole('article', { name: 'Haircuts' })).toBeInTheDocument());
  });
});
