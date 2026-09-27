import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { APP } from '@/config/env';
import type { PublicService } from '@/lib/catalog';
import { colors, fonts } from '@/theme';
import { formatDuration, formatPrice } from '@/utils/format';

export function FeaturedCard({ service }: { service: PublicService }) {
  const router = useRouter();

  return (
    <Pressable
      testID={`featured-${service.id}`}
      accessibilityRole="button"
      accessibilityLabel={`Featured: ${service.name}, ${formatPrice(service.price, APP)}`}
      onPress={() => router.push({ pathname: '/service/[id]', params: { id: service.id } })}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.media}>
        {service.imageUrl ? (
          <Image source={{ uri: service.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
        ) : (
          <MaterialCommunityIcons name="content-cut" size={44} color={colors.gold} />
        )}
        <View style={styles.badge}>
          <MaterialCommunityIcons name="star" size={12} color={colors.ink} />
          <Text style={styles.badgeText}>Featured</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {service.name}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.price}>{formatPrice(service.price, APP)}</Text>
          <Text style={styles.duration}>{formatDuration(service.durationMinutes)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.paper,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(244, 239, 230, 0.16)',
  },
  media: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201, 164, 92, 0.12)',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    backgroundColor: colors.gold,
  },
  badgeText: { color: colors.ink, fontFamily: fonts.bold, fontSize: 11 },
  body: { padding: 14 },
  name: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  price: { fontFamily: fonts.bold, color: colors.gold, fontSize: 16 },
  duration: { color: colors.textMuted, fontSize: 13 },
});
