import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, description, action }: Props) {
  return (
    <Box
      sx={{
        mb: 5,
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Typography variant="h4">{title}</Typography>
        {description && (
          <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
            {description}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}
