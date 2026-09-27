import type { PublicCategory } from 'src/api/catalog';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

import { ServiceRow } from './service-row';
import { SectionTitle } from '../section-title';

type Props = {
  status: 'loading' | 'success' | 'error';
  categories: PublicCategory[];
  onRetry: () => void;
};

const ALL = 'all';

export function Catalog({ status, categories, onRetry }: Props) {
  const [selected, setSelected] = useState(ALL);
  const visible = selected === ALL ? categories : categories.filter((c) => c.slug === selected);

  return (
    <Box
      id="services"
      component="section"
      aria-label="Services and prices"
      sx={(theme) => ({
        py: { xs: 10, md: 14 },
        scrollMarginTop: 64,
        bgcolor: alpha(theme.palette.common.white, 0.015),
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'divider',
      })}
    >
      <Container>
        <SectionTitle
          overline="The menu"
          title="Services & prices"
          description="Every service includes a consultation, so you leave with exactly the look you asked for."
        />

        {status === 'loading' && <CatalogSkeleton />}

        {status === 'error' && (
          <Box role="alert" sx={{ textAlign: 'center', py: 6 }}>
            <Iconify icon="solar:danger-triangle-bold" size={40} style={{ opacity: 0.6 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              We couldn&apos;t load the menu right now
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, mb: 3 }}>
              Please check your connection and try again.
            </Typography>
            <Button variant="outlined" onClick={onRetry} startIcon={<Iconify icon="solar:refresh-linear" />}>
              Try again
            </Button>
          </Box>
        )}

        {status === 'success' && categories.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6">Our menu is being updated</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Pop in or give us a call — we&apos;ll be happy to help.
            </Typography>
          </Box>
        )}

        {status === 'success' && categories.length > 0 && (
          <>
            {categories.length > 1 && (
              <Tabs
                value={selected}
                onChange={(_, value: string) => setSelected(value)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="Filter services by category"
                slotProps={{ indicator: { sx: { display: 'none' } } }}
                sx={{
                  mb: 6,
                  mx: 'auto',
                  width: 'fit-content',
                  maxWidth: 1,
                  '& .MuiTabs-flexContainer': { gap: 1 },
                  '& .MuiTab-root': { px: 2.5, border: 1, borderColor: 'divider', color: 'text.secondary' },
                  '& .Mui-selected': { bgcolor: 'primary.main', borderColor: 'primary.main', color: 'primary.contrastText !important' },
                }}
              >
                <Tab value={ALL} label="All" />
                {categories.map((c) => (
                  <Tab
                    key={c.id}
                    value={c.slug}
                    label={c.name}
                    icon={<Iconify icon={c.icon} size={18} />}
                    iconPosition="start"
                  />
                ))}
              </Tabs>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 8, md: 10 } }}>
              {visible.map((category) => (
                <CategoryBlock key={category.id} category={category} />
              ))}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}

function CategoryBlock({ category }: { category: PublicCategory }) {
  const half = Math.ceil(category.services.length / 2);
  const columns = [category.services.slice(0, half), category.services.slice(half)].filter((col) => col.length);

  return (
    <Box component="article" aria-labelledby={`cat-${category.id}`}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Box
          sx={(theme) => ({
            width: 52,
            height: 52,
            flexShrink: 0,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            color: 'primary.main',
            bgcolor: alpha(theme.palette.primary.main, 0.12),
          })}
        >
          <Iconify icon={category.icon} size={28} />
        </Box>
        <Box>
          <Typography id={`cat-${category.id}`} variant="h3" sx={{ fontSize: { xs: 26, md: 32 } }}>
            {category.name}
          </Typography>
          {category.description && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {category.description}
            </Typography>
          )}
        </Box>
      </Box>

      <Grid container columnSpacing={8}>
        {columns.map((services, i) => (
          <Grid key={i} size={{ xs: 12, md: columns.length > 1 ? 6 : 12 }}>
            <Box component="ul" sx={{ p: 0, m: 0 }}>
              {services.map((service) => (
                <ServiceRow key={service.id} service={service} />
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function CatalogSkeleton() {
  return (
    <Box aria-label="Loading services" aria-busy>
      <Skeleton variant="rounded" width={320} height={44} sx={{ mx: 'auto', mb: 6, borderRadius: 999 }} />
      <Grid container columnSpacing={8}>
        {[0, 1].map((col) => (
          <Grid key={col} size={{ xs: 12, md: 6 }}>
            {[0, 1, 2].map((row) => (
              <Box key={row} sx={{ py: 2.5 }}>
                <Skeleton width="80%" height={28} />
                <Skeleton width="60%" />
              </Box>
            ))}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
