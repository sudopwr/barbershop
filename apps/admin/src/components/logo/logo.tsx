import type { LinkProps } from '@mui/material/Link';

import { useId } from 'react';
import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

// Scissors glyph (Material Design Icons "content-cut", Apache-2.0)
const SCISSORS =
  'm19 3l-6 6l2 2l7-7V3m-10 9.5a.5.5 0 0 1-.5-.5a.5.5 0 0 1 .5-.5a.5.5 0 0 1 .5.5a.5.5 0 0 1-.5.5M6 20a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2M6 8a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2m3.64-.36c.23-.5.36-1.05.36-1.64a4 4 0 0 0-4-4a4 4 0 0 0-4 4a4 4 0 0 0 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14a4 4 0 0 0-4 4a4 4 0 0 0 4 4a4 4 0 0 0 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1z';

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export function Logo({
  sx,
  disabled,
  className,
  href = '/',
  isSingle = true,
  ...other
}: LogoProps) {
  const theme = useTheme();
  const gradientId = useId();

  const mark = (
    <svg width="100%" height="100%" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor={theme.vars.palette.primary.light} />
          <stop offset="1" stopColor={theme.vars.palette.primary.dark} />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill={`url(#${gradientId})`} />
      <g transform="translate(8 8)">
        <path fill="#FFFFFF" d={SCISSORS} />
      </g>
    </svg>
  );

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Barber Shop home"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          height: 40,
          ...(isSingle && { width: 40 }),
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ width: 40, height: 40, flexShrink: 0 }}>{mark}</Box>
      {!isSingle && (
        <Box
          component="span"
          sx={{
            ml: 1.25,
            color: 'text.primary',
            typography: 'h6',
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          Barber
        </Box>
      )}
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  alignItems: 'center',
  verticalAlign: 'middle',
}));
