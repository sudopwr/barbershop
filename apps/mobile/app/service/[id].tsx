import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryIcon } from '@/components/category-icon';
import { ServiceRow } from '@/components/service-row';
import { EmptyState, ErrorState, LoadingRows } from '@/components/states';
import { APP, SHOP } from '@/config/env';
import { useCatalog } from '@/hooks/use-catalog';
import { findService, relatedServices } from '@/lib/catalog';
import { colors, fonts } from '@/theme';
import { formatDuration, formatPrice, toTelUrl } from '@/utils/format';

export default function ServiceScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useCatalog();
  const service = findService(data, id);

  if (isLoading) return <LoadingRows rows={3} />;
  if (isError && !data) return <ErrorState message={error?.message} onRetry={() => refetch()} />;
  if (!service) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.ink }}>
        <EmptyState title="This service isn't on the menu anymore" text="It may have been renamed or removed." />
        <Button mode="contained" onPress={() => router.replace('/menu')} style={{ alignSelf: 'center' }}>
          Back to the menu
        </Button>
      </View>
    );
  }

  const related = relatedServices(data, service);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ title: service.category.name }} />
      <ScrollView testID="service-screen" contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.media}>
          {service.imageUrl ? (
            <Image
              source={{ uri: service.imageUrl }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={250}
              accessibilityLabel={service.name}
            />
          ) : (
            <CategoryIcon icon={service.category.icon} size={72} color={colors.gold} />
          )}
        </View>

        <View style={styles.body}>
          {service.isFeatured && (
            <View style={styles.badge}>
              <MaterialCommunityIcons name="star" size={13} color={colors.ink} />
              <Text style={styles.badgeText}>House favourite</Text>
            </View>
          )}

          <Text style={styles.name} accessibilityRole="header" testID="service-name">
            {service.name}
          </Text>

          <View style={styles.facts}>
            <View style={styles.fact}>
              <Text style={styles.factLabel}>PRICE</Text>
              <Text style={styles.factValue} testID="service-price">
                {formatPrice(service.price, APP)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.fact}>
              <Text style={styles.factLabel}>DURATION</Text>
              <Text style={[styles.factValue, { color: colors.text }]}>{formatDuration(service.durationMinutes)}</Text>
            </View>
          </View>

          {service.description ? <Text style={styles.description}>{service.description}</Text> : null}

          <Button
            mode="contained"
            icon="phone"
            onPress={() => Linking.openURL(toTelUrl(SHOP.phone))}
            style={{ marginTop: 28 }}
            contentStyle={{ paddingVertical: 6 }}
          >
            Call the shop
          </Button>
          <Text style={styles.note}>Walk-ins welcome · prices include taxes</Text>
        </View>

        {related.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.relatedTitle}>More in {service.category.name}</Text>
            {related.map((s) => (
              <ServiceRow key={s.id} service={s} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  media: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201,164,92,0.10)',
    overflow: 'hidden',
  },
  body: { padding: 20 },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: colors.gold,
    marginBottom: 12,
  },
  badgeText: { color: colors.ink, fontFamily: fonts.bold, fontSize: 12 },
  name: { fontFamily: fonts.display, fontSize: 32, lineHeight: 38, color: colors.text },
  facts: {
    flexDirection: 'row',
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.paper,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  fact: { flex: 1, alignItems: 'center' },
  factLabel: { color: colors.textFaint, fontSize: 11, letterSpacing: 1.6, fontFamily: fonts.semibold },
  factValue: { color: colors.gold, fontFamily: fonts.bold, fontSize: 22, marginTop: 4 },
  divider: { width: StyleSheet.hairlineWidth, backgroundColor: colors.divider },
  description: { color: colors.textMuted, fontSize: 16, lineHeight: 24, marginTop: 20 },
  note: { color: colors.textFaint, fontSize: 12, textAlign: 'center', marginTop: 10 },
  relatedTitle: { fontFamily: fonts.displaySemi, fontSize: 20, color: colors.text, paddingHorizontal: 20, marginBottom: 4 },
});
