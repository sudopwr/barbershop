import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { SHOP } from 'src/config/shop';
import { Iconify } from 'src/components/iconify';

import { SectionTitle } from '../section-title';

export function Visit() {
  const contact = [
    { icon: 'solar:map-point-bold-duotone', label: 'Address', value: SHOP.address, href: SHOP.mapsUrl },
    { icon: 'solar:phone-calling-bold-duotone', label: 'Phone', value: SHOP.phone, href: `tel:${SHOP.phone.replace(/\s/g, '')}` },
    { icon: 'solar:letter-bold-duotone', label: 'Email', value: SHOP.email, href: `mailto:${SHOP.email}` },
  ];

  return (
    <Box
      id="visit"
      component="section"
      aria-label="Visit us"
      sx={(theme) => ({
        py: { xs: 10, md: 14 },
        scrollMarginTop: 64,
        background: `linear-gradient(180deg, transparent, ${alpha(theme.palette.primary.main, 0.06)})`,
      })}
    >
      <Container>
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionTitle
              align="left"
              overline="Visit us"
              title="Drop in for a fresh cut"
              description="Walk-ins are always welcome. Call ahead at busy times and we'll let you know the wait."
            />
            <Stack spacing={3}>
              {contact.map((item) => (
                <Stack key={item.label} direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ color: 'primary.main', mt: 0.25 }}>
                    <Iconify icon={item.icon} size={26} />
                  </Box>
                  <Box>
                    <Typography variant="overline" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                      {item.label}
                    </Typography>
                    <Link href={item.href} color="text.primary" underline="hover" display="block" sx={{ fontSize: 17 }}>
                      {item.value}
                    </Link>
                  </Box>
                </Stack>
              ))}
            </Stack>
            <Button
              variant="contained"
              size="large"
              href={SHOP.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<Iconify icon="solar:map-point-bold-duotone" />}
              sx={{ mt: 5 }}
            >
              Get directions
            </Button>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{ color: 'primary.main', display: 'flex' }}>
                  <Iconify icon="solar:alarm-bold-duotone" size={28} />
                </Box>
                <Typography variant="h4">Opening hours</Typography>
              </Stack>
              <Box component="dl" sx={{ m: 0 }}>
                {SHOP.hours.map((row) => (
                  <Box
                    key={row.label}
                    sx={{ display: 'flex', justifyContent: 'space-between', py: 2, borderBottom: 1, borderColor: 'divider', '&:last-of-type': { borderBottom: 0 } }}
                  >
                    <Typography component="dt" sx={{ color: 'text.secondary' }}>
                      {row.label}
                    </Typography>
                    <Typography component="dd" sx={{ m: 0, fontWeight: 600 }}>
                      {row.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
