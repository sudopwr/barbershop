import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { SHOP } from 'src/config/shop';
import { Iconify } from 'src/components/iconify';

import { Logo } from './logo';
import { NAV_LINKS } from './header';

export function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', py: 6 }}>
      <Container>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Box>
            <Logo />
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5, maxWidth: 360 }}>
              {SHOP.tagline}
            </Typography>
          </Box>

          <Stack direction="row" spacing={3} component="nav" aria-label="Footer">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} color="text.secondary" underline="hover" variant="body2">
                {link.label}
              </Link>
            ))}
            {SHOP.instagram && (
              <Link href={SHOP.instagram} target="_blank" rel="noopener noreferrer" color="text.secondary" aria-label="Instagram">
                <Iconify icon="mdi:instagram" />
              </Link>
            )}
          </Stack>
        </Stack>

        <Typography variant="caption" component="p" sx={{ color: 'text.disabled', mt: 5 }}>
          © {new Date().getFullYear()} {SHOP.name}. Prices include taxes and may change without notice.
        </Typography>
      </Container>
    </Box>
  );
}
