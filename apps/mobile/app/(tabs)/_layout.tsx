import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { colors, fonts } from '@/theme';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const tabIcon =
  (name: IconName) =>
  ({ color, size }: { color: string; size: number }) => <MaterialCommunityIcons name={name} color={color} size={size} />;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 11 },
        tabBarStyle: { backgroundColor: colors.ink, borderTopColor: colors.divider },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarButtonTestID: 'tab-home', tabBarIcon: tabIcon('home-variant') }} />
      <Tabs.Screen name="menu" options={{ title: 'Menu', tabBarButtonTestID: 'tab-menu', tabBarIcon: tabIcon('content-cut') }} />
      <Tabs.Screen name="visit" options={{ title: 'Visit', tabBarButtonTestID: 'tab-visit', tabBarIcon: tabIcon('map-marker-outline') }} />
    </Tabs>
  );
}
