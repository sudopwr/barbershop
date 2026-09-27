import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors, fonts } from '@/theme';

export function SectionTitle({ overline, title, action }: { overline?: string; title: string; action?: React.ReactNode }) {
  return (
    <View style={styles.wrap}>
      <View style={{ flex: 1 }}>
        {overline ? <Text style={styles.overline}>{overline.toUpperCase()}</Text> : null}
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 16 },
  overline: { color: colors.gold, fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 2.4, marginBottom: 4 },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.text },
});
