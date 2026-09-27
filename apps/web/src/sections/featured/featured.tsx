import type { PublicService } from 'src/api/catalog';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { formatPrice, formatDuration } from 'src/utils/format';

import { SectionTitle } from '../section-title';

type Props = { services: PublicService[] };

export function Featured({ services }: Props) {
  if (services.length === 0) return null;

  return (
    <Box component="section" aria-label="Featured services" sx={{ py: { xs: 10, md: 14 } }}>
      <Container>
        <SectionTitle overline="House favourites" title="Most requested" />
        <Grid container spacing={3} justifyContent="center">
          {services.slice(0, 3).map((service) => (
            <Grid key={service.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={(theme) => ({
                  height: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  transition: theme.transitions.create(['transform', 'border-color']),
                  '&:hover': { transform: 'translateY(-4px)', borderColor: alpha(theme.palette.primary.main, 0.5) },
                })}
              >
                <Box
                  sx={(theme) => ({
                    height: 180,
                    position: 'relative',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'primary.main',
                    background: service.imageUrl
                      ? `center / cover no-repeat url("${service.imageUrl}")`
                      : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.main, 0.04)})`,
                  })}
                >
                  {!service.imageUrl && <Iconify icon="solar:scissors-bold-duotone" size={64} />}
                  <Chip
                    size="small"
                    color="primary"
                    icon={<Iconify icon="solar:star-bold" size={14} />}
                    label="Featured"
                    sx={{ position: 'absolute', top: 16, left: 16 }}
                  />
                </Box>
                <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5">{service.name}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, flexGrow: 1 }}>
                    {service.description}
                  </Typography>
                  <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" sx={{ color: 'primary.main' }}>
                      {formatPrice(service.price)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      <Iconify icon="solar:clock-circle-bold" size={16} />
                      {formatDuration(service.durationMinutes)}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
