import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SHOP } from '@/config/env';
import { colors, fonts } from '@/theme';
import { toTelUrl } from '@/utils/format';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export default function VisitScreen() {
  const contacts: { icon: IconName; label: string; value: string; url: string }[] = [
    { icon: 'map-marker-outline', label: 'Address', value: SHOP.address, url: SHOP.mapsUrl },
    { icon: 'phone-outline', label: 'Phone', value: SHOP.phone, url: toTelUrl(SHOP.phone) },
    { icon: 'email-outline', label: 'Email', value: SHOP.email, url: `mailto:${SHOP.email}` },
    ...(SHOP.instagram
      ? [{ icon: 'instagram' as IconName, label: 'Instagram', value: 'Follow our work', url: SHOP.instagram }]
      : []),
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView testID="visit-screen" contentContainerStyle={styles.content}>
        <Text style={styles.overline}>VISIT US</Text>
        <Text style={styles.title} accessibilityRole="header">
          Drop in for a fresh cut
        </Text>
        <Text style={styles.lead}>Walk-ins are always welcome. Call ahead at busy times and we’ll tell you the wait.</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="clock-outline" size={22} color={colors.gold} />
            <Text style={styles.cardTitle} accessibilityRole="header">
              Opening hours
            </Text>
          </View>
          {SHOP.hours.map((row, i) => (
            <View key={row.label} style={[styles.hoursRow, i === SHOP.hours.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.hoursLabel}>{row.label}</Text>
              <Text style={styles.hoursTime}>{row.time}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { paddingVertical: 4 }]}>
          {contacts.map((c, i) => (
            <Pressable
              key={c.label}
              accessibilityRole="link"
              accessibilityLabel={`${c.label}: ${c.value}`}
              onPress={() => Linking.openURL(c.url)}
              style={({ pressed }) => [styles.contact, i < contacts.length - 1 && styles.contactBorder, pressed && { opacity: 0.7 }]}
            >
              <MaterialCommunityIcons name={c.icon} size={22} color={colors.gold} />
              <View style={{ flex: 1 }}>
                <Text style={styles.contactLabel}>{c.label}</Text>
                <Text style={styles.contactValue}>{c.value}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textFaint} />
            </Pressable>
          ))}
        </View>

        <Button mode="contained" icon="directions" onPress={() => Linking.openURL(SHOP.mapsUrl)} contentStyle={{ paddingVertical: 6 }}>
          Get directions
        </Button>
        <Button mode="outlined" icon="phone" onPress={() => Linking.openURL(toTelUrl(SHOP.phone))} style={{ marginTop: 12 }} contentStyle={{ paddingVertical: 6 }}>
          Call {SHOP.phone}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  content: { padding: 20, paddingBottom: 40 },
  overline: { color: colors.gold, fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 2.4 },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, color: colors.text, marginTop: 6 },
  lead: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginTop: 10, marginBottom: 24 },
  card: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: colors.paper,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
    marginBottom: 20,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  cardTitle: { fontFamily: fonts.display, fontSize: 22, color: colors.text },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  hoursLabel: { color: colors.textMuted, fontSize: 15 },
  hoursTime: { color: colors.text, fontFamily: fonts.semibold, fontSize: 15 },
  contact: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  contactBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
  contactLabel: { color: colors.textFaint, fontSize: 12, fontFamily: fonts.medium },
  contactValue: { color: colors.text, fontSize: 15, marginTop: 2 },
});
