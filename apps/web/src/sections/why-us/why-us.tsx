import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

import { SectionTitle } from '../section-title';

const REASONS = [
  {
    icon: 'solar:medal-ribbons-star-bold-duotone',
    title: 'Master barbers',
    text: 'Years behind the chair, trained in classic and modern techniques.',
  },
  {
    icon: 'solar:hand-stars-bold-duotone',
    title: 'Hot towel ritual',
    text: 'Every shave finishes with hot towels, balm and a proper straight razor.',
  },
  {
    icon: 'solar:tag-price-bold-duotone',
    title: 'Honest prices',
    text: 'What you see on the menu is what you pay. No hidden extras.',
  },
  {
    icon: 'solar:smile-circle-bold-duotone',
    title: 'Relaxed atmosphere',
    text: 'Good music, a cold drink and zero rush. Take a seat.',
  },
];

export function WhyUs() {
  return (
    <Box id="why-us" component="section" aria-label="Why choose us" sx={{ py: { xs: 10, md: 14 }, scrollMarginTop: 64 }}>
      <Container>
        <SectionTitle overline="Why us" title="Old-school craft, modern comfort" />
        <Grid container spacing={3}>
          {REASONS.map((reason) => (
            <Grid key={reason.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={(theme) => ({
                  p: 4,
                  height: 1,
                  borderRadius: 3,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: alpha(theme.palette.common.white, 0.02),
                })}
              >
                <Box sx={{ color: 'primary.main', mb: 2.5 }}>
                  <Iconify icon={reason.icon} size={40} />
                </Box>
                <Typography variant="h6">{reason.title}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  {reason.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
