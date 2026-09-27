import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type GlyphName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const FALLBACK: GlyphName = 'content-cut';

/**
 * The admin stores icons as Iconify names ("mdi:content-cut"). Material Design Icons
 * ship with Expo, so "mdi:*" maps 1:1; anything else falls back to scissors.
 */
export function toGlyph(icon?: string): GlyphName {
  if (!icon?.startsWith('mdi:')) return FALLBACK;
  const name = icon.slice(4);
  return name in MaterialCommunityIcons.glyphMap ? (name as GlyphName) : FALLBACK;
}

type Props = Omit<ComponentProps<typeof MaterialCommunityIcons>, 'name'> & { icon?: string };

export function CategoryIcon({ icon, ...other }: Props) {
  return <MaterialCommunityIcons name={toGlyph(icon)} {...other} />;
}
