import type { CardProps } from '@mui/material/Card';
import type { PaletteColorKey } from 'src/theme/core';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  value?: string;
  caption?: string;
  color?: PaletteColorKey;
  icon: React.ReactNode;
  loading?: boolean;
};

/** Kit's summary widget, trimmed to a single figure (no sparkline). */
export function StatCard({ title, value, caption, icon, loading, color = 'primary', sx, ...other }: Props) {
  return (
    <Card
      sx={[
        (theme) => ({
          p: 3,
          boxShadow: 'none',
          position: 'relative',
          color: `${color}.darker`,
          backgroundColor: 'common.white',
          backgroundImage: `linear-gradient(135deg, ${varAlpha(theme.vars.palette[color].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)})`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ width: 48, height: 48, mb: 3 }}>{icon}</Box>

      <Box sx={{ mb: 1, typography: 'subtitle2' }}>{title}</Box>

      <Box sx={{ typography: 'h4' }}>{loading ? <Skeleton width={80} /> : value}</Box>

      {caption && (
        <Box sx={{ mt: 0.5, typography: 'caption', opacity: 0.72 }}>{loading ? <Skeleton width={120} /> : caption}</Box>
      )}

      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: -1,
          height: 240,
          opacity: 0.24,
          position: 'absolute',
          color: `${color}.main`,
        }}
      />
    </Card>
  );
}
