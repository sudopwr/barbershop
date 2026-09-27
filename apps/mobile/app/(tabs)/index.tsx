import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Linking, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryIcon } from '@/components/category-icon';
import { FeaturedCard } from '@/components/featured-card';
import { SectionTitle } from '@/components/section-title';
import { ErrorState } from '@/components/states';
import { APP, SHOP } from '@/config/env';
import { useCatalog } from '@/hooks/use-catalog';
import { countServices } from '@/lib/catalog';
import { colors, fonts } from '@/theme';
import { formatPrice, toTelUrl } from '@/utils/format';

export default function HomeScreen() {
  const router = useRouter();
  const { data, isError, error, refetch, isRefetching } = useCatalog();
  const total = countServices(data);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        testID="home-screen"
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.gold} />}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.brandRow}>
            <View style={styles.logo}>
              <MaterialCommunityIcons name="content-cut" size={20} color={colors.ink} />
            </View>
            <Text style={styles.brand}>{SHOP.name}</Text>
          </View>

          <Text style={styles.headline} accessibilityRole="header">
            Look sharp.{'\n'}
            <Text style={styles.headlineAccent}>Feel sharper.</Text>
          </Text>
          <Text style={styles.tagline}>{SHOP.tagline}</Text>

          <View style={styles.chips}>
            {data?.priceFrom != null && (
              <Chip icon="tag-outline" style={styles.chip} textStyle={styles.chipText} testID="price-from">
                From {formatPrice(data.priceFrom, APP)}
              </Chip>
            )}
            {total > 0 && (
              <Chip icon="content-cut" style={styles.chip} textStyle={styles.chipText}>
                {`${total} services`}
              </Chip>
            )}
            <Chip icon="walk" style={styles.chip} textStyle={styles.chipText}>
              Walk-ins welcome
            </Chip>
          </View>

          <View style={styles.ctas}>
            <Button
              mode="contained"
              icon="arrow-right"
              contentStyle={{ flexDirection: 'row-reverse', paddingVertical: 4 }}
              onPress={() => router.navigate('/menu')}
              testID="cta-menu"
            >
              See the menu
            </Button>
            <Button mode="outlined" icon="phone" onPress={() => Linking.openURL(toTelUrl(SHOP.phone))} contentStyle={{ paddingVertical: 4 }}>
              Call us
            </Button>
          </View>
        </View>

        {isError && <ErrorState message={error?.message} onRetry={() => refetch()} />}

        {/* Featured */}
        {!!data?.featured.length && (
          <View style={styles.section}>
            <SectionTitle overline="House favourites" title="Most requested" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
              {data.featured.map((service) => (
                <FeaturedCard key={service.id} service={service} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Categories */}
        {!!data?.categories.length && (
          <View style={styles.section}>
            <SectionTitle overline="The menu" title="Browse by category" />
            <View style={styles.grid}>
              {data.categories.map((category) => (
                <Pressable
                  key={category.id}
                  testID={`category-${category.slug}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${category.name}, ${category.services.length} services`}
                  onPress={() => router.navigate({ pathname: '/menu', params: { category: category.slug } })}
                  style={({ pressed }) => [styles.tile, pressed && { opacity: 0.8 }]}
                >
                  <View style={styles.tileIcon}>
                    <CategoryIcon icon={category.icon} size={26} color={colors.gold} />
                  </View>
                  <Text style={styles.tileTitle} numberOfLines={1}>
                    {category.name}
                  </Text>
                  <Text style={styles.tileMeta}>
                    {category.services.length} {category.services.length === 1 ? 'service' : 'services'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Opening hours teaser */}
        <Pressable onPress={() => router.navigate('/visit')} style={styles.visit} accessibilityRole="button">
          <MaterialCommunityIcons name="clock-outline" size={24} color={colors.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.visitTitle}>Opening hours & directions</Text>
            <Text style={styles.visitText} numberOfLines={1}>
              {SHOP.address}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  hero: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 32 },
  logo: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  brand: { fontFamily: fonts.display, fontSize: 18, color: colors.text },
  headline: { fontFamily: fonts.display, fontSize: 44, lineHeight: 50, color: colors.text },
  headlineAccent: { fontFamily: fonts.displayItalic, color: colors.gold },
  tagline: { color: colors.textMuted, fontSize: 16, lineHeight: 24, marginTop: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 20 },
  chip: { backgroundColor: 'transparent', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(244,239,230,0.24)' },
  chipText: { fontFamily: fonts.medium, color: colors.text },
  ctas: { gap: 12, marginTop: 28 },
  section: { marginTop: 24, marginBottom: 12 },
  carousel: { paddingHorizontal: 20, gap: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14 },
  tile: {
    width: '46%',
    flexGrow: 1,
    margin: 6,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.paper,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  tileIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201,164,92,0.12)',
    marginBottom: 14,
  },
  tileTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  tileMeta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  visit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 20,
    marginTop: 24,
    padding: 18,
    borderRadius: 18,
    backgroundColor: 'rgba(201,164,92,0.08)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(201,164,92,0.3)',
  },
  visitTitle: { fontFamily: fonts.semibold, color: colors.text, fontSize: 15 },
  visitText: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
});
