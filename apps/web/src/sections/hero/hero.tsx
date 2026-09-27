import type { Catalog } from 'src/api/catalog';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { SHOP } from 'src/config/shop';
import { formatPrice } from 'src/utils/format';
import { Iconify } from 'src/components/iconify';

type Props = { catalog?: Catalog };

export function Hero({ catalog }: Props) {
  const serviceCount = catalog?.categories.reduce((sum, c) => sum + c.services.length, 0) ?? 0;

  const highlights = [
    catalog?.priceFrom != null && { icon: 'solar:tag-price-bold-duotone', label: `From ${formatPrice(catalog.priceFrom)}` },
    serviceCount > 0 && { icon: 'solar:scissors-bold-duotone', label: `${serviceCount} services` },
    { icon: 'solar:clock-circle-bold-duotone', label: 'Walk-ins welcome' },
  ].filter(Boolean) as { icon: string; label: string }[];

  return (
    <Box
      id="top"
      component="section"
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: '88vh', md: '100vh' },
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 14, md: 10 },
        pb: { xs: 10, md: 8 },
        background: `radial-gradient(ellipse 80% 60% at 70% 30%, ${alpha(theme.palette.primary.main, 0.16)}, transparent 70%),
          radial-gradient(ellipse 60% 50% at 10% 90%, ${alpha(theme.palette.secondary.main, 0.12)}, transparent 70%),
          ${theme.palette.background.default}`,
      })}
    >
      {/* Barber-pole stripes, faded into the background */}
      <Box
        aria-hidden
        sx={(theme) => ({
          position: 'absolute',
          top: '-10%',
          right: { xs: '-40%', md: '-6%' },
          width: { xs: 360, md: 520 },
          height: '130%',
          transform: 'rotate(12deg)',
          opacity: 0.1,
          backgroundImage: `repeating-linear-gradient(135deg, ${theme.palette.secondary.main} 0 28px, ${theme.palette.text.primary} 28px 56px, #2B4C8C 56px 84px, ${theme.palette.text.primary} 84px 112px)`,
          maskImage: 'linear-gradient(to left, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to left, black, transparent)',
        })}
      />

      <Container sx={{ position: 'relative' }}>
        <Box sx={{ maxWidth: 720 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', display: 'block', mb: 2 }}>
            Barbershop · {SHOP.address.split(',').slice(-2, -1)[0]?.trim() || 'Your neighbourhood'}
          </Typography>

          <Typography variant="h1" sx={{ fontSize: { xs: 46, sm: 60, md: 80 }, lineHeight: 1.04 }}>
            Look sharp.
            <Box component="span" sx={{ display: 'block', color: 'primary.main', fontStyle: 'italic' }}>
              Feel sharper.
            </Box>
          </Typography>

          <Typography sx={{ color: 'text.secondary', fontSize: { xs: 17, md: 20 }, mt: 3, maxWidth: 560 }}>
            {SHOP.tagline} Browse our full menu of cuts, shaves and grooming — clear prices, no surprises.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 5 }}>
            <Button
              size="large"
              variant="contained"
              href="#services"
              endIcon={<Iconify icon="solar:arrow-right-linear" />}
            >
              View services &amp; prices
            </Button>
            <Button size="large" variant="outlined" color="inherit" href="#visit" sx={{ borderColor: 'divider' }}>
              Opening hours
            </Button>
          </Stack>

          <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap" sx={{ mt: 6 }}>
            {highlights.map((h) => (
              <Chip
                key={h.label}
                icon={<Iconify icon={h.icon} />}
                label={h.label}
                variant="outlined"
                sx={{ borderColor: 'divider', px: 0.5, '& .MuiChip-icon': { color: 'primary.main' } }}
              />
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
