import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type Props = { overline: string; title: string; description?: string; align?: 'left' | 'center' };

export function SectionTitle({ overline, title, description, align = 'center' }: Props) {
  return (
    <Box sx={{ textAlign: align, mb: { xs: 5, md: 7 }, mx: align === 'center' ? 'auto' : 0, maxWidth: 640 }}>
      <Typography variant="overline" sx={{ color: 'primary.main' }}>
        {overline}
      </Typography>
      <Typography variant="h2" sx={{ fontSize: { xs: 34, md: 46 }, mt: 1 }}>
        {title}
      </Typography>
      {description && (
        <Typography sx={{ color: 'text.secondary', mt: 2, fontSize: { md: 17 } }}>{description}</Typography>
      )}
    </Box>
  );
}
