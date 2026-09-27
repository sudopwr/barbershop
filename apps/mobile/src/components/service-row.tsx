import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { APP } from '@/config/env';
import type { PublicService } from '@/lib/catalog';
import { colors, fonts } from '@/theme';
import { formatDuration, formatPrice } from '@/utils/format';

/** One line of the price list. Tapping opens the service details. */
export function ServiceRow({ service }: { service: PublicService }) {
  const router = useRouter();

  return (
    <Pressable
      testID={`service-${service.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${service.name}, ${formatPrice(service.price, APP)}, ${formatDuration(service.durationMinutes)}`}
      accessibilityHint="Opens service details"
      onPress={() => router.push({ pathname: '/service/[id]', params: { id: service.id } })}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.top}>
        <View style={styles.nameWrap}>
          <Text style={styles.name} numberOfLines={2}>
            {service.name}
          </Text>
          {service.isFeatured && (
            <MaterialCommunityIcons name="star" size={14} color={colors.gold} accessibilityLabel="House favourite" />
          )}
        </View>
        <Text style={styles.price}>{formatPrice(service.price, APP)}</Text>
      </View>

      <View style={styles.bottom}>
        {service.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {service.description}
          </Text>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <View style={styles.duration}>
          <MaterialCommunityIcons name="clock-outline" size={13} color={colors.textMuted} />
          <Text style={styles.durationText}>{formatDuration(service.durationMinutes)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  pressed: { backgroundColor: 'rgba(201, 164, 92, 0.06)' },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  nameWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontFamily: fonts.semibold, fontSize: 17, color: colors.text, flexShrink: 1 },
  price: { fontFamily: fonts.bold, fontSize: 17, color: colors.gold },
  bottom: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 6 },
  description: { flex: 1, fontSize: 14, lineHeight: 20, color: colors.textMuted },
  duration: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  durationText: { fontSize: 13, color: colors.textMuted, fontFamily: fonts.medium },
});
