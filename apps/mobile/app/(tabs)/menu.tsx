import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, SectionList, StyleSheet, View } from 'react-native';
import { Chip, Searchbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryIcon } from '@/components/category-icon';
import { ServiceRow } from '@/components/service-row';
import { EmptyState, ErrorState, LoadingRows } from '@/components/states';
import { useCatalog } from '@/hooks/use-catalog';
import { toMenuSections } from '@/lib/catalog';
import { colors, fonts } from '@/theme';

export default function MenuScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, error, refetch, isRefetching } = useCatalog();

  const selected = category ?? '';
  const sections = useMemo(
    () => toMenuSections(data, { slug: selected || undefined, search }),
    [data, selected, search]
  );

  const select = (slug: string) => router.setParams({ category: slug || undefined });

  const renderEmpty = () => {
    if (isLoading) return <LoadingRows />;
    if (isError) return <ErrorState message={error?.message} onRetry={() => refetch()} />;
    if (search) return <EmptyState title={`No services match “${search}”`} text="Try another word, or clear the search." />;
    return <EmptyState title="Our menu is being updated" text="Pop in or give us a call — we’ll be happy to help." />;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Services & prices
        </Text>
        <Searchbar
          testID="menu-search"
          placeholder="Search services"
          value={search}
          onChangeText={setSearch}
          style={styles.search}
          inputStyle={{ fontFamily: fonts.body, minHeight: 0 }}
          iconColor={colors.textMuted}
          accessibilityLabel="Search services"
        />
      </View>

      {!!data?.categories.length && data.categories.length > 1 && (
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            <Chip selected={!selected} showSelectedCheck={false} onPress={() => select('')} style={chipStyle(!selected)} textStyle={chipText(!selected)} testID="chip-all">
              All
            </Chip>
            {data.categories.map((c) => (
              <Chip
                key={c.id}
                testID={`chip-${c.slug}`}
                selected={selected === c.slug}
                showSelectedCheck={false}
                onPress={() => select(selected === c.slug ? '' : c.slug)}
                style={chipStyle(selected === c.slug)}
                textStyle={chipText(selected === c.slug)}
                icon={({ color, size }) => <CategoryIcon icon={c.icon} color={selected === c.slug ? colors.ink : color} size={size} />}
              >
                {c.name}
              </Chip>
            ))}
          </ScrollView>
        </View>
      )}

      <SectionList
        testID="menu-list"
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ServiceRow service={item} />}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <CategoryIcon icon={section.icon} size={20} color={colors.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle} accessibilityRole="header">
                {section.title}
              </Text>
              {section.description ? (
                <Text style={styles.sectionDescription} numberOfLines={1}>
                  {section.description}
                </Text>
              ) : null}
            </View>
          </View>
        )}
        stickySectionHeadersEnabled
        ListEmptyComponent={renderEmpty}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.gold} />}
      />
    </SafeAreaView>
  );
}

const chipStyle = (active: boolean) => ({
  backgroundColor: active ? colors.gold : 'transparent',
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: active ? colors.gold : 'rgba(244,239,230,0.24)',
});
const chipText = (active: boolean) => ({ color: active ? colors.ink : colors.text, fontFamily: fonts.semibold });

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12, gap: 14 },
  title: { fontFamily: fonts.display, fontSize: 30, color: colors.text },
  search: { backgroundColor: colors.paper, borderRadius: 14, height: 48 },
  chips: { paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: colors.ink,
  },
  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201,164,92,0.12)',
  },
  sectionTitle: { fontFamily: fonts.display, fontSize: 21, color: colors.text },
  sectionDescription: { color: colors.textMuted, fontSize: 13 },
});
