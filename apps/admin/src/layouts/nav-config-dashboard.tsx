import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
  /** Opens in a new tab instead of routing inside the app. */
  external?: boolean;
};

export const navData: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <Iconify width={24} icon="solar:chart-2-bold-duotone" />,
  },
  {
    title: 'Categories',
    path: '/categories',
    icon: <Iconify width={24} icon="solar:widget-5-bold-duotone" />,
  },
  {
    title: 'Services',
    path: '/services',
    icon: <Iconify width={24} icon="solar:scissors-bold-duotone" />,
  },
  {
    title: 'View website',
    path: CONFIG.websiteUrl,
    external: true,
    icon: <Iconify width={24} icon="solar:home-angle-bold-duotone" />,
  },
];
