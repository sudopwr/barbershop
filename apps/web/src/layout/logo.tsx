import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { SHOP } from 'src/config/shop';
import { Iconify } from 'src/components/iconify';

export function Logo() {
  return (
    <Box
      component="a"
      href="#top"
      aria-label={`${SHOP.name} — back to top`}
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.25, color: 'text.primary', textDecoration: 'none' }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: '11px',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <Iconify icon="mdi:content-cut" size={22} />
      </Box>
      <Typography component="span" sx={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, fontSize: 19 }}>
        {SHOP.name}
      </Typography>
    </Box>
  );
}
