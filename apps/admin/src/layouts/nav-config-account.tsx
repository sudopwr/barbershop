import { Iconify } from 'src/components/iconify';

import type { AccountPopoverProps } from './components/account-popover';

// ----------------------------------------------------------------------

export const _account: AccountPopoverProps['data'] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
  },
  {
    label: 'Services',
    href: '/services',
    icon: <Iconify width={22} icon="solar:scissors-bold-duotone" />,
  },
];
