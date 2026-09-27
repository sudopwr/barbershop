import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyContent({ title, description, action }: Props) {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        gap: 1,
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Iconify icon="solar:scissors-bold-duotone" width={56} sx={{ color: 'text.disabled', mb: 1 }} />
      <Typography variant="h6">{title}</Typography>
      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360 }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Box>
  );
}
