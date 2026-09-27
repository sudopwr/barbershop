import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

import { EmptyState } from '@/components/states';
import { colors } from '@/theme';

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.ink, alignItems: 'center' }}>
      <Stack.Screen options={{ title: 'Not found' }} />
      <EmptyState title="This page doesn't exist" />
      <Link href="/" style={{ color: colors.gold, fontSize: 16 }}>
        Go to the home screen
      </Link>
    </View>
  );
}
