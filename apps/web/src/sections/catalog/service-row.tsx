import type { PublicService } from 'src/api/catalog';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { formatPrice, formatDuration } from 'src/utils/format';

/** One line of the price list: name ········ price, with details underneath. */
export function ServiceRow({ service }: { service: PublicService }) {
  return (
    <Box component="li" sx={{ listStyle: 'none', py: 2.5, borderBottom: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
        <Typography variant="h6" component="h4" sx={{ fontSize: 18 }}>
          {service.name}
          {service.isFeatured && (
            <Box component="span" sx={{ color: 'primary.main', ml: 1, verticalAlign: 'middle' }} title="House favourite">
              <Iconify icon="solar:star-bold" size={14} />
            </Box>
          )}
        </Typography>
        <Box
          aria-hidden
          sx={{ flexGrow: 1, borderBottom: '2px dotted', borderColor: 'divider', transform: 'translateY(-5px)', minWidth: 24 }}
        />
        <Typography variant="h6" component="p" sx={{ color: 'primary.main', fontSize: 18, whiteSpace: 'nowrap' }}>
          {formatPrice(service.price)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mt: 0.75, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {service.description}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}
        >
          <Iconify icon="solar:clock-circle-bold" size={14} />
          {formatDuration(service.durationMinutes)}
        </Typography>
      </Box>
    </Box>
  );
}
