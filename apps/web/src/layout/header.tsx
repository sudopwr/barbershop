import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { alpha } from '@mui/material/styles';

import { SHOP } from 'src/config/shop';
import { Iconify } from 'src/components/iconify';

import { Logo } from './logo';

export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Why us', href: '#why-us' },
  { label: 'Visit', href: '#visit' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="transparent"
      sx={(theme) => ({
        transition: theme.transitions.create(['background-color', 'border-color', 'backdrop-filter']),
        borderBottom: '1px solid transparent',
        ...(scrolled && {
          backdropFilter: 'blur(12px)',
          bgcolor: alpha(theme.palette.background.default, 0.82),
          borderColor: theme.palette.divider,
        }),
      })}
    >
      <Container>
        <Toolbar disableGutters sx={{ height: { xs: 64, md: 76 }, gap: 2 }}>
          <Logo />
          <Box sx={{ flexGrow: 1 }} />
          <Stack component="nav" direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {NAV_LINKS.map((link) => (
              <Button key={link.href} href={link.href} color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
                {link.label}
              </Button>
            ))}
          </Stack>
          <Button
            variant="contained"
            href={`tel:${SHOP.phone.replace(/\s/g, '')}`}
            startIcon={<Iconify icon="solar:phone-calling-bold-duotone" />}
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Call us
          </Button>
          <Button
            variant="contained"
            href={`tel:${SHOP.phone.replace(/\s/g, '')}`}
            aria-label="Call us"
            sx={{ display: { xs: 'inline-flex', sm: 'none' }, minWidth: 0, px: 1.5 }}
          >
            <Iconify icon="solar:phone-calling-bold-duotone" />
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
