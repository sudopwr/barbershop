import type { IconifyProps } from './iconify';
import type { IconifyName } from './register-icons';

import { Iconify } from './iconify';
import { allIconNames } from './register-icons';

// ----------------------------------------------------------------------

const FALLBACK: IconifyName = 'mdi:content-cut';

export const isIconName = (name: string): name is IconifyName =>
  (allIconNames as string[]).includes(name);

/** Renders an icon name stored in the database, falling back to scissors for unknown values. */
export function CategoryIcon({ icon, ...other }: Omit<IconifyProps, 'icon'> & { icon?: string }) {
  return <Iconify icon={icon && isIconName(icon) ? icon : FALLBACK} {...other} />;
}
