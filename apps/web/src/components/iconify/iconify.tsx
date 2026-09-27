import type { IconProps } from '@iconify/react';

import { Icon, addCollection } from '@iconify/react';

import { barberIcons } from './barber-icons';

// Register the bundled icons once so nothing is fetched from the Iconify API at runtime.
const byPrefix: Record<string, Record<string, { body: string; width?: number; height?: number }>> = {};
Object.entries(barberIcons).forEach(([name, data]) => {
  const [prefix, icon] = name.split(':');
  byPrefix[prefix] = { ...byPrefix[prefix], [icon]: data };
});
Object.entries(byPrefix).forEach(([prefix, icons]) => addCollection({ prefix, icons, width: 24, height: 24 }));

export type IconName = keyof typeof barberIcons;

const isIconName = (name: string): name is IconName => name in barberIcons;

type Props = Omit<IconProps, 'icon'> & { icon: string; size?: number };

/** Renders a bundled icon; unknown names (e.g. typos saved from the admin) fall back to scissors. */
export function Iconify({ icon, size = 20, ...other }: Props) {
  return (
    <Icon
      icon={isIconName(icon) ? icon : 'mdi:content-cut'}
      width={size}
      height={size}
      aria-hidden
      {...other}
    />
  );
}
