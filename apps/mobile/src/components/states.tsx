import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { colors, fonts } from '@/theme';

export function ErrorState({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <View style={styles.box} accessibilityRole="alert" testID="error-state">
      <MaterialCommunityIcons name="wifi-off" size={40} color={colors.textFaint} />
      <Text style={styles.title}>We couldn&apos;t load the menu</Text>
      <Text style={styles.text}>{message ?? 'Please check your connection and try again.'}</Text>
      <Button mode="outlined" icon="refresh" onPress={onRetry} style={{ marginTop: 16 }}>
        Try again
      </Button>
    </View>
  );
}

export function EmptyState({ title, text }: { title: string; text?: string }) {
  return (
    <View style={styles.box} testID="empty-state">
      <MaterialCommunityIcons name="content-cut" size={40} color={colors.textFaint} />
      <Text style={styles.title}>{title}</Text>
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
}

/** Lightweight placeholder rows while the catalog loads. */
export function LoadingRows({ rows = 5 }: { rows?: number }) {
  return (
    <View testID="loading-state" accessibilityLabel="Loading services" accessibilityState={{ busy: true }}>
      {Array.from({ length: rows }, (_, i) => (
        <View key={i} style={styles.skeletonRow}>
          <View style={[styles.bar, { width: '60%' }]} />
          <View style={[styles.bar, { width: '85%', height: 10, marginTop: 10, opacity: 0.6 }]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 },
  title: { fontFamily: fonts.semibold, fontSize: 17, color: colors.text, marginTop: 16, textAlign: 'center' },
  text: { color: colors.textMuted, marginTop: 6, textAlign: 'center', lineHeight: 20 },
  skeletonRow: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  bar: { height: 14, borderRadius: 7, backgroundColor: colors.paperRaised },
});
